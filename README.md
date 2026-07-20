# AgroConnect — Farm-to-Consumer Marketplace

Direct-from-farm organic produce marketplace connecting rural Indian farmers with health-conscious consumers.
No middlemen. Video proof of cultivation. Farm visits. Escrow-held payments.

## Stack

- **Frontend:** React 18 (Vite) · Tailwind CSS · React Router · i18next (EN/HI/TE/TA)
- **Backend:** Node.js · Express · MongoDB (Mongoose) · JWT · bcrypt · Helmet · rate-limit
- **Integrations (stubbed until keys are added):** Cloudinary (image/video upload), Razorpay (payments with escrow), Twilio (SMS OTP), Google Maps (farm location embed)

## Quick start

```bash
# 1. Install everything
npm run install:all

# 2. Configure backend env
cp backend/.env.example backend/.env      # then edit MONGO_URI + JWT_SECRET

# 3. Make sure MongoDB is running
brew services start mongodb-community     # or point MONGO_URI at Atlas

# 4. Run both servers (needs `npm i` at root once for concurrently)
npm i
npm run dev

# 5. In another tab, seed demo data (creates admin/farmer/consumer accounts + sample farm/crops)
npm run seed
```

Then open **http://localhost:5173**.

### Demo credentials (after `npm run seed`)

| Role | Email | Password |
| --- | --- | --- |
| Consumer | `priya@agroconnect.dev` | `password123` |
| Farmer | `ravi@agroconnect.dev` | `password123` |
| Admin | `admin@agroconnect.dev` | `password123` |

## Features shipped

### Consumer flow
- Browse marketplace with search, category filter, price sort
- Crop detail page with photo gallery + embedded cultivation video
- Farm profile page with map, crops, reviews, "Book a visit" CTA
- Cart (localStorage, one-farm-at-a-time)
- Checkout with delivery method, address form, mock Razorpay payment
- Escrow payment status (`held_in_escrow` → `released` on delivery confirmation)
- Order list + detail page with 4-step delivery timeline
- Post-delivery review with 5-star rating

### Farmer flow
- Multi-step registration (personal → docs → OTP) with pending-admin-approval flow
- Dashboard tabs: **Farm profile · Crops · Orders · Visits**
- Farm profile editor (location + photos + certifications)
- Crop CRUD with unit selection, price, quantity, video URL
- Incoming orders with one-click status advance (confirmed → packed → dispatched → delivered)
- Farm visit bookings list

### Farm visits (agri-tourism)
- Public booking page with 3 packages (₹199 / ₹499 / ₹999)
- Date picker + time slot + visitor count
- 48-hour cancellation policy (server-enforced)
- Confirmation screen with booking summary

### Admin panel
- KPI overview (farmers, consumers, orders, revenue, pending queues)
- Farmer verification queue with Aadhaar + land document links
- Crop moderation queue
- User management (suspend / reactivate)

### Multi-language
- English, Hindi, Telugu, Tamil
- Language switcher in navbar (persists to localStorage)
- Navbar, hero, marketplace, and cart pages fully translated. Remaining pages inherit English until further translation.

### Payment escrow
- Consumer pays → funds held in escrow (`held_in_escrow`)
- Farmer marks delivered → funds released (`released`)
- Cash on delivery available for orders under ₹2000

## Auth endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register/consumer` | Create consumer account; auto-sends OTP |
| `POST` | `/api/auth/register/farmer` | Create farmer account (needs govtIdUrl + landDocUrl); auto-sends OTP; account waits for admin approval |
| `POST` | `/api/auth/otp/send` | Resend OTP for a phone |
| `POST` | `/api/auth/otp/verify` | Verify OTP + return JWT |
| `POST` | `/api/auth/login` | Email + password login → JWT (rate-limited 10/15min) |
| `GET`  | `/api/auth/me` | Current user (needs `Authorization: Bearer <token>`) |

OTPs during development are printed to the backend console (`[otp] 9876543210 → 388999`). Wire up Twilio in `utils/otp.js` when going to production.

## Full API surface

```
GET    /api/health
GET    /api/farms                        List approved farms
GET    /api/farms/mine                   (farmer) My farm
POST   /api/farms/mine                   (farmer) Create/update my farm
GET    /api/farms/:id                    Farm profile + crops + reviews
GET    /api/crops                        Search/filter/sort crops
GET    /api/crops/mine                   (farmer) My crops
POST   /api/crops                        (farmer) Create crop
PATCH  /api/crops/:id                    (farmer) Update crop
DELETE /api/crops/:id                    (farmer) Delete crop
GET    /api/crops/:id                    Crop detail
POST   /api/orders                       (consumer) Place order
GET    /api/orders/mine                  (consumer) My orders
GET    /api/orders/farmer                (farmer) Orders for my farm
GET    /api/orders/:id                   Order detail (participant only)
PATCH  /api/orders/:id/status            Advance status (farmer) / cancel (either)
POST   /api/visits                       (consumer) Book farm visit
GET    /api/visits/mine                  (consumer) My visits
GET    /api/visits/farmer                (farmer) Bookings for my farm
PATCH  /api/visits/:id/cancel            Cancel (>48h before)
POST   /api/reviews                      (consumer) Post-delivery review
GET    /api/reviews/farm/:farmId         List farm reviews
POST   /api/payments/razorpay/order      Create Razorpay order (mock in dev)
POST   /api/payments/razorpay/verify     Verify Razorpay signature (mock in dev)
GET    /api/uploads/info                 Cloudinary config (or passthrough note)
POST   /api/seed/demo                    Load demo accounts + farm + crops (dev only)

GET    /api/admin/stats                  Platform KPIs
GET    /api/admin/farmers/pending        Farmers awaiting verification
POST   /api/admin/farmers/:id/approve    Approve farmer
POST   /api/admin/farmers/:id/reject     Reject farmer (deactivate)
GET    /api/admin/crops/pending          Crops awaiting moderation
POST   /api/admin/crops/:id/approve      Approve crop listing
POST   /api/admin/crops/:id/reject       Reject crop listing
GET    /api/admin/users                  List users
PATCH  /api/admin/users/:id/active       Suspend or reactivate a user
```

