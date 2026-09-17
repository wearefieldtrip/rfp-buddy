import { JWT } from "google-auth-library";
import { extractText, getDocumentProxy } from "unpdf";

function extractDriveFileId(driveUrl: string): string {
  const match = driveUrl.match(/\/d\/([^/]+)/) ?? driveUrl.match(/[?&]id=([^&]+)/);
  if (!match) {
    throw new Error(`Could not extract a file id from Drive URL: ${driveUrl}`);
  }
  return match[1];
}

// Domain-wide delegation: the service account impersonates the specific
// person who attached the document (via the `subject` claim), so it only
// ever reads what that staff member could already see themselves, rather
// than acting with blanket domain-admin-level access.
async function getDriveAccessToken(impersonateEmail: string): Promise<string> {
  const credentialsJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (!credentialsJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");
  }
  const credentials = JSON.parse(credentialsJson);

  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    subject: impersonateEmail,
  });

  const { token } = await client.getAccessToken();
  if (!token) {
    throw new Error("Failed to obtain a Google Drive access token");
  }
  return token;
}

// Downloads the file and returns its extracted plain text. Only handles
// PDFs for now (the only format we've tested attaching); other Drive
// file types (native Google Docs, images) will need their own branch
// later — export via the Drive API for Docs, OCR for images.
export async function fetchDriveDocumentText(
  driveUrl: string,
  impersonateEmail: string,
): Promise<string> {
  const fileId = extractDriveFileId(driveUrl);
  const accessToken = await getDriveAccessToken(impersonateEmail);

  const metaResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType,owners(emailAddress),driveId&supportsAllDrives=true`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!metaResponse.ok) {
    throw new Error(
      `Drive metadata request failed (${metaResponse.status}): ${await metaResponse.text()}`,
    );
  }
  const meta = await metaResponse.json();

  if (meta.mimeType !== "application/pdf") {
    throw new Error(
      `Unsupported Drive file type "${meta.mimeType}" for "${meta.name}" — only PDF is supported right now.`,
    );
  }

  const fileResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!fileResponse.ok) {
    throw new Error(
      `Drive file download failed (${fileResponse.status}): ${await fileResponse.text()}`,
    );
  }

  const bytes = new Uint8Array(await fileResponse.arrayBuffer());
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: true });

  if (!text || text.trim().length === 0) {
    throw new Error("Extracted no text from the PDF — it may be a scanned image without OCR text.");
  }

  return text;
}
