

## Plan: Make Fidelización Tab Fully Functional

### Problem
The "Fidelización" tab in Clientes renders `LoyaltyConfig` (`src/components/clientes/LoyaltyConfig.tsx`) which uses **local state only** -- nothing persists to the database. Meanwhile, `LoyaltyTab` in Configuración already has a fully working, database-backed version using `useSettings("loyalty", ...)`.

### Solution
Replace the `LoyaltyConfig` import in `Clientes.tsx` with the already-functional `LoyaltyTab` component from Configuración. This immediately makes the Fidelización tab fully persistent and in sync with the Configuración module.

Additionally, ensure a `loyalty` row exists in `business_settings` so the first save via upsert works correctly.

### Changes

1. **`src/pages/Clientes.tsx`** -- Replace `LoyaltyConfig` import with `LoyaltyTab`:
   - Change import from `@/components/clientes/LoyaltyConfig` to `@/components/configuracion/LoyaltyTab`
   - Replace `<LoyaltyConfig />` with `<LoyaltyTab />`

2. **`src/hooks/useSettings.ts`** -- Change mutation from `update` to `upsert` so settings that don't yet exist in the database get created on first save (currently uses `.update()` which silently fails if the row doesn't exist):
   - Use `.upsert({ setting_key, setting_value, updated_by })` instead of `.update().eq()`

3. **Delete `src/components/clientes/LoyaltyConfig.tsx`** -- No longer needed since we use the Configuración version.

### Technical Details
The `useSettings` hook currently uses `.update().eq("setting_key", ...)` which does nothing if the row doesn't exist yet. Changing to `.upsert()` with `onConflict: 'setting_key'` ensures first-time saves work. This requires a unique constraint on `setting_key` -- checking the schema, `setting_key` is `text NOT NULL` but may not have a unique constraint, so the migration will add one if needed.

**Database migration**: Add unique constraint on `business_settings.setting_key` to support upsert.

