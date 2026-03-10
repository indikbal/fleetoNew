# Fleeto — API Integration Ticket

**Branch:** `api_implement`
**Backend:** WordPress (Headless) | **Frontend:** Next.js

---

## Phase 1 — Navigation & Menu APIs

Replace all hardcoded nav/footer data with live API data.

### 1.1 Header Menu (Navbar)
- [x] Add `fetchHeaderMenu()` to `src/lib/api.ts`
- [x] Update `Navbar.tsx` to fetch and render dynamic nav links from `GET /wp-json/custom/v1/header-menu`

### 1.2 Footer Menus
- [x] Add `fetchOurProductsMenu()` to `src/lib/api.ts` → `GET /wp-json/custom/v1/our-product-menu`
- [x] Add `fetchQuickLinksMenu()` to `src/lib/api.ts` → `GET /wp-json/custom/v1/quick-link-menu`
- [x] Add `fetchAboutUsMenu()` to `src/lib/api.ts` → `GET /wp-json/custom/v1/about-us-menu`
- [x] Add `fetchSupportMenu()` to `src/lib/api.ts` → `GET /wp-json/custom/v1/footer-menu`
- [x] Update `Footer.tsx` to replace hardcoded `columns` with dynamic menu data

---

## Phase 2 — Auth System

Build full authentication flow (no dependency on any other phase).

### 2.1 API Functions
- [x] Add `registerUser(username, email, password)` to `src/lib/api.ts` → `POST ?action=register_user`
- [x] Add `loginUser(username, password)` to `src/lib/api.ts` → `POST ?action=login_user`
- [x] Add `logoutUser()` to `src/lib/api.ts` → `POST ?action=logout_user`

### 2.2 Auth State Management
- [x] Create `src/context/AuthContext.tsx` — store `user_id`, `username`, login state
- [x] Wrap app in `AuthProvider` inside `src/app/layout.tsx`

### 2.3 UI — Login / Register Pages
- [x] Create `src/app/login/page.tsx` — Login form
- [x] Create `src/app/register/page.tsx` — Register form
- [x] Add login/logout toggle to `Navbar.tsx` based on auth state

---

## Phase 3 — Forgot Password Flow

3-step flow: Send OTP → Verify OTP → Reset Password

### 3.1 API Functions
- [x] Add `sendOtp(email)` to `src/lib/api.ts` → `POST /wp-json/custom/v1/forgot-password/send-otp`
- [x] Add `verifyOtp(email, otp)` to `src/lib/api.ts` → `POST /wp-json/custom/v1/forgot-password/verify-otp`
- [x] Add `resetPassword(email, otp, new_password)` to `src/lib/api.ts` → `POST /wp-json/custom/v1/forgot-password/reset`

### 3.2 UI
- [x] Create `src/app/forgot-password/page.tsx` — multi-step form (Send OTP → Verify → Reset)

---

## Phase 4 — User Profile

Requires Phase 2 (auth) to be complete.

### 4.1 API Functions
- [ ] Add `fetchMyProfile(user_id)` to `src/lib/api.ts` → `GET /wp-json/custom/v1/my-profile?user_id=X`
- [ ] Add `updateProfile(user_id, first_name, last_name, email)` to `src/lib/api.ts` → `POST /wp-json/custom/v1/update-profile`

### 4.2 UI
- [ ] Create `src/app/profile/page.tsx` — show profile info + edit form
- [ ] Protect route: redirect to `/login` if not authenticated

---

## Phase 5 — My Cart & My Orders

Requires Phase 2 (auth) to be complete.

### 5.1 API Functions
- [ ] Add `fetchMyCart(user_id)` to `src/lib/api.ts` → `POST /wp-json/custom/v1/get-cart/` with `{user_id}`
- [ ] Add `fetchMyOrders(user_id)` to `src/lib/api.ts` → `GET /wp-json/custom-api/v1/orders-by-user/{user_id}`

### 5.2 UI
- [ ] Create `src/app/cart/page.tsx` — display cart items for logged-in user
- [ ] Create `src/app/orders/page.tsx` — display order history for logged-in user
- [ ] Protect both routes: redirect to `/login` if not authenticated

---

## Progress Summary

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Navigation & Menu APIs | `[x] Done` |
| Phase 2 | Auth System | `[x] Done` |
| Phase 3 | Forgot Password Flow | `[x] Done` |
| Phase 4 | User Profile | `[ ] Pending` |
| Phase 5 | My Cart & My Orders | `[ ] Pending` |

---

## API Reference

| Name | Method | URL |
|------|--------|-----|
| Header Menu | GET | `/wp-json/custom/v1/header-menu` |
| Our Products Menu | GET | `/wp-json/custom/v1/our-product-menu` |
| Quick Links Menu | GET | `/wp-json/custom/v1/quick-link-menu` |
| About Us Menu | GET | `/wp-json/custom/v1/about-us-menu` |
| Support Menu | GET | `/wp-json/custom/v1/footer-menu` |
| Register User | POST | `/wp-admin/admin-ajax.php?action=register_user` |
| Login User | POST | `/wp-admin/admin-ajax.php?action=login_user` |
| Logout User | POST | `/wp-admin/admin-ajax.php?action=logout_user` |
| My Profile | GET | `/wp-json/custom/v1/my-profile?user_id=X` |
| Update Profile | POST | `/wp-json/custom/v1/update-profile` |
| Send OTP | POST | `/wp-json/custom/v1/forgot-password/send-otp` |
| Verify OTP | POST | `/wp-json/custom/v1/forgot-password/verify-otp` |
| Reset Password | POST | `/wp-json/custom/v1/forgot-password/reset` |
| My Cart | POST | `/wp-json/custom/v1/get-cart/` |
| My Orders | GET | `/wp-json/custom-api/v1/orders-by-user/{user_id}` |
