# Lumière Salon — Premium Beauty Salon Website (MERN)

A full-stack, production-ready starter for a luxury salon website: React + Tailwind +
Framer Motion + Swiper on the frontend, Express + MongoDB + JWT on the backend.

## Design system (derived from your reference photos)

| Token | Value |
|---|---|
| Ivory (bg) | `#FBF6EF` |
| Sand | `#F0E4D3` |
| Blush | `#E8C9A8` |
| Champagne (primary accent) | `#C9A063` |
| Caramel (hover/secondary) | `#8B5E3C` |
| Mocha (text/dark) | `#3A2A1E` |

Typefaces: **Cormorant Garamond** (display) + **Manrope** (body/UI).
Signature element: the hero's animated "sunlight sweep" — a soft diagonal light gradient
that drifts across each slide, echoing the window-light shadows in your reference images.

The hero images you uploaded are already wired in at
`frontend/public/images/` (hair-styling.jpg, manicure.jpg, facial-spa.jpg, skincare.jpg).

## Project structure

```
salon-website/
├── backend/          Express API, MongoDB models, JWT auth
│   ├── models/        User, Service, Booking
│   ├── controllers/    auth, service, booking logic
│   ├── routes/         /api/auth, /api/services, /api/bookings
│   ├── middleware/      JWT protect + adminOnly
│   ├── seed.js          seeds 4 sample services (dev convenience)
│   └── server.js
└── frontend/          React (Vite) + Tailwind + Framer Motion + Swiper
    └── src/
        ├── components/  Navbar, Hero, ServiceCard, ServicesSection, Footer
        ├── pages/        Home, Services, Booking, Login, Register, Account, Contact
        ├── context/      AuthContext (real JWT session handling)
        └── api/          axios instance with auth interceptor
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm run seed               # optional: adds 4 sample services to Mongo
npm run dev                # starts on http://localhost:5000
```

You need a MongoDB instance — either local (`mongodb://localhost:27017/salon_db`)
or a free MongoDB Atlas cluster (recommended, paste the connection string into `.env`).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173
```

Vite is pre-configured to proxy `/api` to `http://localhost:5000`, so no extra
CORS setup is needed in dev.

### 3. Try it

- Visit `http://localhost:5173`
- Register a new account → navbar dynamically switches from Login/Register to
  "My Account" (real JWT stored in localStorage, verified against `/api/auth/me`)
- Services on the homepage and `/services` are fetched live from MongoDB — nothing
  is hardcoded. Run `npm run seed` in the backend if the section shows "no services yet."
- Book an appointment from `/booking` — it's a real authenticated POST to `/api/bookings`,
  and your bookings list re-fetches from the database.

## What's implemented vs. what to extend

**Implemented:** JWT register/login/logout, protected routes, dynamic navbar auth state,
full-screen Swiper hero with 4 slides synced text animation, services grid fetched via
REST API with category filtering, glassmorphism cards, booking creation + listing,
responsive layout (mobile/tablet/desktop), reduced-motion support.

**Natural next steps** (not built, to keep this a clean starting point rather than
an over-scoped guess at requirements you haven't specified):
- Admin dashboard UI for managing services/bookings (the backend routes for
  create/update/delete services already exist and are admin-protected — just needs a UI)
- Email confirmation on booking
- Payment integration
- Image upload (currently services reference a static image path/URL)

## Notes on the hero reference link

`apleghar.netlify.app` is a fully client-rendered React app, so I wasn't able to
inspect its actual slider markup/animation code — I designed the hero slider
(Swiper fade transitions, synced text reveal, sunlight-sweep overlay) independently
in the same "premium full-screen slider" spirit you described, rather than copying it.
