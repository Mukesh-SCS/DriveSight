# DriveSight

DriveSight is a web app for US driving test prep. Users sign in, pick a state on an interactive map, take practice quizzes, and browse official US road symbol sign reference sheets.

## Features

- **Account required** — All app routes are protected; users must log in or create an account.
- **State dashboard** — Interactive US map with per-state question counts, search, and a saved home state.
- **Practice tests** — Shuffled questions and answer choices, category/difficulty tags, review summary, wrong-answer-only mode, and attempt history.
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

### 3. Database setup

In the Supabase SQL editor, run the schema and seed data:

```bash
# File to run:
supabase/schema.sql
```

This creates:

- `state_driving_tests` — state metadata and question counts
- `driving_test_questions` — prompts, choices, metadata (`category`, `difficulty`, `source`, `is_active`)
- `user_question_attempts` — per-user answer history (RLS: users can only access their own rows)

Then run the migration (if upgrading an existing database):

```bash
supabase/migrations/20250522000000_question_metadata_and_attempts.sql
```

### California question bank (100 questions)

Generate seed files:

```bash
npm run seed:california
```

Import in Supabase SQL editor:

```bash
supabase/seeds/california-100.sql
```

JSON format is also available at `supabase/seeds/california-100.json`.

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
