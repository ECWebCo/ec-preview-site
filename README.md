# EC Restaurant Website Template

A beautiful, editorial-style restaurant website that automatically syncs with the EC Web Co dashboard.

---

## How it works

1. Restaurant owner updates content in the dashboard (menu, hours, photos, links)
2. Changes appear instantly on their website — no sync needed
3. Analytics events (page views, order clicks, etc.) flow back to the dashboard

---

## Deploy a new restaurant site

### 1. Install & set up

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:
```
VITE_SUPABASE_URL=https://snthchxrqjtriorgvakk.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RESTAURANT_SLUG=la-bella-cucina   ← change this per restaurant
```

### 2. Test locally

```bash
npm run dev
```

### 3. Deploy to Vercel

```bash
vercel
```

Add the 3 env vars in Vercel dashboard. Done!

### 4. Add restaurant data in Supabase

Make sure the restaurant record exists with the matching slug:
```sql
insert into restaurants (name, slug, owner_id)
values ('La Bella Cucina', 'la-bella-cucina', 'USER-UUID');
```

---

## Customizing per restaurant

Each restaurant deployment only needs one change — the `VITE_RESTAURANT_SLUG` env var. Everything else (name, menu, hours, photos, links) is pulled from Supabase automatically.

### Optional fields in the restaurants table

Add these columns to customize the hero section:
```sql
alter table restaurants add column if not exists description text;
alter table restaurants add column if not exists hero_headline text;
alter table restaurants add column if not exists hero_subheadline text;
alter table restaurants add column if not exists tagline text;
alter table restaurants add column if not exists city text;
alter table restaurants add column if not exists est int;
alter table restaurants add column if not exists email text;
alter table restaurants add column if not exists address text;
```

---

## Project structure

```
src/
  components/
    Nav.jsx           — Fixed nav with mobile hamburger menu
    Hero.jsx          — Full-screen hero with restaurant photo
    StatusBar.jsx     — Live open/closed status
    MenuSection.jsx   — Tabbed menu (pulls from dashboard)
    HoursSection.jsx  — Hours grid (highlights today)
    GallerySection.jsx — Asymmetric photo grid
    LocationSection.jsx — Location cards with maps
    ContactSection.jsx — Email, reserve, phone cards
    Footer.jsx        — Footer with EC Web Co credit
  lib/
    supabase.js       — Data fetching + analytics tracking
  App.jsx             — Root component, fetches all data
```
