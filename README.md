# SINA Supplies and Logistics — backend

Lead-capture backend for the public site, plus a staff-only dashboard for
managing inquiries and editing site content. No client-facing login exists
— the business is high-touch B2B, not self-service tracking.

## Stack

- **Next.js 14** (App Router)
- **PostgreSQL** via **Prisma**
- **NextAuth** — one auth instance, staff-only (`lib/auth-staff.ts`)
- **Upstash Redis** — rate limiting on login and public form submissions
- **Nodemailer** — email notification when a new inquiry comes in
- **bcrypt** — password hashing (12 salt rounds)

## What this backend actually does

1. The public Contact form (once wired up — see "Next steps" below) POSTs
   to `/api/inquiries`. That saves the lead to the database and fires an
   email notification to `STAFF_NOTIFICATION_EMAIL`.
2. Staff log in at `/staff/login` and see all inquiries at `/staff`, with
   filtering by status and one-click status updates (NEW → CONTACTED →
   QUOTED → WON/LOST).
3. Staff can edit a starter set of site text at `/staff/content` — each
   editable field is a row in the `ContentBlock` table, fetched by page.

## Local setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in real values — see that
   file for what each variable does. You'll need: a Postgres database, an
   Upstash Redis instance (free tier is enough), and SMTP credentials for
   whichever email provider you're using.
3. Set up the database roles per `docs/database-roles.md`.
4. Run the migration:
   ```
   npm run prisma:migrate
   ```
5. Seed the first admin account and starter content:
   ```
   npm run prisma:seed
   ```
   This creates `admin@sinatrading.et` / `ChangeMe123!` — **change this
   password immediately** after your first real login.
6. Start the dev server:
   ```
   npm run dev
   ```
7. Visit `/staff/login` and sign in with the seeded admin account.

## What's built

- [x] Database schema — `StaffUser`, `Inquiry`, `InquiryStatusChange`,
      `ContentBlock`, `AuditLog`
- [x] Staff login (`/staff/login`) with rate limiting and audit logging
- [x] Route protection middleware for all `/staff/**` pages
- [x] Inquiries dashboard (`/staff`) — filter, view, update status
- [x] Content editor (`/staff/content`) — edit the starter content blocks
- [x] Public inquiry submission API (`/api/inquiries`, rate-limited)
- [x] CORS support so the static site can call this API cross-origin
- [x] Email notification on new inquiry (Nodemailer, generic SMTP)
- [x] Seed script for first admin + starter content blocks
- [x] Contact page wired to POST real inquiries to this backend, with a
      `mailto:` fallback if the API is unreachable

## Next steps — not built yet

- [ ] **Migrate the static HTML pages into this Next.js app** so they can
      actually read from `ContentBlock` instead of having text hardcoded.
      Right now the seed script creates editable rows, and the CMS can
      edit them, but the public pages don't fetch them yet — editing
      content in the dashboard has no visible effect until this is done.
      Only a handful of Home/About/Contact fields are seeded so far as a
      proof of concept; more fields need adding as more sections migrate.
- [ ] MFA enrollment flow for staff accounts (schema field already exists
      — `StaffUser.mfaSecret`)
- [ ] Image upload for `IMAGE_URL` content blocks (currently would need a
      manual URL paste — no upload UI yet)
- [ ] **Update `API_BASE_URL` in `sina-web/js/contact.js`** from
      `http://localhost:3000` to the real deployed backend URL once this
      app is actually hosted somewhere — and set `PUBLIC_SITE_ORIGIN` in
      `.env` to the real static site's domain, locking CORS down from `*`.

## Security checklist before going live

- [ ] `STAFF_AUTH_SECRET` is random, 32+ bytes, not committed anywhere
- [ ] Database app role follows `docs/database-roles.md`
- [ ] Seeded admin password has been changed
- [ ] HTTPS enforced at the hosting/CDN level, HSTS enabled
- [ ] Automated backups on, restore tested at least once
- [ ] MFA required for all `ADMIN` staff accounts
- [ ] Cloudflare (or equivalent) in front of the app for WAF + DDoS
