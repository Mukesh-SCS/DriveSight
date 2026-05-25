# DriveSight Improvement Plan

This document captures the product roadmap aligned with content scale, retention, and SEO.

## Current strengths

- Next.js App Router + Supabase architecture
- State practice flow, road signs viewer, auth
- Question categories, difficulty, review mode, shuffled answers
- California 100-question seed pipeline

## Priority bottlenecks

1. **Question bank size** — target 100+ questions per top-10 state
2. **Retention** — progress, streaks, weak categories (implemented in `user_progress`)
3. **State-specific content** — avoid generic questions; cite real state rules
4. **SEO** — public landing pages at `/dmv/[slug]` + sitemap
5. **Adaptive difficulty** — easy / medium / hard pools based on accuracy

## Database

Run migrations in order:

1. `supabase/migrations/20250522000000_question_metadata_and_attempts.sql`
2. `supabase/migrations/20250522000001_user_progress_and_tags.sql`

Seed California:

```bash
npm run seed:california
# then run supabase/seeds/california-100.sql in Supabase
```

## Scaling plan

### Week 1

- California, Texas, Florida — 100 questions each

### Week 2

- New York, Pennsylvania, Illinois — 100 questions each

### Week 3

- Analytics dashboard, exam simulation mode, timer mode

### Week 4

- More SEO pages, blog content, structured metadata

## Question generation pipeline (recommended)

```
AI draft → validation → duplicate check → Supabase insert
```

Add duplicate detection (exact prompt match + similarity) before bulk imports.

## Monetization (later)

Wait until:

- 50k+ total questions
- SEO traffic
- Returning users

Then consider premium mock exams, ad-free mode, AI explanations.
