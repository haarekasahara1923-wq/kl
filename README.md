# K.L. International School — Fullstack Web Application

A full-stack mobile-first school website and role-based admin management system for **K.L. International School**, Gwalior (MP).

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Neon PostgreSQL via Drizzle ORM
- **Auth**: NextAuth v5 (Credentials authentication with bcrypt hashing)
- **Media**: Cloudinary (Images, PDFs, media uploads)
- **Styling**: Tailwind CSS + Framer Motion micro-animations
- **Forms**: React Hook Form + Zod schema validation
- **Deployment**: Vercel ready

---

## 📋 Features

### Public Website
- **Home**: Hero banner, animated mascot, stats, news ticker, feature highlights, CTAs
- **About Us**: School heritage, vision/mission, Director & Principal messages
- **Academics**: CBSE curriculum levels, smart classroom features, lab infrastructure
- **Admissions**: 4-step admission workflow, interactive online enquiry form
- **Gallery**: Photo albums with lightbox viewer
- **Staff**: Faculty cards with designations and photos
- **Certifications**: Accreditation cards with downloadable documents
- **Contact**: Location details, interactive contact form, WhatsApp redirect button

### Role-Based Admin Panel (`/admin`)
- **Dashboard**: Summary metrics (Students, Staff, Revenue, Pending Enquiries)
- **Students**: Full CRUD management, class/section filtering
- **Fees**: Payment records, fee structures, status tracking
- **Staff & Payroll**: Faculty directory and payroll management
- **Gallery Admin**: Album creation and Cloudinary photo management
- **Admissions Enquiries**: Review & manage incoming admission applications
- **Contact Messages**: Respond to incoming general enquiries
- **Certifications**: Upload & publish school certificates
- **Settings**: Manage school contact info, phone, email & WhatsApp number

---

## 🛠️ Environment Variables Setup

Copy `.env.example` to `.env.local` and configure your credentials:

```env
# Neon Postgres Connection URL
DATABASE_URL=postgresql://user:password@your-neon-host/dbname?sslmode=require

# NextAuth v5 Secret (generate using openssl rand -base64 32)
NEXTAUTH_SECRET=your-super-secret-key-at-least-32-chars
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# School Contact Redirects
ADMIN_WHATSAPP_NUMBER=918962678915
NEXT_PUBLIC_SITE_URL=https://klinternational.space
```

---

## 🗄️ Database Setup & Drizzle Migrations

1. **Generate Drizzle Migrations**:
   ```bash
   npx drizzle-kit generate
   ```

2. **Push Migration to Neon Postgres**:
   ```bash
   npx drizzle-kit push
   ```

3. **Seed Default Admin User & Sample Content**:
   ```bash
   npx tsx db/seed.ts
   ```

---

## 🔑 Default Login Credentials

After running `npx tsx db/seed.ts`:

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `Admin@123` |
| Accountant | `accountant` | `Accountant@123` |
| Operations | `operations` | `Operations@123` |

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site or [http://localhost:3000/auth/login](http://localhost:3000/auth/login) for the admin portal.

---

## 🌐 Deploying to Vercel

1. Push codebase to GitHub repo.
2. Import project into Vercel Dashboard.
3. Configure all environment variables in Vercel settings.
4. Click **Deploy**.
