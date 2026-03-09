

## Plan: Dynamic Contact Integration and Client Module Enhancement

### What exists today
- **BusinessInfoTab** already stores `phone`, `facebook`, `instagram`, `tiktok` in `business_settings` (key: `business_info`).
- **LandingFooter** has hardcoded social links and WhatsApp number (`51987457832`).
- **LandingContact** uses `locations` table for WhatsApp, not the central business phone.
- **Clientes page** already has 3 tabs: Clientes, Campanas, Fidelizacion -- structure is in place.
- **Campaigns tab** has BirthdayReminders and InactiveClients but WhatsApp messages use raw phone numbers without the business phone context.

### Changes

#### 1. Create a shared hook `useBusinessInfo`
A new hook that fetches `business_settings` where `setting_key = 'business_info'` using a public-accessible query (no auth required, for landing page usage). This provides `phone`, `facebook`, `instagram`, `tiktok`, `name`, etc. to any component.

#### 2. Update LandingFooter -- Dynamic social links and WhatsApp
- Import `useBusinessInfo`
- Replace hardcoded Instagram/Facebook/WhatsApp links with values from settings
- Add TikTok icon when URL is configured
- Hide icons when URL is empty
- WhatsApp link uses the configured phone number with default message

#### 3. Update LandingContact -- Dynamic WhatsApp button
- Use `useBusinessInfo` to get the main phone number
- Add a WhatsApp button that uses the configured phone with the predefined message: "Hola, estoy interesado en obtener mas informacion. Podrian ayudarme?"

#### 4. Enhance Campaigns tab in Clientes
The current Campaigns tab only shows BirthdayReminders and InactiveClients. Enhance it with:
- A "Quick Campaign" section for sending bulk WhatsApp messages to filtered client segments (VIP, inactive, birthday, all)
- Campaign templates (birthday, reactivation, promotion, custom)
- The WhatsApp messages will use the configured business phone for context

#### 5. Make all WhatsApp links use centralized phone
Update `cleanPhone` in `src/lib/whatsapp.ts` and all WhatsApp `window.open` calls across the system to use the business phone from settings when sending on behalf of the business.

### Technical Details

**New file: `src/hooks/useBusinessInfo.ts`**
- Uses `useQuery` to fetch from `business_settings` where `setting_key = 'business_info'`
- Uses `.maybeSingle()` to handle public access (RLS allows cajeros to SELECT)
- Returns typed object: `{ phone, facebook, instagram, tiktok, name, ... }`
- Note: For landing page (unauthenticated), we need a public RLS policy on `business_settings` for SELECT on `setting_key = 'business_info'` only, OR use the existing locations table's whatsapp field as fallback.

**Database migration needed:**
- Add a permissive SELECT policy on `business_settings` for `anon` role, restricted to `setting_key IN ('business_info', 'schedule')` so public landing page can read contact info without auth.

**Files to modify:**
1. `src/hooks/useBusinessInfo.ts` (new) -- shared hook
2. `src/components/landing/LandingFooter.tsx` -- dynamic social/WhatsApp
3. `src/components/landing/LandingContact.tsx` -- dynamic WhatsApp button
4. `src/pages/Clientes.tsx` -- enhance Campaigns tab with campaign builder
5. `src/components/clientes/CampaignBuilder.tsx` (new) -- campaign management component
6. Database migration for public read access to business_info setting

