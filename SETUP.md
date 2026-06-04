# ArmeriaDigital — Setup Guide

## Prerequisites
- Node.js 20+ — https://nodejs.org
- A Supabase account — https://supabase.com
- A Vercel account — https://vercel.com (free)

---

## 1. Supabase Setup

### A. Create a new project
1. Go to https://supabase.com → New project
2. Choose a name (e.g. `armeria-digital`), region **US East** (closest to Puerto Rico), set a password

### B. Run the schema
1. Open your project → **SQL Editor** → New query
2. Paste the contents of `supabase/schema.sql` and click **Run**

### C. Create the Storage bucket
In the SQL Editor, run this separately:
```sql
insert into storage.buckets (id, name, public) values ('listings', 'listings', true);

create policy "Anyone can view listing images"
  on storage.objects for select using (bucket_id = 'listings');

create policy "Auth users can upload listing images"
  on storage.objects for insert with check (
    bucket_id = 'listings' and auth.role() = 'authenticated'
  );

create policy "Users can delete own listing images"
  on storage.objects for delete using (
    bucket_id = 'listings' and auth.uid()::text = (storage.foldername(name))[1]
  );
```

### D. Get your API keys
**Project Settings → API**
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### E. Configure Auth
- **Authentication → URL Configuration**
  - Site URL: `https://your-app.vercel.app`
  - Redirect URLs: `https://your-app.vercel.app/api/auth/callback`
- For local dev, also add: `http://localhost:3000/api/auth/callback`

---

## 2. Local Development

```bash
# Clone / open the folder in your terminal
cd armeria-digital

# Install dependencies
npm install

# Create env file
cp .env.local.example .env.local
# Edit .env.local and fill in your Supabase URL and anon key

# Start dev server
npm run dev
# → Open http://localhost:3000
```

---

## 3. Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
# Follow the prompts, then:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

### Option B — GitHub + Vercel Dashboard
1. Push code to a GitHub repo
2. Go to https://vercel.com → Import project → Select repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

---

## File Structure
```
armeria-digital/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home / listing grid
│   │   ├── listings/
│   │   │   ├── page.tsx          # All listings + filters
│   │   │   ├── [id]/page.tsx     # Listing detail + WhatsApp button
│   │   │   └── new/page.tsx      # Create listing (auth required)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── profile/page.tsx      # User dashboard
│   │   └── api/auth/callback/    # Supabase OAuth callback
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ListingCard.tsx
│   │   ├── ImageGallery.tsx      # Photo viewer with lightbox
│   │   ├── NewListingForm.tsx    # Create listing + image upload
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── SearchBar.tsx
│   │   └── ProfileActions.tsx
│   ├── lib/
│   │   ├── supabase/client.ts    # Browser Supabase client
│   │   ├── supabase/server.ts    # Server Supabase client
│   │   ├── supabase/middleware.ts
│   │   └── utils.ts
│   ├── types/index.ts
│   └── middleware.ts             # Auth guard for protected routes
├── supabase/schema.sql
└── SETUP.md
```
