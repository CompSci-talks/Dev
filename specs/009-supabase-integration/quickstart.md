# Quickstart: Supabase Setup (CLI Migration)

This guide will walk you through setting up your Supabase project using the Supabase CLI for automated migrations.

## 1. Project Initialization
The project is already initialized with `npx supabase init`. You should see a `supabase` folder in your root directory.

## 2. Authenticate and Link
First, log in to the Supabase CLI (this will open a browser window):
```bash
npx supabase login
```

Then, link your local environment to your Supabase project:
```bash
npx supabase link --project-ref kxxgeprqldabbjmbtajl
```
*(You will be prompted for your Database Password)*

## 3. Review the Migration
I have created the initial migration file at `supabase/migrations/20260314000000_initial_schema.sql`. This file includes:
- Table definitions (semesters, seminars, speakers, tags, comments, rsvps, users).
- The `set_active_semester` RPC function.
- The `public.users` sync trigger.

## 4. Push the Migration
Apply the schema and policies to your production database:
```bash
npx supabase db push
```

## 5. Configure Credentials
Ensure your `src/environments/environment.ts` is updated with your **anon key** and **project URL**.

## 6. Authentication Setup (Dashboard)
1. Go to **Authentication > Providers** in the Supabase Dashboard.
2. Ensure **Email** is enabled.
3. (Optional) Disable **Confirm Email** for development to skip email verification.
