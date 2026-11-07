# Mister Ceramic – Vercel Deployment Guide

This guide walks you through deploying the **Mister Ceramic** platform to Vercel with a production cloud database.

---

## 1. Quick Overview

- **Framework**: Next.js 14.2 (App Router)
- **Hosting**: Vercel
- **Database**: PostgreSQL (Free via [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))
- **Automated Prisma Sync**: The repository includes `scripts/prepare-prisma.js`. When Vercel detects a `postgresql://` connection string, it automatically updates Prisma to PostgreSQL and generates the client during build.

---

## 2. Step 1: Create a Free Cloud Database (2 Minutes)

Because Vercel runs on serverless architecture (ephemeral containers), SQLite cannot persist live bookings or workshop progress photos in production. A remote PostgreSQL database is required.

### Recommended Option: Neon Serverless Postgres (100% Free)
1. Sign in to **[neon.tech](https://neon.tech)** using GitHub or Google.
2. Click **Create Project**, name it `mister-ceramic`.
3. Copy your connection string from the dashboard. It looks like:
   ```
   postgresql://mister_owner:abcdef@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Initialize and Seed Your Cloud Database:
In your terminal, run:
```bash
# Set your cloud database URL temporarily to push the schema & seed data
DATABASE_URL="your-neon-postgres-connection-url-here" npx prisma db push
DATABASE_URL="your-neon-postgres-connection-url-here" node prisma/seed.js
```
*This instantly creates all tables, seeds all 11 services, packages, demo projects, and creates your initial Admin user (`admin@misterceramic.com` / `Admin@MisterCeramic2026`).*

---

## 3. Step 2: Push Your Code to GitHub

If you haven't connected this project to GitHub yet:

1. Create a new repository on **[github.com/new](https://github.com/new)** named `mister-ceramic` (choose **Private** or **Public**).
2. Run these commands in your project directory:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/mister-ceramic.git
   git push -u origin master
   ```

---

## 4. Step 3: Deploy on Vercel

1. Open **[vercel.com/new](https://vercel.com/new)** and sign in.
2. Under **Import Git Repository**, find `mister-ceramic` and click **Import**.
3. Under **Environment Variables**, add the following:

| Key | Example Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` | Your PostgreSQL connection string |
| `JWT_SECRET` | `mister-ceramic-super-secret-key-2026-auto-detailing-studio` | Admin authentication secret |
| `NEXT_PUBLIC_APP_URL` | `https://mister-ceramic.vercel.app` | Your Vercel domain |
| `NEXT_PUBLIC_BUSINESS_PHONE` | `+91 92072 09105` | Official Studio phone |
| `NEXT_PUBLIC_BUSINESS_WHATSAPP` | `+919207209105` | Official Studio WhatsApp |
| `NEXT_PUBLIC_GOOGLE_MAPS_URL` | `https://www.google.com/maps/place/mister+ceramic/data=!4m2!3m1!1s0x3b0675fb65d87319:0x41a9e67271dc0506` | Official Maps Link |
| `NEXT_PUBLIC_MAPS_EMBED_URL` | `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.229068065406!2d76.77259!3d9.00632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0675fb65d87319%3A0x41a9e67271dc0506!2smister%20ceramic!5e0!3m2!1sen!2sin!4v1700000000000` | Embed map URL |

4. Click **Deploy**!
   - Vercel will install dependencies, automatically execute `scripts/prepare-prisma.js`, generate `@prisma/client`, and compile all 33 Next.js routes.
   - Within ~60 seconds, your site will be live at `https://mister-ceramic.vercel.app` (or your chosen project name)!

---

## 5. Alternative: Deploy via Vercel CLI (No GitHub required)

You can also deploy directly from your local terminal using the Vercel CLI:

```bash
npx vercel
```
1. Follow the terminal prompts to log in via browser.
2. Set up and deploy `mister-ceramic` (select default Next.js settings).
3. To add your production environment variables:
   ```bash
   npx vercel env add DATABASE_URL
   npx vercel env add JWT_SECRET
   ```
4. Deploy to production:
   ```bash
   npx vercel --prod
   ```

---

## 6. Verifying Production Deployment

Once deployed:
1. **Public Site**: Visit `https://your-app.vercel.app` — check Hero, Services, Portfolio before/after comparisons, and Cost Calculator.
2. **Booking Test**: Submit an appointment at `/book` — verify that a unique booking reference (`MC-YYYYMM-XXXX`) is issued.
3. **Admin Dashboard**: Log in at `/admin/login` using:
   - Email: `admin@misterceramic.com`
   - Password: `Admin@MisterCeramic2026`
4. **Live Vehicle Tracking**: Visit `/track` and verify real-time status updates using the booking reference.

