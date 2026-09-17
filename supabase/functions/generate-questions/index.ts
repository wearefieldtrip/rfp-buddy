// Setup type definitions for built-in Supabase Runtime APIs (EdgeRuntime.waitUntil, etc.)
import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { fetchDriveDocumentText } from "../_shared/drive.ts";
import { CORS_HEADERS, jsonResponse } from "../_shared/cors.ts";
import { loadRfpContext } from "../_shared/rfpContext.ts";
import { generateQuestions } from "./perplexity.ts";

async function runGeneration(
  supabaseUrl: string,
  authHeader: string,
  rfpId: string,
  documentDriveUrl: string,
  attachedByEmail: string,
) {
  const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });

  try {
    const rfpText = await fetchDriveDocumentText(documentDriveUrl, attachedByEmail);
    const result = await generateQuestions(rfpText);

    await supabase
      .from("rfps")
      .update({
        questions_status: "completed",
        questions_result: result,
        questions_generated_at: new Date().toISOString(),
        questions_error: null,
      })
      .eq("id", rfpId);
  } catch (err) {
    await supabase
      .from("rfps")
      .update({
        questions_status: "failed",
        questions_error: String(err),
      })
      .eq("id", rfpId);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  const loaded = await loadRfpContext(req);
  if ("response" in loaded) return loaded.response;
  const { supabaseUrl, authHeader, rfp, attacherEmail } = loaded.context;

  const { error: updateError } = await createClient(
    supabaseUrl,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  )
    .from("rfps")
    .update({ questions_status: "generating", questions_error: null })
    .eq("id", rfp.id);

  if (updateError) {
    return jsonResponse({ error: updateError.message }, 500);
  }

  // @ts-expect-error EdgeRuntime is a Supabase-provided global at runtime
  EdgeRuntime.waitUntil(
    runGeneration(supabaseUrl, authHeader, rfp.id, rfp.document_drive_url, attacherEmail),
  );

  return jsonResponse({ status: "generating" }, 202);
});
