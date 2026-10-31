# StudioSpace

**Live site:** https://studios-space.vercel.app

StudioSpace is a studio-booking web application where creators can discover,
book, and list studios by the hour — photo lofts, sound stages, podcast rooms,
music suites, and art workshops.

## Features

- **Full CRUD for studios** — private `/add-studio` form (title, category,
  hourly rate, security deposit, max capacity, location, image URL with
  **imgbb upload**, amenity tags, overview, read-only host info) saves to the
  MongoDB `studios` collection; `/my-listings` lists your owner-matched spaces
  with **Update** (`/studios/edit/[id]`, PUT) and **Delete** (confirmation
  modal → success toast) actions.
- **Explore & detail pages** — `/studios` grid with title, category badge,
  hourly rate, location, rating, and View Details; `/studios/[id]` shows a
  gallery carousel, full specs, amenity list, host details, reviews, and a
  **Book Workspace Now** button that launches the booking modal.
- **Booking system** — reservations save to the `bookings` collection with
  status **Pending**; `/my-bookings` shows status badges (Pending, Confirmed,
  Completed, Cancelled), a **Cancel Booking** action for pending slots, and a
  downloadable **PDF invoice**. Overlapping slots are rejected with a `409`
  toast.
- **Secure authentication** — JWT sessions stored in an HTTPOnly cookie,
  Login/Register pages with Google social login, password validation
  (uppercase + lowercase + 6 characters), and a custom logout confirmation
  modal. All errors and successes are shown with Sonner toasts.
- **Directory extras** — live search (`?q=`), category filters, hero slider,
  featured studios, wishlist hearts, and a light/dark theme toggle.
- **Polish** — loading skeletons, streaming Suspense shells, a custom 404
  "off camera" page, empty states, and responsive mobile navigation.

### Private routes

`/add-studio` · `/my-listings` · `/studios/edit/[id]` · `/my-bookings`
(redirected to `/login` when the session cookie is missing; every mutating API
call independently returns `401`).

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
MongoDB the app serves seeded in-memory data), `IMGBB_API_KEY` (enables the
image uploader on the Add/Update Studio forms — when unset, paste an Image
URL instead).

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