## Third-party integrations — what's stubbed vs real

| Integration | Status | To go live |
| --- | --- | --- |
| **JWT + bcrypt auth** | ✅ Real | — |
| **MongoDB / Mongoose** | ✅ Real | Just install / point at Atlas |
| **OTP (Twilio)** | Real - Twilio SMS integration | Replace `utils/otp.js` generateOtp with Twilio client call |
| **Payments (Razorpay)** | ⚠️ Mock — accepts fake payment IDs | Set `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`, wire frontend Razorpay checkout SDK |
| **Uploads (Cloudinary)** | ⚠️ Passthrough — expects URL strings | Set `CLOUDINARY_*`, add frontend Cloudinary widget in farmer dashboard |
| **Google Maps** | ✅ Iframe embed (no API key needed) | Optional: switch to JS API for interactive maps |
| **i18n (i18next)** | ✅ Real, 4 languages loaded | Translate remaining page strings — see `frontend/src/i18n/locales/` |

## Repository layout

```
backend/
  src/
    config/db.js
    models/                          User · Farm · Crop · Order · FarmVisit · Review
    controllers/                     auth · farm · crop · order · visit · review · admin · payment · upload · seed
    routes/
    middleware/auth.js               requireAuth · requireRole
    utils/                           hash · jwt · otp · asyncHandler
    index.js
  .env.example
frontend/
  src/
    components/                      Navbar · Hero · CropCard · FormField · LanguageSwitcher · ProtectedRoute · AuthShell · OtpStep · PageShell + landing sections
    context/                         AuthContext · CartContext
    i18n/                            index.js + en/hi/te/ta.json
    lib/api.js                       Typed API client
    pages/                           Home · Login · RegisterConsumer · RegisterFarmer · Dashboard · Marketplace · CropDetail · FarmProfile · Cart · Checkout · Orders · OrderDetail · VisitBooking · VisitConfirmed · FarmerDashboard · AdminPanel · NotFound
    App.jsx · main.jsx · index.css
```

## Roadmap

- **Month 1 — Foundation & Auth** ✅
  - [x] Project scaffold, folder structure, README
  - [x] MongoDB connection + all 6 schemas (User, Farm, Crop, Order, FarmVisit, Review)
  - [x] Landing page with Hero, How-it-Works, Featured Farms, Farm Visit, Testimonials, CTA, Footer
  - [x] Consumer registration with OTP verification
  - [x] Farmer registration (multi-step) with document URLs + OTP + pending-approval flow
  - [x] JWT login, `/api/auth/me`, AuthContext + ProtectedRoute on the frontend

- **Month 2 — Core Features** ✅
  - [x] Farmer dashboard: crop CRUD, orders, visits, farm profile editor
  - [x] Consumer marketplace: browse, search, filter, sort, crop detail with video
  - [x] Cart + checkout + Razorpay mock (real integration ready)
  - [x] Order management with 4-step timeline + escrow payment status
  - [x] Farm visit booking with calendar + 3 packages + 48h cancellation

- **Month 3 — Polish & Deploy** ✅ (except deploy)
  - [x] Admin panel: verification queue, crop moderation, user management, KPIs
  - [x] Reviews & ratings after delivery, aggregate rating on farm profile
  - [x] Multi-language support (EN/HI/TE/TA) with i18next
  - [x] Google Maps farm location embed (iframe, no API key needed)
  - [x] Demo seed endpoint for instant portfolio demo
  - [ ] **Deploy** — see below

## Deployment notes

- **Frontend (Vercel):** `cd frontend && vercel`. Vite build outputs to `frontend/dist`. Add rewrite so SPA routes resolve: `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`.
- **Backend (Render / Railway / Fly):** deploy `backend/`. Set env: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN=https://your-vercel.app`, plus Razorpay / Cloudinary / Twilio keys when ready. Start command: `node src/index.js`.
- **Database:** MongoDB Atlas free tier is enough for a portfolio demo.

## Skills demonstrated

Full-stack MERN · JWT + bcrypt + OTP auth · role-based access · MongoDB schema design with references · REST API design · React Context (auth + cart) · React Router with protected routes · Tailwind design system · i18n (4 languages) · Razorpay/Cloudinary/Twilio integration stubs ready to go live · escrow payment model · marketplace + admin moderation · agri-tourism booking module.
