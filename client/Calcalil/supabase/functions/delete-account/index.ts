// @ts-nocheck
// supabase/functions/delete-account/index.ts
// Deploy with: npx supabase functions deploy delete-account

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ ok: false, error: "לא מורשה" }, 401);
    }
    const token = authHeader.replace("Bearer ", "");

    // Verify the token and get the user
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data: { user }, error: userError } = await anonClient.auth.getUser(token);
    if (userError || !user) {
      return json({ ok: false, error: "משתמש לא מזוהה" }, 401);
    }

    // Delete the user using service role
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error("Delete error:", deleteError);
      return json({ ok: false, error: "מחיקת המשתמש נכשלה" }, 500);
    }

    console.log(`User ${user.id} deleted successfully`);
    return json({ ok: true });

  } catch (e) {
    console.error("Unexpected error:", e);
    return json({ ok: false, error: "שגיאה בלתי צפויה" }, 500);
  }
});
