# StudioSpace

**Live site:** https://studios-space.vercel.app

StudioSpace is a studio-booking web application where creators can discover,
book, and list studios by the hour — photo lofts, sound stages, podcast rooms,
music suites, and art workshops.

## Features

- **Studio directory** with live search (`?q=`), category filters, a hero
  slider, featured studios, studio detail pages, and a wishlist heart on every
  card.
- **Secure authentication** — JWT sessions stored in an HTTPOnly cookie,
  Login/Register pages with Google social login, password validation
  (uppercase + lowercase + 6 characters), and a custom logout confirmation
  modal. All errors and successes are shown with Sonner toasts.
- **Booking engine with double-booking prevention** — the API rejects
  overlapping time slots with a `409` conflict and a clear toast message, then
  lists your sessions under *My Bookings* with a downloadable **PDF invoice**.
- **Studio management API** — signed-in users can create studios; owners can
  delete their own listings (`401` unauthenticated, `403` non-owner, `404`
  missing).
- **Polish** — light/dark theme toggle, loading skeletons, streaming
  Suspense shells, a custom 404 "off camera" page, empty states, and
  responsive mobile navigation.

## Tech Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript ·
Tailwind CSS v4 · shadcn/ui on @base-ui/react · MongoDB (with in-memory seed
fallback) · jose (JWT) · next-themes · Sonner toasts · jsPDF invoices ·
embla-carousel

## Local Setup

```bash
git clone https://github.com/CodeCrushRisha/studios-space.git
cd studios-space
npm install
cp .env.example .env.local   # optional — app runs on seed data without it
npm run dev
```

Open http://localhost:3000. Production: `npm run build && npm start`.

Environment variables (see `.env.example`): `MONGODB_URI`,
`MONGODB_DB_NAME`, `JWT_SECRET` (a dev fallback is used when unset; without
MongoDB the app serves seeded in-memory data).

## Examiner Test Credentials

| Field    | Value                      |
| -------- | -------------------------- |
| Email    | `examiner@studiospace.test` |
| Password | `Studio123`                 |

- **Google login:** click *Continue with Google* on the Login or Register page
  — it signs you in through the demo Google flow and lands on the Home page.
- **Registration:** any name/email plus a valid password (e.g. `Ex@mples1`)
  registers and redirects to the Login page; invalid passwords are blocked
  with an inline form error and a toast.
