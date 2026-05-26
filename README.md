# DriveSight

DriveSight is a web app for US driving test prep. Users sign in, pick a state on an interactive map, take practice quizzes, and browse official US road symbol sign reference sheets.

## Features

- **Account required** — All app routes are protected; users must log in or create an account.
- **State dashboard** — Interactive US map with per-state question counts, search, and a saved home state.
- **Practice tests** — Shuffled Q&A, adaptive difficulty, category/difficulty tags, review summary, wrong-answer-only mode, attempt + progress persistence.
- **Programmatic SEO** — ~800 public pages: `/dmv/{state}/{testType}`, `/dmv/{state}/category/{topic}`, `/guides` (see `docs/SEO_ARCHITECTURE.md`).
- **Road signs library** — Dedicated viewer at `/road-signs` with sheet navigation, keyboard shortcuts, and scrollable high-resolution sheets.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (Auth + Postgres)
- CSS (no UI framework)

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project
- Python 3.11+ (only if you need to re-extract road sign images from the PDF)

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd DriveSight
npm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key
```

Find these in the Supabase dashboard under **Project Settings → API**.

### 3. Database setup (schema + all question seeds)

SQL is split into editable parts and **bundled automatically**:

| Path | Purpose |
|------|---------|
| `supabase/schema/base.sql` | Tables, RLS, all 50 states + DC, `sync_state_question_counts()` |
| `supabase/seeds/*.sql` | Per-state question banks (CA, AL, AK, …) |
| `supabase/schema.sql` | **Generated** — run this once in Supabase SQL editor (schema + all seeds) |
| `supabase/seed.sql` | **Generated** — question seeds only (after schema exists) |
| `supabase/migrations/` | Runs on deploy when using Supabase CLI / GitHub integration |

Rebuild after editing base schema or any seed:

```bash
npm run db:build
```

**Option A — Supabase SQL editor (one file):**

Run the full generated file:

```text
supabase/schema.sql
```

That creates tables, loads every file in `supabase/seeds/`, then syncs `question_count` on each state from active rows.

**Option B — Supabase CLI (migrations + seeds):**

If you see `Cannot find project ref. Have you run supabase link?`, use **one** of these:

*B1 — Link the project (opens browser to log in):*

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

Use the ref from your dashboard URL or from `NEXT_PUBLIC_SUPABASE_URL` (`https://YOUR_PROJECT_REF.supabase.co`). When prompted, enter your **database password** (Supabase → Project Settings → Database).

Then push:

```bash
npm run db:build
npx supabase db push --include-seed
```

*B2 — Push with database password (no link):*

Add to `.env.local` (see `.env.example`):

```env
SUPABASE_DB_PASSWORD=your-database-password
```

Then:

```bash
npm run db:build
npm run db:push
```

Migrations apply in order (`20250522000000` → `000001` → `000002` → `100000` seeds). `db:push` also applies `supabase/seed.sql` when using `--include-seed`.

**Option C — SQL editor only (no CLI):**

```bash
npm run db:build
```

Paste/run `supabase/schema.sql` in the Supabase SQL editor.

Tables:

- `state_driving_tests` — state metadata; counts updated by `sync_state_question_counts()`
- `driving_test_questions` — prompts, choices, metadata (`category`, `difficulty`, `source`, `is_active`)
- `user_question_attempts` — per-user answer history
- `user_progress` — streaks, accuracy, weak categories

### Adding a new state question bank

1. Add `supabase/seeds/your-state-N.json`
2. `python scripts/import-questions.py supabase/seeds/your-state-N.json drivesight-xx-n` (also runs `db:build`)
3. Deploy: push migrations or re-run `supabase/schema.sql`

Existing banks: California (100 + 12 extra), Colorado (12), Connecticut (12), Delaware (12), Florida (11), Georgia (12), Hawaii (12), Idaho (12), Illinois (12), Indiana (12), Alabama (25), Alaska (15), Arizona (12), Arkansas (10) — JSON + SQL under `supabase/seeds/`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/login` until you sign in or create an account.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run extract-signs` | Regenerate PNG sheets from `app/assets/us_road_symbol_signs.pdf` (requires `pip install pymupdf`) |
| `npm run seed:california` | Generate 100 California practice questions (JSON + SQL) |
| `npm run seed:alabama` | Generate 25 Alabama practice questions SQL from `alabama-25.json` |
| `npm run seed:alaska` | Generate 15 Alaska practice questions SQL from `alaska-15.json` |
| `npm run db:build` | Bundle `base.sql` + all `seeds/*.sql` → `schema.sql`, `seed.sql`, migration |
| `npm run db:push` | Push migrations + seeds using `SUPABASE_DB_PASSWORD` or `DATABASE_URL` in `.env.local` |
| `npm run seed:arizona` | Generate 12 Arizona questions SQL from `arizona-12.json` |
| `npm run seed:arkansas` | Generate 10 Arkansas questions SQL from `arkansas-10.json` |
| `npm run seed:california-extra` | Generate 12 additional California questions (`california-extra-12.json`) |
| `npm run seed:colorado` | Generate 12 Colorado questions SQL from `colorado-12.json` |
| `npm run seed:connecticut` | Generate 12 Connecticut questions SQL from `connecticut-12.json` |
| `npm run seed:delaware` | Generate 12 Delaware questions SQL from `delaware-12.json` |
| `npm run seed:florida` | Generate 11 Florida questions SQL from `florida-11.json` |
| `npm run seed:georgia` | Generate 12 Georgia questions SQL from `georgia-12.json` |
| `npm run seed:hawaii` | Generate 12 Hawaii questions SQL from `hawaii-12.json` |
| `npm run seed:idaho` | Generate 12 Idaho questions SQL from `idaho-12.json` |
| `npm run seed:illinois` | Generate 12 Illinois questions SQL from `illinois-12.json` |
| `npm run seed:indiana` | Generate 12 Indiana questions SQL from `indiana-12.json` |

## Project structure

```
app/
  page.tsx              # Dashboard (state map + list)
  login/page.tsx        # Sign in / sign up
  road-signs/page.tsx   # US road symbol signs viewer
  states/[code]/        # State practice test
  auth/actions.ts       # Server actions for auth
components/
  Dashboard.tsx
  RoadSignsViewer.tsx
  PracticeTest.tsx
  AppHeader.tsx
lib/
  states.ts             # State metadata and question helpers
  road-signs.ts         # Sign sheet image paths
public/
  assets/us-road-signs/ # Extracted sign sheet PNGs
  usa-map.svg
scripts/
  extract-road-signs.py
supabase/
  schema.sql
proxy.ts                # Auth middleware (redirects unauthenticated users)
```

## Authentication

- Login, sign-up, and password reset are handled via Supabase Auth server actions in `app/auth/actions.ts`.
- `proxy.ts` redirects unauthenticated users to `/login` and sends logged-in users away from the login page.
- An account is required to use the app; there is no guest browsing mode.

## Road sign assets

Reference sheets are sourced from `app/assets/us_road_symbol_signs.pdf` and exported to `public/assets/us-road-signs/` as PNGs. To refresh images after updating the PDF:

```bash
pip install pymupdf
npm run extract-signs
```

## Deployment

1. Set the same Supabase environment variables in your hosting provider (e.g. Vercel).
2. Run `npm run build` and deploy the Next.js app.
3. In Supabase **Authentication → URL Configuration**, add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`
   - Set **Site URL** to your app origin (e.g. `http://localhost:3000`)

4. Optional: set `NEXT_PUBLIC_SITE_URL` in `.env.local` if password reset emails need a fixed origin in production.

## License

See [LICENSE](LICENSE).
