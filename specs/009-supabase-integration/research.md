# Research: Supabase Migration Patterns

## Problem Statement
Transitioning from mock data to Supabase requires a robust SQL schema that matches our TypeScript models and RLS policies that enforce our authentication-gated content principle.

## SQL Schema Design

### Decisions
1. **Users Table**: Since we use Supabase Auth, we need a public `users` table synced with `auth.users` to store metadata like `display_name` and `role`.
2. **Seminars/Semesters**: Standard relational tables. `speaker_ids` and `tag_ids` in `seminars` will be implemented as many-to-many junction tables for better relational integrity, although the current adapters use an array-based approach. We will stick to the array-based approach `UUID[]` for now to minimize adapter changes, or decide on junction tables if scalability is a concern.
3. **Materials**: Referencing external IDs (Cloud Drive) as strings, per Principle VI.

### RLS Policy Strategy
- **Public**: `semesters`, `seminars`, `speakers`, `tags` are readable by Everyone (anon).
- **Protected**: `comments`, `rsvps` are readable by Authenticated users; writable only by the owner (`author_id` / `user_id`).
- **Admin**: All tables writable by users with `role = 'admin'`.

## Database Functions (RPC)

### `set_active_semester(target_id UUID)`
- Rationale: Ensuring only one semester is active at a time requires a transaction or a database function to atomicly update all rows.
- Implementation:
  ```sql
  CREATE OR REPLACE FUNCTION set_active_semester(target_id UUID)
  RETURNS VOID AS $$
  BEGIN
    UPDATE semesters SET is_active = FALSE;
    UPDATE semesters SET is_active = TRUE WHERE id = target_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```

## Alternatives Considered

### Junction Tables vs. Array Columns
- **Arrays**: Simpler to query with Supabase `.contains()`, matches current mock logic.
- **Junction Tables**: Better for complex filtering and foreign key constraints.
- **Decision**: Use `UUID[]` arrays for `speaker_ids` and `tag_ids` to maintain compatibility with existing `SupabaseSeminarService` implementation.

## Migration Steps
1. Create tables in Supabase Dashboard.
2. Enable RLS on all tables.
3. Apply RLS policies.
4. Create `set_active_semester` function.
5. (Optional) Script to migrate existing mock data if needed for initial demo.
