# 📘 VoyageX – Cruise Ship Management System

VoyageX is a full-featured cruise ship booking and multi-role admin platform built using the **MERN stack** with **Next.js (TypeScript)**, **MongoDB**, **Prisma**, **Tailwind CSS**, and **ShadCN UI**.

This platform supports role-based dashboards, QR-coded receipts, booking management, and audit logging.

---

## 🚀 Features Overview

### ✅ Authentication & Authorization

- Custom login/register with **username/password**
- JWT-based sessions stored in **httpOnly cookies**
- Role-based dashboards (`/admin`, `/manager`, `/headcook`, etc.)
- Middleware to enforce route access based on role

### 📋 Booking System

- Stepper-style multi-step booking form
- Fields: guest info, room select, date range, notes, meal plan
- Auto-calculates amount based on voyager count
- Validates room capacity in real-time
- Pre-filled data for demo users
- Booking receipt generation with QR code
- Dynamic room selector with capacity info

### 📜 Receipt & QR Verification

- Stylized printable receipt with watermark & logo
- QR code generation using `qr-code-styling` (with center logo)
- Public verification via `/bookings/verify/[id]`

### 📊 Admin Dashboard

- Total users, audit logs, revenue (dummy or Stripe/Razorpay ready)
- Recent activities with timestamps
- Navigable payment records with amount & status

### 💳 Payments

- Prisma `Payment` schema with dummy data
- Tracks method, provider, status
- Optional Razorpay/Stripe integration in roadmap

---

## 🧱 Tech Stack

| Layer      | Tech Used                                      |
| ---------- | ---------------------------------------------- |
| Frontend   | Next.js (App Router, TypeScript), Tailwind CSS |
| Components | ShadCN UI + Accertinity UI                     |
| Backend    | Next.js Route Handlers (`/app/api`)            |
| ORM        | Prisma ORM (MongoDB)                           |
| Database   | MongoDB                                        |
| Auth       | Custom JWT-based Auth                          |
| QR Codes   | qr-code-styling                                |
| Forms      | react-hook-form + Zod validation               |

---

## 🏗 Directory Structure

```
voyagex/
├── app/                      # Next.js Frontend (App Router)
│   ├── api/                  # Backend logic with route handlers
│   ├── admin/, manager/, ... # Role-based dashboards
│   ├── bookings/             # Booking form, receipt, verification
│   └── layout.tsx, page.tsx  # Layouts + entry points
├── components/               # UI components (Breadcrumbs, QR, Dialogs)
├── lib/                      # Helpers: auth, session, db client
├── prisma/                   # Prisma schema, seed script
├── public/                   # Logo, images, QR exports
├── utils/                    # Constants, enums, types
├── styles/                   # Tailwind config, global styles
└── README.md
```

---

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
DATABASE_URL="mongodb+srv://..."
JWT_SECRET="your_secret_key"
```

### 3. Prisma

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Initial Data

```bash
npm run seed
```

---

## 🧪 Testing

- Use `/login` to sign in as:

```ts
admin:      admin123 / admin@medorms.com
manager:    manager123
headcook:   headcook123
supervisor: supervisor123
```

- Role-based layout & navigation auto-rendered
- Booking form tested with validation and dynamic values
- Receipt preview and QR code working

---

## 📌 Roadmap

- [x] Stepper booking form
- [x] Live capacity validation
- [x] QR-based receipt & verification
- [x] Admin analytics dashboard
- [x] Audit logs
- [x] PDF receipt with logo/watermark
- [ ] Room availability calendar
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Voyager mobile view optimization
- [ ] Invite-based user onboarding

---

## 🤝 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling)

---

## 📬 Maintainer

**Project Lead:** Nagarjun A
**Project Name:** VoyageX
**Contact:** DM via GitHub / Email

---

Let us know if you’d like to deploy to Vercel, Netlify or integrate webhooks/logs 🔔
