// One-time setup script: creates the two admin accounts (Cote + developer
// fallback) and marks both as is_admin in the profiles table.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... \
//   node scripts/seed-admins.mjs "cote@example.com" "TempPassword123!" "Cote Lind" \
//                                 "dev@example.com" "TempPassword123!" "Developer"
//
// Both people should change their password on first login.

import { createClient } from "@supabase/supabase-js";

const [
  coteEmail, cotePassword, coteName,
  devEmail, devPassword, devName,
] = process.argv.slice(2);

if (!coteEmail || !cotePassword || !devEmail || !devPassword) {
  console.error(
    "Usage: node scripts/seed-admins.mjs <cote-email> <cote-password> <cote-name> <dev-email> <dev-password> <dev-name>"
  );
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createAdmin(email, password, displayName) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error(`Failed to create ${email}:`, error.message);
    return;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: data.user.id, display_name: displayName, is_admin: true });

  if (profileError) {
    console.error(`Failed to set profile for ${email}:`, profileError.message);
    return;
  }

  console.log(`Created admin: ${email}`);
}

await createAdmin(coteEmail, cotePassword, coteName || "Cote Lind");
await createAdmin(devEmail, devPassword, devName || "Developer");
