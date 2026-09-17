import { createClient } from "@supabase/supabase-js";
import { jsonResponse } from "./cors.ts";

export interface RfpContext {
  supabaseUrl: string;
  authHeader: string;
  rfp: { id: string; organization_name: string; document_drive_url: string };
  attacherEmail: string;
}

// Shared setup for score-rfp and generate-questions: both need an
// authenticated RFP row with a document attached, plus the email of
// whoever attached it (for Drive impersonation). Returns either the
// context to proceed with, or a Response to return immediately.
export async function loadRfpContext(
  req: Request,
): Promise<{ context: RfpContext } | { response: Response }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { response: jsonResponse({ error: "Missing Authorization header" }, 401) };
  }

  const { rfp_id: rfpId } = await req.json();
  if (!rfpId) {
    return { response: jsonResponse({ error: "rfp_id is required" }, 400) };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: rfp, error: fetchError } = await supabase
    .from("rfps")
    .select("id, organization_name, document_drive_url, document_attached_by")
    .eq("id", rfpId)
    .single();

  if (fetchError || !rfp) {
    return { response: jsonResponse({ error: "RFP not found" }, 404) };
  }

  if (!rfp.document_drive_url) {
    return { response: jsonResponse({ error: "No document attached" }, 400) };
  }

  const { data: attacher, error: attacherError } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", rfp.document_attached_by)
    .single();

  if (attacherError || !attacher) {
    return { response: jsonResponse({ error: "Could not resolve who attached the document" }, 500) };
  }

  return {
    context: {
      supabaseUrl,
      authHeader,
      rfp: {
        id: rfp.id,
        organization_name: rfp.organization_name,
        document_drive_url: rfp.document_drive_url,
      },
      attacherEmail: attacher.email,
    },
  };
}
