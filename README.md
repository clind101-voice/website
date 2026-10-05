# CoteLind

Custom site for Cote Lind — Chicago singer, actor, and voice-over artist. Built to
replace the old Wix site with a fully self-serve CMS: Cote logs into `/admin` and
manages her own photos, audio, YouTube links, and page text with no developer
involvement after launch.

Stack: Next.js (App Router) + Supabase (Postgres, Auth, Storage) + Resend, deployed
on Vercel.

## One-time setup

### 1. Create a Supabase project

Create a free project at [supabase.com](https://supabase.com). From
**Project Settings → API**, grab:

- Project URL
- `anon` public key
- `service_role` secret key (server-only, never expose to the browser)

### 2. Run the database migrations

In the Supabase dashboard, open **SQL Editor** and run, in order:

```
supabase/migrations/0001_init.sql       -- tables, RLS policies, storage bucket
supabase/migrations/0002_seed_content.sql  -- real copy carried over from the Wix site
```

### 3. Create a Resend account (for contact-form email notifications)

Create a free account at [resend.com](https://resend.com) and grab an API key.
The `onboarding@resend.dev` sender in `src/lib/resend.ts` works out of the box for
testing; swap it for a verified domain sender before going live.

### 4. Environment variables

Copy `.env.local.example` to `.env.local` and fill in the four values from steps 1–3,
plus the email address that should receive contact-form notifications:

```bash
cp .env.local.example .env.local
```

### 5. Create the two admin accounts

Cote and the developer each get their own login. Run once, locally:

```bash
SUPABASE_SERVICE_ROLE_KEY=<service_role key> \
NEXT_PUBLIC_SUPABASE_URL=<project url> \
node scripts/seed-admins.mjs \
  "cote@example.com" "TempPassword123!" "Cote Lind" \
  "dev@example.com" "TempPassword123!" "Developer"
```

Both people should sign in and change their password (Supabase Auth → your project →
Authentication → Users, or add a "change password" flow later — out of scope for v1).

### 6. Run locally

```bash
npm install
npm run dev
```

Public site: [http://localhost:3000](http://localhost:3000)
Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## What Cote can do from `/admin` — no code, ever

- **Page Text** — edit the bio, section intros, and contact blurb.
- **Media, per section** (Home / About / Singing / Acting / Voice Overs) — upload
  photos (jpg/png/webp/avif, up to 10MB), upload audio (mp3/wav/m4a/ogg/aac, up to
  50MB — full songs or voice-demo reels), or paste a YouTube link. Reorder with the
  ↑/↓ buttons, edit titles and photo alt text inline, delete anytime.
- **Inquiries** — a read-only backup of every contact-form submission (each one also
  emails her directly via Resend).

## Deploying

Push to a git repo and import it into [Vercel](https://vercel.com/new). Add the same
environment variables from `.env.local` in the Vercel project settings. Until the
domain is repointed, the site is reachable at its `*.vercel.app` URL; DNS cutover to
`cotelind.me` happens separately, when Cote signs off on the new site.

`vercel.json` pins the framework preset to `nextjs`. Leave it there. If the preset is
`Other`, Vercel publishes `public/` as a plain static site and never runs the app: the
build goes green, static files like `/file.svg` still return 200, and every real route
returns Vercel's own `NOT_FOUND` page. A successful build is not evidence the site is
being served.

### Environment variables are exact names, not labels

The app reads these five and nothing else:

| Name | Needed by |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server |
| `SUPABASE_SERVICE_ROLE_KEY` | server only |
| `RESEND_API_KEY` | server only |
| `CONTACT_NOTIFY_EMAIL` | server only |

Naming them after Supabase's dashboard labels (`ANON_PUBLIC`, `SERVICE_ROLE`) does
nothing — those are never read. The `NEXT_PUBLIC_` prefix is also not cosmetic: it is
what inlines a value into the browser bundle. `src/components/admin/LogoutButton.tsx`
is a client component that builds a Supabase client, so dropping the prefix leaves it
with no credentials at all.

`NEXT_PUBLIC_*` values are baked in at **build** time, so changing one has no effect
until you redeploy. Apply all five to Production, Preview *and* Development.

### If the admin login rejects a valid user

There is no trigger on `auth.users`. `public.profiles` is written only by
`scripts/seed-admins.mjs`, which creates the auth user and its profile row together.
A user created by hand in the Supabase dashboard therefore has no profile row and no
admin rights. Insert one:

```sql
insert into public.profiles (id, display_name, is_admin)
values ('<the auth.users id>', '<display name>', true)
on conflict (id) do update set is_admin = true;
```

`display_name` is `not null`, so it must be supplied.
