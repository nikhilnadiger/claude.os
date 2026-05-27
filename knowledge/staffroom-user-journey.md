# staffroom — User Journey & System Design Document

**Version:** 1.5  
**Built from:** Live production codebase · staffroom-v2 · main branch  
**Codebase last verified:** 26 May 2026  
**Purpose:** Single reference document covering every screen, user action, system response, wait state, and invisible backend operation — verified directly from code.

---

## HOW TO READ THIS DOCUMENT

Every user interaction in staffroom has three layers. This document covers all three for every screen and flow:

1. **What the user sees** — the screen, the content, the buttons
2. **What the user can do** — every possible action: tap, type, scroll, swipe, wait
3. **What staffroom does behind the scenes** — database checks, messages sent, data stored — all invisible to the user

Technical terms are avoided throughout. Where a technical concept must appear, it is described in plain language.

All content is verified directly from the production codebase.

---

## SECTION 1: THE THREE USER TYPES

staffroom has three types of users. Their experience diverges mainly at the login step — after that, the app is identical for all three.

---

### Type 1 — New User
Has never used staffroom. No account exists.

- Arrives at the public landing page
- Must verify their phone number via WhatsApp OTP to create an account
- After OTP verification: must fill in a short profile (pincode and occupation) — both required, neither can be skipped
- Gets full access to all features once profile is saved
- First thing they see after profile: the home page, all Career Insight cards locked

---

### Type 2 — Returning User
Has a staffroom account created via WhatsApp OTP (the current sign-in system).

- If their login session is still active (within 7 days of last sign-in): taken directly to the home page — no login step at all
- If the session has expired: must verify their phone via WhatsApp OTP once (no profile step — profile is already on record)
- No password ever involved

---

### Type 3 — Old User
Had a staffroom account before WhatsApp OTP was introduced. The old sign-in method is no longer available.

- Their phone number may already be in staffroom's database from the earlier system
- When they return and verify via WhatsApp OTP: staffroom silently recognises their phone and links their old account to the new system — the user sees nothing unusual
- **If their old profile included pincode and occupation:** treated as a Returning User — straight to home after OTP
- **If those fields were missing from their old profile:** the profile step appears, same as a New User
- No error message, no "account migration" notice — the transition is completely invisible

---

## SECTION 2: ENTRY POINTS

Seven ways users can arrive at staffroom. Each creates a slightly different starting context.

---

### Entry 1 — Direct URL or Bookmark
User types `thestaffroom.in` into their browser or has it saved as a bookmark.

- Opens in the phone's main browser (Chrome, Safari, Firefox, etc.)
- All features work normally
- WhatsApp OTP delivery works without issues

---

### Entry 2 — Instagram Ad → In-App Browser
User clicks a staffroom ad on Instagram.

- The page opens inside Instagram's built-in browser — **not** the phone's main browser
- staffroom automatically detects this (checks invisible signals in the browser's identity)
- **A yellow warning banner appears** at the top of the login page:  
  *"You're in an in-app browser. For best experience, open in Chrome or Safari."*
- A **"Copy link"** button copies the current URL; button text then changes to:  
  *"Link copied! Paste it in Chrome or Safari."*
- There is no "Open in browser" button — the user must manually paste the URL into Chrome or Safari
- **OTP still works inside the in-app browser** — the banner is advisory, not a blocker. User can ignore it and complete sign-up normally.
- If user copies the link and opens it in Chrome: identical experience to a direct URL visit
- Instagram ad attribution is tracked by Meta's own advertising system; staffroom does not separately store which ad brought the user in

---

### Entry 3 — WhatsApp Nudge Link
staffroom sends automated WhatsApp messages to users who have interacted with the platform. User clicks the link in a message.

- Link format: `thestaffroom.in/nudge/go?to=[destination-URL]`
- Opens inside WhatsApp's built-in browser (same in-app browser situation as Instagram)
- **Before sending the user anywhere:** staffroom's server records the click — which page was linked, when it was clicked, whether the user is inside a WebView browser, and the user's identity if known
- User is immediately taken to the destination (e.g. `/home`, `/share-experience`, a specific school page)
- If the user is already logged in: destination page loads directly
- If not logged in: login page appears first, then user is sent to the original destination after signing in
- The same yellow advisory WebView banner appears on the login page if applicable

---

### Entry 4 — Organic WhatsApp Share (Unknown to staffroom)
A staffroom user or anyone else forwards a staffroom link in a WhatsApp group independently — not an official staffroom nudge.

- Could be any staffroom URL — a school page, the home page, the landing page
- Opens inside WhatsApp's built-in browser
- **staffroom does not know this came from a WhatsApp share** — no tracking code is attached to the link
- The system silently records that a browser session started (including WebView status) but cannot attribute it to a specific sender
- Experience is otherwise identical to any other WebView entry

---

### Entry 5 — Referral Link
An existing staffroom user shares their personal referral link with someone.

- Link format: `thestaffroom.in/referral?code=[UNIQUE-CODE]`
- Can be shared anywhere — WhatsApp, SMS, copied manually
- When the link is clicked: staffroom reads the referral code, stores it silently in the browser, and immediately redirects the user
  - If the code was tied to a specific school: user is sent to that school's profile page (with referral tracking attached)
  - If no school attached: user is sent to the landing page
- A referral banner appears on the login page: *"You are signing up via a referral link."* with the referral code displayed in a badge
- The referral code travels silently through the entire sign-up process
- When the new user completes sign-up: the referrer's "successful sign-ups" count goes up by 1. No further reward exists beyond this count — confirmed from code.

---

### Entry 6 — Search Engine (Google, Bing, etc.)
User discovers staffroom via an organic search result.

- Opens in the phone's main browser
- Could land on the home page or a specific school page (school pages are individually indexed by search engines)
- The site's SEO title: *"staffroom - where great teachers meet great schools"*
- School pages are included in the sitemap and marked for weekly re-indexing

---

### Entry 7 — Any Other Link (SMS, Email, Other App)
Any staffroom link circulated outside the above channels.

- If the app the user taps from uses an in-app browser: WebView detected, advisory banner shown (same as Instagram/WhatsApp)
- If the app opens the phone's main browser: normal experience, no banner

---

## SECTION 3: SCREEN-BY-SCREEN DOCUMENTATION

---

### SCREEN 1 — Landing Page

**URL:** `thestaffroom.in` or `thestaffroom.in/`  
**Who reaches this screen:** Anyone — logged in or not. Both authenticated and unauthenticated users see the same content.  
**Logged-in users:** See the page like everyone else. After the page loads and auth state is confirmed, they are redirected to `/home` (or their original destination if they were sent here from a protected page). This happens client-side after render — they may briefly see the page before the redirect fires.

---

#### What the user sees

The landing page is a linear scroll with the following sections from top to bottom:

**1. Hero section (dark green):**
- staffroom logo + search bar (*"Search for schools..."*) in the header
- Headline: *"Know your school. Before you join."*
- Subline: *"Compare your school and salary with N teachers nearby."*
  - N only shows for authenticated users who have a pincode on file. Unauthenticated users (or auth users without pincode) see the subline without a number.
- Hamburger menu icon (top right)

**2. Salary benchmarks section:**
Platform-wide salary data for teachers across different experience bands.

**3. Career Insights section:**
The user's five personal career insight cards (locked or partially/fully unlocked based on review progress). Accessible to all users — unauthenticated users see all five cards locked.

**4. Teacher Voices section:**
Review excerpts and quotes from teachers who have used staffroom.

**5. City selector section:**
A row of city buttons to filter the Top Schools list below.

**6. Top Schools section:**
A list of up to 15 ranked schools (filterable by city). Each school card shows name, location, rating, and salary/review data where available.

**Sticky search navbar:**
Appears when the user scrolls past the hero section — compact version with search bar locks to the top.

**What is NOT on this page:**
- No tabs (Top Rated / Career Insights tabs no longer exist)
- No login popup on arrival
- No forced redirect to login just for visiting
- No auth overlay on this page (intentionally disabled)

---

#### What the user can do

| Action | What happens |
|--------|-------------|
| Type in the header search bar (min 2 characters) | After a brief pause: a dropdown appears with matching schools. Results come from two sources: Google Places (India-wide school search) and staffroom's own manually curated school list. |
| Select a school from the search dropdown | Brief loading screen, then School Profile page for that school. Behind the scenes: staffroom logs which school was selected. |
| Click on a school card (Top Schools section) | School Profile page for that school |
| Tap a city button (City selector) | Top Schools list filters to that city |
| Scroll down | Sticky search navbar locks to top of screen |
| Click hamburger menu icon (unauthenticated) | Dropdown opens with a **Log In** button (routes to `/login?returnUrl=[current page]`) + footer with Instagram and YouTube icons |
| Click **Log In** in the menu | Login page, with return URL set so user is sent back here after login |

---

#### Wait states
- Top Schools section: loading state shown while the school list loads from staffroom's database (typically 1–2 seconds)
- Career Insights section: loads unlock state for authenticated users (brief spinner)

---

#### What staffroom does behind the scenes

- **On every page load (once per browser session, 400ms after the page opens):** Records a session landing — full URL visited, whether the user is inside an in-app browser (WebView), and user identity if they are logged in. This is used to track traffic sources and WebView usage. Fires silently; no user-visible effect.
- **Top Schools list:** Loaded from staffroom's database (up to 150 schools fetched, filtered to max 15 per city view). Schools are ranked by a 6-tier system based on rating level and data completeness (salary + qualitative comments).
- **Career Insights section:** For unauthenticated users, all 5 cards show as locked. For authenticated users, unlock state is fetched from the server.
- **Logged-in redirect:** After auth state loads client-side, if the user is authenticated they are sent to `/home` (or their original destination) via `router.replace`. This is not a server-side redirect — the page has already rendered by this point.

---

#### Exit points
- Click a school card or search result → School Profile page
- Click Log In (hamburger menu, unauthenticated) → Login page
- Authenticated user: auto-redirect to `/home` after auth state loads
- Close browser

---

---

### SCREEN 2 — Login Page

**URL:** `thestaffroom.in/login`  
**Who reaches this screen:**
- Anyone who clicks "Login to continue" or "Sign up"
- Any logged-out user who tries to access a protected page (they are redirected here with their original destination saved, so they return to it after login)
- Exception: trying to access `/home` while logged out sends user to `/` (landing), not `/login`

**Layout note:** On mobile, the login form is rendered as a **bottom sheet** — an animated panel that slides up from the bottom of the screen over a dark green full-page background with the staffroom logo. On desktop, it is a centered modal. The phone → OTP → profile flow is the same regardless of layout.

**Note on another URL:** A separate page at `/whatsapp-verification` shows a similar OTP form, but no part of the app links to it or redirects to it — it is effectively unreachable through normal use. See Section 7 (Unreachable Features).

---

#### States of this page

**State A — WebView banner (shown if Instagram/WhatsApp/Facebook in-app browser detected):**
A yellow banner inside the login panel:
- Heading: *"You're in an in-app browser."*
- Sub-text: *"For best experience, open in Chrome or Safari."*
- An underlined *"Copy link"* text link below the sub-text — copies the current URL to clipboard
- **×** dismiss button (top right of the banner)
- The entire banner card is also tappable to copy the link

**State B — Referral banner (shown if user arrived via a referral link):**
A dark green banner inside the login panel:
> *"You are signing up via a referral link."*
> The referral code shown in a monospace badge.
> If a return destination is stored: *"After signup you'll be redirected to: [path]"* is also shown.

**State C — Phone input step (default view):**
- staffroom logo and branding
- Heading: *"Join the staffroom!"*
- Fixed `+91` country code (India, not editable)
- Phone number field (10 digits, numbers only)
- Button: **Send OTP via WhatsApp** (greyed out / disabled until exactly 10 digits are entered)

**State D — OTP entry step (after phone is submitted):**
- Six individual digit input boxes (one per digit of the 6-digit OTP)
- Countdown timer: *"Resend in [N]s"* counting down from 60 seconds
- **Resend OTP** button — enabled only after countdown reaches zero
- *"Change phone number"* link — returns to State C
- **Verify OTP** button

**State E — Profile step (appears for New Users, or users with incomplete profiles):**
- Heading: *"Almost There!"*
- Pincode field (6 digits, required)
- Occupation: four radio buttons — Teaching staff / Non-Teaching staff / Principal / Others
- **Continue** button — disabled until both fields are filled and valid

**State F — Loading overlay:**
- Spinner animation
- Text: *"Verifying code..."* or *"Redirecting..."*
- Covers the entire page; user cannot interact with anything underneath

**State G — Error state:**
- Red alert box below the relevant input with an error message
- Toast notification appears in the corner of the screen
- OTP input field is cleared (so user can try again)

---

#### What the user can do — Phone Step (State C)

| Action | What happens |
|--------|-------------|
| Type phone number | Only digits are accepted; any other character is removed automatically. The Send button enables only when exactly 10 digits have been entered. |
| Click **Send OTP via WhatsApp** | Button shows *"Sending..."* with a spinner. Input is disabled. staffroom sends a WhatsApp message to the entered number. On success: moves to OTP step (State D), 60-second countdown starts. On failure: error message shown. |
| Click **Copy link** (WebView banner) | Current page URL copied to clipboard. Button text changes to *"Link copied! Paste it in Chrome or Safari."* If clipboard API unavailable: *"Please copy the URL from your browser address bar."* alert shown. |
| Click **×** on WebView banner | Banner hidden for the rest of the browser session |

---

#### What the user can do — OTP Step (State D)

| Action | What happens |
|--------|-------------|
| Type a digit in any OTP box | Cursor auto-advances to the next box. After the 6th digit is entered, the form auto-submits after a 100ms pause. |
| Paste a 6-digit code | All six digits fill into the boxes automatically |
| Click **Verify OTP** (or auto-submit on 6th digit) | Loading overlay (State F) appears. Verification runs. See outcome table below. |
| Click **Resend OTP** (after 60-second countdown) | Same as clicking "Send OTP" — new code sent, countdown restarts |
| Click *"Change phone number"* | Returns to State C (phone input). Countdown stops. |

**OTP verification outcomes:**

| What the system finds | What the user sees next |
|----------------------|------------------------|
| Phone not in staffroom's system | Profile step (State E) |
| Phone found, profile complete | Loading → Share Experience page (`/share-experience`), or original destination if a returnUrl was set |
| Phone found (Old User), profile complete | Same as above — seamless |
| Phone found (any user), profile incomplete | Profile step (State E) |
| Wrong OTP code entered | Error: *"Incorrect verification code. Please check the code and try again."* OTP boxes cleared |
| OTP expired (5-minute limit) | *"This verification code has expired. Please request a new OTP."* |
| OTP already used | *"This code has already been used. Please sign in or request a new OTP."* |
| Too many OTP requests in 5 minutes | *"You've requested too many OTPs. Please try again after 5 minutes."* |
| WhatsApp service unavailable | *"We couldn't send your OTP. Please try again."* |

---

#### What the user can do — Profile Step (State E)

| Action | What happens |
|--------|-------------|
| Fill pincode + select occupation, then click **Continue** | Loading state, then profile saved, then Share Experience page (`/share-experience`), or original destination if a returnUrl was set. |
| Leave any field blank or invalid | Continue button stays disabled — cannot proceed |
| Enter invalid pincode (not exactly 6 digits) | Error: *"Please enter a valid 6-digit pincode"* |
| Close browser mid-profile | Account was created during OTP verification, but profile is incomplete. Next time this phone signs in, the profile step will appear again. |

---

#### Wait states
- OTP sending: button shows *"Sending..."*, input disabled — typically 1–3 seconds
- OTP verification: loading overlay covers page — typically 1–3 seconds
- Profile save: button shows loading state — typically 1–2 seconds
- After success: *"Redirecting..."* overlay for 300ms before landing on home page

---

#### What staffroom does behind the scenes

**When "Send OTP via WhatsApp" is clicked:**
1. Validates the phone number is 10–15 digits
2. Deletes any previous OTP stored for this phone (cleanup)
3. Generates a fresh 6-digit random code
4. Stores the code (in a secured, unreadable form) in staffroom's fast-access database with a **5-minute expiry**
5. Sends a WhatsApp template message to `+91[phone]` via the WhatsApp Business API, with the OTP code embedded

**When "Verify OTP" is clicked:**
1. Checks the entered code against what was stored
2. Checks the code has not expired (must be within 5 minutes of sending)
3. Checks the code has not already been used
4. Marks the code as used (keeps a record for security audit — does not delete it)
5. Checks staffroom's user database for this phone number:
   - **Not found → New User:** Creates a new user account with the phone number
   - **Found, has WhatsApp link → Returning User:** Retrieves existing account
   - **Found in old system, no WhatsApp link → Old User:** Silently links old account to new WhatsApp sign-in method
6. Checks whether pincode and occupation are on file → determines `profileComplete`
7. Generates a login session (valid for 7 days)
8. Stores the session in three places simultaneously: browser cookie, browser local storage, and app memory — so it survives page refreshes and browser restarts
9. If a referral code was stored in the browser (from Entry 5): links the new user to the referrer and increments the referrer's count. This runs in the background and does not slow down the login response.

**When "Continue" (Profile step) is clicked:**
1. Validates pincode (must be exactly 6 digits) and occupation (must be selected)
2. Saves pincode and occupation to the user's record in the database
3. Generates a fresh login session and stores it
4. Fires a **"Complete Registration" event** to Meta's advertising platform — includes the phone number in a one-way hashed form (for privacy compliance). This is used to measure ad conversion. Runs server-side in addition to the browser-side pixel.

---

#### Exit points
- Successful login with no returnUrl → Share Experience page (`/share-experience`)
- Successful login with a returnUrl → original page user was trying to reach
- Close browser mid-flow → exit (OTP expires in 5 minutes; profile is saved if OTP was verified)
- Any error → stays on Login page, user can retry

**Note on returnUrl:** Clicking "Log In" from the hamburger menu always passes the current page as returnUrl. Users who reach `/login` directly (e.g., via a locked Career Insights card, or typing the URL directly) have no returnUrl and are sent to `/share-experience` after login. This routing was changed in May 2026 to reduce the drop between signup and first form interaction.

---

---

### SCREEN 3 — Home Page

**URL:** `thestaffroom.in/home`  
**Who sees this screen:** Anyone — logged in or not. No auth guard on this page.  
**Unauthenticated access:** Page loads normally. No redirect, no auth overlay. Same content as the landing page.  
**How you arrive here:** After login, after profile save, clicking "Schools" in bottom nav, or navigating directly

---

#### What the user sees

The Home page renders **identical content** to the Landing page — the same `HomePageContent` component is used for both `/` and `/home`. The only functional differences are in the header menu (authenticated users see profile options; unauthenticated users see a Log In button).

**Content sections (top to bottom) — same as Landing page:**
1. Hero section (dark green) — search bar, headline, teacher count subline
2. Salary benchmarks section
3. Career Insights section — 5 cards (locked/unlocked per this user's review progress if authenticated; all locked if unauthenticated)
4. Teacher Voices section
5. City selector section
6. Top Schools section (up to 15 schools, filterable by city)

**Header:**
- staffroom logo (left)
- Search bar (centre): *"Search for schools..."*
- Hamburger menu icon (right) — *"Menu"* label below icon

**Hamburger menu — authenticated user:**
Dropdown opens with:
- User avatar + masked phone number + Contributor's Voice badge (if earned)
- **Your Profile** item
- **Sign out** item
- Footer: *"staffroom powered WIP Technology Solutions Private Limited"* + Instagram + YouTube icons

**Hamburger menu — unauthenticated user:**
Dropdown opens with:
- **Log In** button (routes to `/login?returnUrl=[current page]`)
- Footer: same as above

**Bottom navigation bar (always visible):**
Three items — Schools | Your Experience | Community

---

#### What the user can do

| Action | What happens |
|--------|-------------|
| Search in header bar (min 2 characters) | Dropdown appears after a brief pause. Shows schools from Google Places + staffroom manual list. |
| Select school from search results | Brief loading screen → School Profile page. staffroom logs the search. |
| Click a school card (Top Schools section) | School Profile page |
| Tap a city button (City selector) | Top Schools list filters to that city |
| Click a locked insight card | Prompt to continue or start the review form |
| Click an unlocked insight card | Shows the user's data for that card |
| Click **Invite Colleague** (visible only when all 5 cards unlocked) | Opens WhatsApp with a pre-filled share message containing the user's personal referral link |
| Click hamburger menu (authenticated) | Dropdown opens with: **Your Profile** / **Sign out** + footer |
| Click **Your Profile** | Profile page |
| Click **Sign out** | Session cleared from browser (cookie + local storage + app memory). Taken to Landing page (`/`). |
| Click hamburger menu (unauthenticated) | Dropdown opens with **Log In** button |
| Click **Schools** (bottom nav) | Already on Home — no change |
| Click **Your Experience** (bottom nav) | Share Experience page |
| Click **Community** (bottom nav) | Opens staffroom's WhatsApp community group in a new tab or the WhatsApp app |

---

#### Wait states
- On page load: skeleton placeholder cards shown while Top Rated list loads (1–2 seconds)
- On search: dropdown appears after 300ms debounce pause
- On tab switch: Career Insights tab loads user's unlock state (brief spinner)

---

#### What staffroom does behind the scenes

- **No auth check on page load:** `/home` has no auth guard. All users see the same page content. The auth state determines what the Career Insights section shows (locked vs unlocked), not whether the page is accessible.
- **Top Schools list:** Loaded from staffroom's database. Up to 150 schools are fetched; max 15 displayed. Ranked by a 6-tier system based on rating and data completeness. Filterable by city.
- **Career Insights data:** For authenticated users, checks the user's review completion state to determine which of the 5 cards to show as locked or unlocked. For unauthenticated users, all 5 cards show as locked. Platform-wide statistics are recomputed daily and cached.
- **After each sign-in:** Fetches and stores the user's context — city, pincode, list of reviews submitted, badge status.

---

#### What's different between `/` and `/home`

| Feature | Landing `/` | Home `/home` |
|---------|-------------|-------------|
| Auth required | No | No |
| If logged in | Redirects to /home after auth state loads | Stays here |
| Bottom nav | Shown | Shown |
| Referral code handling | Yes — plants referral code + returnUrl into browser storage | No |
| Content | Identical | Identical |

Both pages render the exact same `HomePageContent` component. The only differences are referral code handling on `/` and the post-auth redirect. Both pages are open to all users.

---

#### Exit points
- Click school → School Profile
- Click Your Experience (bottom nav) → Share Experience
- Click Community (bottom nav) → external WhatsApp group (leaves app)
- Click Your Profile (menu) → Profile page
- Sign out → Landing page
- Close browser

---

---

### SCREEN 4 — School Profile Page

**URL:** `thestaffroom.in/school/[school-name~identifier]`  
**Who sees this:** Anyone — logged in or not. Most content is visible to all. Some actions require being logged in.  
**How you arrive:** Search result, school card click, shared link, nudge redirect, referral redirect, direct URL

---

#### What the user sees (top to bottom)

**1. School header (dark green hero section):**
- School name (large, prominent)
- Full address — tappable, opens Google Maps
- School classification tags: class range (e.g., "Nursery–12"), board type (CBSE / ICSE / State), management type (Private / Private Aided)
- **Salary range cards:** Three ranges showing estimated monthly salary (₹min–₹max) for teachers with 0–5 years, 5–15 years, and 15+ years of experience. Based on reviews submitted by teachers. Only visible when salary data exists.
- **Teacher count badge:** *"Teachers here: [N]"* — this is the total number of teachers working in the school's geographic area, drawn from a national education dataset (UDISE). It is **not** a count of staffroom users or registered members.
- **Save/bookmark icon** (top right of header)
- **Share icon** (top right of header)

**2. Sticky navigation bar (appears on scroll):**
- School name + back arrow (left) + share + save buttons (right)
- Locks to top when user scrolls past the hero

**3. School overview section:**
- Contact info: phone, email, website — sourced from national database (UDISE) and Google
- School details: established year, board, class range, category, management type, status
- Location: full address, district, state, block, pincode

**4. Review section heading and CTA — varies by context:**

The heading above reviews and the CTA button below them change based on how many reviews the school has and what the logged-in user has done.

*School with zero reviews:*
- Section heading: *"Be the first to get insights and compare this school"*
- Subheading: *"Names of teachers are never shared with schools"*

*School with one or more reviews:*
- Section heading: *"What teachers say!"*
- Subheading: *"Names of teachers are never shared with schools"*

**5. Review list (shown only when reviews exist):**
- One card per submitted review
- Each card shows: overall rating, monthly salary, whether the school provides a written contract, whether salary is paid on time, written comments (what the teacher liked, what they'd improve), benefits received, years of experience
- Reviewer name: always shown as *"Verified Teacher"* — never identified
- Cards are expandable/collapsible (tap to expand)
- The logged-in user's own review, if they have one, appears at the top of the list

**6. CTA button — three states based on logged-in user's review history:**

| User's review status for this school | Button shown | Subtitle shown |
|--------------------------------------|-------------|---------------|
| Has not reviewed | *"Share your experience at this school"* | *"Add your review to help other teachers make informed choices."* |
| Review in progress | *"Continue your review"* | *"You have a review in progress. Continue where you left off."* |
| Review complete | No button — completion card shown instead | *"Thanks for reviewing in [Month, Year]."* |

**7. Insight card — shown below the CTA, varies by review status:**

| User's review status | Card shown | Card text | Button |
|---------------------|-----------|-----------|-------|
| Has not reviewed, zero school reviews | `SeeYourInsightsCard` | *"Compare your school and salary with [N] teachers nearby. It will take you <2 mins."* | *"Share your experience and find out"* |
| Has not reviewed, school has reviews | `SeeYourInsightsCard` | *"Understand and compare your school and salary with [N] teachers nearby. It will take you <2 mins."* | *"Share your experience and find out"* |
| Review in progress | `PartialInsightsCard` | *"[N] insights unlocked. Complete sharing your experience and unlock all five insights."* | *"Continue →"* |
| Review complete | `InviteColleagueCard` | *"Help a colleague understand their career. Share staffroom and they'll get their own career insights — based on their school and salary."* | *"Invite a colleague →"* |

The [N] in insight card text is the teacher count for the school's area (same national dataset figure as the header badge). Only shown if `teacherCount > 0`.

**8. Additional sections (shown when data exists):**
- `SchoolFeaturesCard` — rendered when supplementary UDISE data is available for this school (infrastructure, facilities)
- `ContactInfoCard` — rendered when contact data (email, phone, website) is available

**Note on ReviewModal:** A `ReviewModal` component exists in the codebase but is **not used** anywhere on the school profile page. The review form opens via the `AddReviewCTA` component directly.

---

#### What the user can do

| Action | Auth needed? | What happens |
|--------|-------------|-------------|
| Tap the school address | No | Google Maps opens |
| Tap **Save / Bookmark** | Yes | School saved to user's profile. If not logged in: *"Please login to save schools"* tooltip shown — button visible but action blocked. |
| Tap **Share** | No | Share dialog opens |
| Read a review | No | Card expands to show full content |
| Tap *"Share your experience at this school"* | Yes | Review form opens as a dialog on this page. If not logged in: auth prompt shown. |
| Tap *"Continue your review"* | Yes | Review form opens pre-filled with existing answers |
| Tap *"Share your experience and find out"* (insight card) | Yes | Review form opens. If not logged in: auth prompt shown. |
| Tap *"Continue →"* (partial insights card) | Yes | Review form opens pre-filled |
| Tap *"Invite a colleague →"* (completed insight card) | Yes | Opens WhatsApp with pre-filled invite message |
| Tap the back arrow | No | Returns to Home page |

**Share dialog options:**

| Share action | What happens |
|-------------|-------------|
| WhatsApp | Opens WhatsApp with a pre-filled message linking to this school |
| Copy link | URL copied to clipboard |
| More options | Opens the phone's native share menu |

All share actions are silently recorded by staffroom (platform used, school shared, user ID if logged in).

---

#### Wait states
- **Page load:** School data is loaded by the server before the page renders — user waits on a blank or loading state until data is ready (typically 1–3 seconds). If load fails, user sees an error message.
- **Reviews:** Load separately after the initial page renders — brief "loading" state, then reviews appear
- **Salary ranges:** Load separately — may briefly show "no data" before populating
- **Teacher count:** Resolved after page loads — blank until data arrives (typically 1–2 extra seconds)
- **Save button:** Shows brief loading state after tap

---

#### What staffroom does behind the scenes

**Before the page renders (server side — happens before user sees anything):**
1. Reads the school identifier from the URL (can be a Google Place ID, a staffroom internal school ID, or a URL slug)
2. Searches for the school using a cascade:
   - First: staffroom's mapping table (links Google Place IDs to national school records)
   - Second: direct school ID lookup in the main school database
   - Third: checks if the school exists only in review data (no national record)
   - Fourth: falls back to Google Places API (live call) if nothing found internally
3. If the URL slug doesn't match the school's canonical URL: silently redirects to the correct URL (user never notices)
4. Delivers school data to the page (name, address, tags, contact info, overview)

**After the page renders (client side):**
5. Fetches all reviews for this school — all reviews that have at least basic data (overall rating, worked recently flag) are shown, regardless of admin approval status. No minimum review count threshold.
6. Fetches salary ranges — computed from all submitted reviews for this school, grouped into experience brackets
7. Fetches teacher count via two-step lookup:
   - Gets the school's pincode from its record
   - Looks up the pincode in a national pincode reference table to get district/block/state
   - Queries a national teacher count dataset (pre-loaded into staffroom's database) for that area
   - Displays the total regional teacher population — this is census-style data, not staffroom user counts
8. If user is logged in: checks whether they have already saved this school
9. If user is logged in: checks whether they have already submitted a review for this school

**On save/unsave:**
- Checks authentication; records the save action (with school details) in the database; toggles save state in app memory

**On share:**
- Records the share event in the database: platform used, share type, school ID, user ID (if logged in), timestamp

---

#### Exit points
- Tap back arrow → Home page
- Tap school address → Google Maps (leaves staffroom)
- Tap share → WhatsApp or native share (may leave staffroom)
- Complete a review → stays on school page (review form closes)
- Close browser

---

---

### SCREEN 5 — Share Experience (Review Submission)

**URL:** `thestaffroom.in/share-experience`  
**Who sees this:** Anyone — logged in or not. Unauthenticated users can land on the page and search for a school. Once a school is selected, they see a login prompt card ("Log in to see your career insights") with a CTA that routes to `/login?returnUrl=[share-experience-url-with-school]` — the form itself requires authentication.  
**How you arrive:** Bottom nav "Your Experience", or the *"Share your experience at this school"* / *"Continue your review"* CTA on a school profile page (which opens an overlay version of the same form)

---

#### What the user sees

**If arriving from bottom nav (school not pre-selected):**
A dark-themed search bar at the top: *"Search for a school you've worked at..."*
User must search for and select a school before the form appears.

**The review form — full sequence:**

The form has a gate question, then six steps, with two insight reveal screens appearing between steps. Progress bar shows *"N/6"* at the top (e.g., "1/6", "2/6").

**Gate — "Have you worked here recently?"**
A single **Yes** button (checkmark circle). There is no "No" option. Tapping Yes saves the answer and advances immediately to the S0 Gate Screen. The user cannot proceed without tapping Yes — they can only navigate away.

If a user returns to a school where they previously saved a non-"Yes" answer (legacy data only), the form shows a static message instead of the gate: *"We only collect reviews from people who have worked here recently."* No action is available from this state.

**After gate "Yes" — S0 Gate Screen (interstitial before Step 1):**
A full-screen card appears before the form begins:
- Heading: *"See your career insights."*
- Body: *"Understand and compare your school and salary with [N] teachers near you. It will take you <2 mins."*
- Subtext: *"Share your experience and get your career insights."*
- Button: *"Let's start"*
- Footer: *"Your name will never be shared with any school."*

**Step 1 — Overall Experience:**
Four questions: professional feedback from management (Yes/No/Somewhat); written contract provided (Yes/No); salary paid on time (Yes/No/Sometimes); overall experience rating (1–5 stars)

**After Step 1 "Next" — Reveal A (full-screen card):**
- Badge: *"School quality — unlocked"* (green pill)
- Large metric: *"[N]%"* — the percentage of all teachers on staffroom who gave the same overall star rating as the user
- Description: *"of teachers on staffroom rate their schools the same as you."*
- Nudge: *"Complete the next section to find out how your salary compares to your peers."*
- Button: *"Continue →"*

**Step 2 — Salary:**
Three fields: monthly salary in rupees (number); total years of work experience (number); days taking work home per week (number)

**Inline during Step 2 — SalaryContextCard:**
As soon as the user enters their years of experience (value > 0), a card appears below that question:
- Heading: *"Typical Salary for [0–5 / 5–15 / 15+] Years Experience"*
- Value: salary range for that experience band (₹min – ₹max) based on verified reviews at this school
- Footer: *"Based on verified teacher reviews from this school"*
Only shown if sufficient salary data exists for this school. Does not appear if data is absent.

**After Step 2 "Next" — Reveal B (full-screen card):**
- Badge: *"Your salary — unlocked"* (green pill)
- Large metric: *"[N]%"* — percentage of teachers on staffroom who earn more than the user
- Description: *"of teachers on staffroom earn more than you."*
- Nudge: *"Complete the remaining sections to unlock three more insights."*
- Button: *"Continue →"*

**Step 3 — Benefits:**
Multi-select checkboxes: which benefits does the school provide? (HRA, transport, PF, medical, etc.)

**Step 4 — Deductions:**
Multi-select checkboxes: what fees or deductions do teachers pay? (school fees for own children, fines, etc.)

**Step 5 — Working Conditions:**
Multi-radio group: *"Are the following easy to do in this school?"* — covers: taking leave / trying new things / working with other teachers / working with management / giving feedback to the principal

**Step 6 — Final Comments:**
Two required free-text fields: what you like about working here; what needs improvement

**Completion screen (after Step 6 submitted):**
- Heading: *"All insights unlocked"*
- Body: *"Your experience has been noted. Your name will never be shared with the school."*
- Button: *"See your career insights"*

**Every question at every step is required.** The "Next" button is disabled until all questions in the current step are answered. There is no way to skip a question.

**Back button:** Available on every step. Returns to the previous step. All answers are preserved.

**Browser back button:** Intercepted — pressing the phone's back button navigates to the previous form step, not away from the page.

---

#### What the user can do

| Action | What happens |
|--------|-------------|
| Search for a school (if not pre-selected) | Dropdown appears after typing min 2 characters. Shows schools from Google Places + staffroom manual list. Selecting a school loads existing progress (if any) or starts fresh. |
| Answer any question | Answer is selected. The form immediately saves all current answers to staffroom's database in the background (*"Saving..."* text briefly appears). |
| Click **Next** (when all current section answers are complete) | Moves to the next section |
| Click **Back** | Returns to the previous section. Saved answers are preserved. |
| Close browser or navigate away mid-form | Progress is saved (up to the last auto-save). On return, the form resumes from the first unanswered section. |
| Return to this school after previously starting | Form loads with all previous answers pre-filled. Starts at the first unanswered question. |
| Complete all steps (Gate + Steps 1–6) | Completion screen: *"All insights unlocked"* / *"Your experience has been noted. Your name will never be shared with the school."* / button *"See your career insights"* |
| Click **See your career insights** | Goes to `/home?school=[placeId]#career-insights` — scrolls to the Career Insights section, showing this school's data |

---

#### Wait states
- School search: dropdown appears after 300ms pause after typing stops
- *"Saving..."* text appears briefly on the form while each auto-save runs (triggered after every answer)
- Final submission: success screen appears after the last save confirms (1–2 seconds)

---

#### What staffroom does behind the scenes

**When a school is selected:**
1. Looks up the school to resolve its internal ID (checks staffroom manual school list → national school mapping table → Google Places API as fallback)
2. Checks if the logged-in user already has a saved (partial or complete) submission for this school
3. If yes: fetches all saved answers, merges them, and jumps the form to the first unanswered question
4. If no: initialises a blank form

**On every answer (auto-save):**
1. All current form answers are sent to staffroom's database
2. Stored under the combination of: this user's ID + this school's ID (one record per user per school)
3. If a record already exists: updated. If not: created with a unique review ID.
4. Completion state is tracked based on which fields are filled:

| State label | Condition |
|------------|-----------|
| `s0_only` | Gate question answered |
| `s1_complete` | Gate + Step 1 fully answered (Overall Experience rating) |
| `s2_step2_complete` | Gate + Step 1 + Step 2 fully answered (salary and work-from-home days) |
| `full_complete` | Gate + all steps fully answered (qualitative comments in Step 6 filled) |

This completion state drives which Career Insight cards are unlocked.

**On full completion (Step 5 saved):**
1. Review record is complete in the database
2. **Review goes live immediately** — there is no admin approval gate. A moderation table exists in the database (`stepper_form_approval`) but is never written to by any part of the system; it was designed for a future approval workflow that was not implemented. All reviews with an overall rating and a worked-recently answer appear on the school profile page immediately after submission.
3. Badge status is re-checked and updated in the background
4. User's Career Insight cards update to reflect full unlock

**If mid-form save fails (network error):**
The *"Saving..."* indicator disappears silently. No error is shown to the user. The answer may not have been saved to the database — but it remains in the form on-screen. *(This is a known gap — see Section 8.)*

---

#### Exit points
- Complete all steps → completion screen → Career Insights on Home page
- Tap back repeatedly → back to school selection, then to home
- Navigate via bottom nav → progress auto-saved, resumable anytime
- Close browser → progress saved to last successful auto-save

---

---

### SCREEN 6 — Profile Page

**URL:** `thestaffroom.in/profile`  
**Who sees this:** Logged-in users only. Redirected to Login if not authenticated.  
**How you arrive:** Hamburger menu → "Your Profile"

---

#### What the user sees (top to bottom)

**Profile header:**
- Circular avatar with the first letter of the user's name
- If the user has earned the **Contributor's Voice** badge: a small gold badge icon in the corner of the avatar
- Masked phone number: shown as `******XXXX` (last 4 digits only)
- *"Verified Account"* label

**Stats row (2 cards):**
- **Experiences shared by you** (right card): number of reviews the user has submitted
- **You are a member since** (left card): hardcoded placeholder — every user sees *"January 2024"* regardless of when they actually joined. No date is retrieved from the database for this field. Non-functional.

Note: A "Teacher Count" stat was previously shown in this row. It has been removed. Teacher count data is still used elsewhere on the page (in the Career Insights card) but is no longer displayed as a stat card.

**Referral section:**
- The user's personal referral link
- **Copy** button
- Two stats: *"Successful teacher sign-ups from your referral"* (count of sign-ups via this link) and *"Verified teacher experiences from your referral"* (count of reviews submitted by referred users)

**Saved Schools:**
- Section heading: *"My Saved Schools"*
- Grid of school cards the user has bookmarked from school profile pages
- Each card: school name, address, an unsave button
- Empty state: *"No saved schools yet"*

**My Experiences:**
- Section heading always visible
- One card per submitted review, showing: school name, overall star rating, salary, years of experience, comments excerpt, submission timestamp
- Status badge on each card: **Complete** / **In Progress** / **Not live**
- Tapping a card: opens a full review detail dialog
- Dialog shows: all review details, benefits (up to 4 shown), salary on time, written contract status
- Dialog has one action button: **Visit School Page**

**Sign Out button:**
A dedicated "Sign out" button at the bottom of the page (red tinted, below all other content). Signs the user out immediately.

**Career Insights card (always shown below My Experiences — three states):**

| User's review state | Card shown | What it says | Tapping goes to |
|--------------------|-----------|-------------|----------------|
| No reviews submitted | `SeeYourInsightsCard` | *"See your career insights."* / *"Understand and compare your school and salary with [N] teachers nearby. It will take you <2 mins."* / Button: *"Share your experience and find out"* | `/share-experience` |
| At least one review exists but not fully complete | `PartialInsightsCard` | *"[N] insights unlocked."* / *"Complete sharing your experience and unlock all five insights."* / Button: *"Continue →"* | `/share-experience?placeId=...` (most recently updated incomplete review) |
| All reviews fully complete | `AllInsightsUnlockedCard` | *"All insights unlocked"* / *"Your experience has been noted. Your name will never be shared with the school."* / Button: *"See your career insights"* | `/home#career-insights` |

When no reviews exist, this card is the primary content of the My Experiences section.

---

#### What the user can do

| Action | What happens |
|--------|-------------|
| Tap a saved school card | School Profile page for that school |
| Tap unsave on a saved school | School removed from saved list immediately |
| Tap **Copy** on referral link | Referral URL copied to clipboard |
| Tap a review card | Full review dialog opens |
| Tap **Visit School Page** (in review dialog) | School Profile page for that school |
| Tap *"Share your experience and find out"* (insight card) | Share Experience page |
| Tap *"Continue →"* (partial insights card) | Share Experience page, pre-filled with that school's answers |
| Tap *"See your career insights"* (completed card) | Home page, Career Insights tab |
| Tap **Sign out** (button at bottom of page) | Session cleared from browser (cookie + local storage + app memory). Taken to Landing page (`/`). |

**What users CANNOT do on this page:**
- Edit their name, pincode, or occupation — no edit profile feature exists
- Delete a review — no delete or edit option for reviews
- Delete their account — no self-service account deletion

---

#### Wait states
- Page load: saved schools and reviews are fetched from the database after the page renders (brief loading state, 1–2 seconds)

---

#### What staffroom does behind the scenes

- Loads user context (city, pincode, list of submitted reviews) from the database
- Loads the user's saved schools list from the database
- Checks badge status once per session (does not re-check on every page visit)
- Fetches referral stats (sign-up count, verified review count from referred users)

---

#### Exit points
- Tap saved school card → School Profile
- Tap Visit School Page (in review dialog) → School Profile
- Tap insight card CTA → Share Experience or Home (Career Insights tab)
- Tap Back → previous page
- Navigate via bottom nav → Home or Share Experience

---

---

### SCREEN 7 — Referral Redirect

**URL:** `thestaffroom.in/referral?code=[CODE]` (optionally also `&redirect=[destination]`)  
**Who sees this:** Anyone who clicks a referral link  
**What they see:** Nothing — this page renders no visible content. It is a pure server-side redirect.

---

#### What happens (fully invisible to user)

1. Server reads the referral code from the URL
2. Validates the code format (must be 4–32 characters: letters, numbers, underscores, and hyphens allowed)
3. Checks for a destination in the `redirect` URL parameter

**Redirect logic:**

| Code valid? | Destination included? | Where user is sent |
|------------|----------------------|-------------------|
| Yes | Yes, points to a school page | That school's profile page, with `?referral=1&code=...` attached |
| Yes | No | Landing page, with `?referral=1&code=...` attached |
| No | Yes | Landing page (without referral tracking) |
| No | No | Landing page |

4. On the next page (landing or school profile): the referral code is stored in the browser (session storage)
5. The code travels silently through the entire sign-up flow
6. When the new user completes OTP verification: the referral code is sent to staffroom's server, the referrer's count is incremented, and a record is created linking the two users

No database call is made on the `/referral` page itself — all data is handled by the redirect destination and the OTP verification step.

---

### SCREEN 8 — 404 Page

**URL:** Any URL that doesn't exist on staffroom  
**What user sees:** An error page with a link back to the landing page  
**One action:** Click the link → Landing page

---

---

## SECTION 4: JOURNEY MAPS

How the screens connect for each user type and entry point.

---

### Journey A — New User via Instagram Ad

```
User sees a staffroom ad on Instagram
    ↓ Clicks ad
Instagram's built-in browser opens
    ↓
SCREEN 1: Landing Page (/)
    ↓ User clicks Login / Login to continue
SCREEN 2: Login Page (/login)
    — Yellow WebView banner appears at top —
    ↓ User decides to continue in-app OR copies link to Chrome

[In-app path:]
    ↓ User enters 10-digit phone number
    ↓ Clicks "Send OTP via WhatsApp"
    → staffroom sends WhatsApp message to entered number
    → 60-second countdown starts
    ↓ User opens WhatsApp to get the code
    [WAIT: user reads code from WhatsApp message]
    ↓ User enters 6-digit code
    → Auto-submits on 6th digit
    [WAIT: 1–3 seconds verification]
    ↓ OTP verified — New User detected
    ↓ Profile step appears
    ↓ User enters pincode, selects occupation, clicks Continue
    [WAIT: 1–2 seconds save]
    → Meta "CompleteRegistration" event fired
SCREEN 5: Share Experience (/share-experience)
    — No returnUrl was set for this journey; new post-login default —
    ↓ User searches for and selects a school, starts the review form
```

**Key notes:** WebView banner is advisory — OTP works normally inside Instagram's browser. No functional difference from a direct URL visit.

---

### Journey B — New User via Direct URL

```
User types thestaffroom.in into browser
    ↓
SCREEN 1: Landing Page (/)
    ↓ User browses Top Rated schools
    ↓ Clicks on a school card
SCREEN 4: School Profile (/school/...)
    ↓ User taps "Share your experience at this school"
    → Not logged in: redirected to Login with this school page as destination
SCREEN 2: Login Page (/login)
    ↓ Phone step → OTP step
    [WAIT: WhatsApp message, 60s countdown, OTP entry]
    ↓ OTP verified — New User
    ↓ Profile step → fills pincode, occupation
    [WAIT: save, 1–2 seconds]
    → User returned to original school page
SCREEN 4: School Profile (/school/...)
    ↓ Review form opens as overlay
SCREEN 5: Review Form (overlay on school page)
    ↓ Completes Gate + 6 Steps (auto-saves after each answer)
    ↓ Success screen
    → Button: "See your career insights"
SCREEN 3: Home Page (/home) — Career Insights tab, showing this school
```

---

### Journey C — New User via Referral Link

```
User receives referral link: thestaffroom.in/referral?code=XXXX
    ↓ Clicks link
SCREEN 7: Referral Redirect (/referral)
    — No content rendered — pure redirect —
    → Referral code stored in browser
    → Redirected to landing page (or school page if code was school-specific)
SCREEN 1: Landing Page (/) [or School Profile]
    ↓ User clicks Login
SCREEN 2: Login Page (/login)
    — Referral banner: "You are signing up via a referral link." —
    ↓ Phone step → OTP step → Profile step
    [On OTP verify: referral code sent to server, referrer count +1]
SCREEN 3: Home Page (/home)
```

---

### Journey D — Returning User, Session Active (within 7 days)

```
User opens thestaffroom.in
    ↓
SCREEN 1: Landing Page (/)
    — Valid session detected in browser —
    → Immediately redirected (user barely sees the landing page)
SCREEN 3: Home Page (/home)
    — No login step required —
```

---

### Journey E — Returning User, Session Expired (after 7 days)

```
User opens thestaffroom.in
    ↓
SCREEN 1: Landing Page (/)
    ↓ Clicks login (or tries a protected page)
SCREEN 2: Login Page (/login)
    ↓ Phone step → OTP step
    [No profile step — profile is already complete]
    [WAIT: WhatsApp OTP delivery and entry]
    ↓ OTP verified → existing account found
SCREEN 5: Share Experience (/share-experience)
    [or original destination if the user was redirected from a specific page]
```

---

### Journey F — Returning User via WhatsApp Nudge

Scenario: user started the review gate but didn't complete Step 1. staffroom sends a `ratings1_nudge_042026` message.

```
User receives WhatsApp message from staffroom
    ↓ Clicks link in message
WhatsApp's built-in browser opens
Link: thestaffroom.in/nudge/go?to=/share-experience
    → staffroom server records: URL, timestamp, WebView detected, user ID if known
    → 302 redirect to /share-experience
    → App also records the landing: URL, WebView status, user ID

[If session still active (within 7 days):]
SCREEN 5: Share Experience (/share-experience)
    — Previous answers pre-loaded, form starts at first unanswered section —
    ↓ User continues and completes the form
    ↓ Success screen → Career Insights

[If session expired:]
SCREEN 2: Login Page (/login)
    — Same WebView advisory banner if applicable —
    ↓ Phone step → OTP step [no profile step]
    → Redirected back to /share-experience
SCREEN 5: Share Experience (/share-experience)
    — Previous answers pre-loaded —
    ↓ User completes form → success
```

---

### Journey G — Old User Returning After WhatsApp OTP Launch

```
User visits thestaffroom.in (no saved session — old session long expired)
    ↓
SCREEN 1: Landing Page (/)
    ↓ Clicks Login
SCREEN 2: Login Page (/login)
    ↓ User enters the same phone number they used when they originally signed up
    ↓ OTP sent to that number via WhatsApp
    ↓ User enters OTP code
    → staffroom finds phone in database (from old account)
    → staffroom silently creates a WhatsApp link for the old account
    → If old profile had pincode + occupation: treated as Returning User
    → If old profile was missing those fields: treated as New User (profile step shown)

[If profile complete:]
SCREEN 5: Share Experience (/share-experience)
    — Identical to any returning user with no returnUrl —

[If profile incomplete:]
SCREEN 2: Login Page — Profile step
    ↓ User fills pincode + occupation → Continue
SCREEN 5: Share Experience (/share-experience)
```

The user sees no indication that anything special happened. The account linking is completely silent.

---

### Journey H — Returning User Saves a School

```
[From any journey that arrives at a School Profile page]
SCREEN 4: School Profile (/school/...)
    ↓ User taps the bookmark/save icon
    → staffroom checks: is user logged in? Yes.
    → staffroom records: this school is saved to this user's account
    → Save icon changes to filled/active state
    ↓ [User navigates to profile later]
SCREEN 6: Profile Page (/profile)
    → School appears in "My Saved Schools" section
    ↓ User taps the school card
SCREEN 4: School Profile (/school/...)
```

---

### Journey I — User Shares a School

```
SCREEN 4: School Profile (/school/...)
    ↓ User taps the Share button
    → Share dialog opens
    ↓ User selects WhatsApp
    → WhatsApp opens with pre-filled message
    → staffroom records the share (platform: WhatsApp, school, user ID, timestamp)
    → User sends the message (leaves staffroom into WhatsApp)

[Recipient clicks the shared link:]
Journey D, E, or B depending on recipient's auth status
```

---

## SECTION 5: CAREER INSIGHTS IN DETAIL

Career Insights are the five personal data cards that show a teacher how their salary, benefits, deductions, and working conditions compare to everyone else on the platform.

---

### The 5 Cards

| Card | Title | What it shows |
|------|-------|--------------|
| A | Quality Percentile | Where the user's overall experience rating falls in the distribution of all ratings on the platform. E.g., *"You're in the top 30% for experience quality."* |
| B | Salary Percentile | Where the user's salary falls among all salaries on the platform. E.g., *"Your salary is higher than 45% of teachers."* |
| C | Benefits | The top 5 most common benefits (HRA, transport, PF, etc.) among teachers in the user's salary band |
| D | Deductions | The top 5 most common deductions (fees, fines, etc.) among teachers in the user's salary band |
| E | Ease of Work | Where the user's working conditions score falls in the distribution of all ease scores on the platform |

---

### Unlock Progression

Cards unlock progressively as the user completes more of the review form. There is no way to jump ahead. The unlock is driven by the backend completion state, which maps to form steps as follows:

| What the user has completed | Backend state | Cards unlocked |
|----------------------------|--------------|---------------|
| Nothing, or gate only answered | `s0_only` | None — all 5 cards show *"Share your experience to unlock"* |
| Gate + Step 1 answered (Overall Experience rating submitted) | `s1_complete` | Card A (school quality percentile) |
| Gate + Step 1 + Step 2 answered (salary and work-from-home days added) | `s2_step2_complete` | Card A + Card B (salary percentile) |
| Gate + all steps fully answered (including qualitative comments in Step 6) | `full_complete` | All 5 cards. *"Invite Colleague"* card also appears. |

---

### How Platform Data Is Computed

The numbers the user's data is compared against come from all reviews submitted on staffroom. This data is recomputed once daily (not on every visit). It is not sourced from any external dataset.

---

### Multi-School View

If a user has reviewed multiple schools, a school switcher appears above the cards — they can toggle between schools to see insights for each one.

---

### After Form Completion: What Happens

When user taps "See your career insights" from the review success screen:
- Taken to `/home?school=[placeId]#career-insights`
- Page scrolls to the Career Insights section automatically
- The completed school's data is pre-selected in the switcher

---

### Contributor's Voice Badge

- **What it is:** A small gold badge icon on the user's avatar (visible in profile and header menu)
- **When it appears:** Awarded automatically and immediately during the same save operation that completes the review form — specifically, the moment both free-text fields ("what you like" and "what to improve") are filled and saved. No admin action. No scheduled job.
- **Double-award protection:** The system uses an insert-if-not-exists operation — the badge cannot be awarded twice to the same user.
- **How the user finds out:** No notification is sent — the badge simply appears on the next time badge status is checked (once per session login).

---

## SECTION 6: THE NUDGE SYSTEM

staffroom automatically sends WhatsApp messages to users to encourage them to complete their reviews or return to the platform. Here is the full system.

---

### Nudge Types — Active vs Stale

Not all nudge types in the codebase are actually sent automatically. The distinction matters:

**5 live WhatsApp messages** staffroom sends to users:

| WhatsApp message sent | Queue table processed | Trigger condition | Where the link goes |
|----------------------|----------------------|------------------|-------------------|
| `otp` | — (not a nudge queue) | User requests login OTP | — (auth flow only, not a nudge) |
| `initiation_nudge_042026` | `initiation_nudge_queue` | User signed up but has not answered the gate question | `/share-experience` |
| `ratings1_nudge_042026` | `abandonment_queue` | Gate answered but Step 1 not completed | `/share-experience` (pre-filled) |
| `salary_nudge_042026` | `update_is_live_queue` | Step 1 completed but salary not yet added | `/share-experience` (to continue) |
| `completion_nudge_042026` | `completion_nudge_queue` | Salary added but qualitative steps not complete | `/share-experience` (to continue) |

**Note on naming:** The queue table names (`abandonment_queue`, `update_is_live_queue`) are from an earlier version of the system and were reused in the April 2026 refactor. The message type strings actually sent to users are the `_042026` names above.

**Note on `otp`:** The OTP message is sent by the auth service during login — it is not part of the nudge queue system and is not processed by the nudge scheduler.

**Delivery constraints:**
- Maximum 2 nudges per user per school
- Maximum 1 marketing message per user per 24 hours
- Each nudge type has a kill switch: it is cancelled if the user has already progressed past the trigger condition by the time it is processed

**Stale nudge types** — defined in code but have no active queue processor. Never sent automatically:

`abandonment`, `update_is_live`, `full_completion`, `search_intent`, `search_return`, `first_nudge`, `progress_nudge`, `completion_nudge`, `contributor_nudge`

**Message content:** The text of each WhatsApp message is configured in staffroom's WhatsApp Business account. School name and local teacher count are inserted dynamically. The exact message wording is not stored in the app's code.

**Scheduling:** Every 5 minutes. The nudge processor runs on an internal NestJS scheduler (`@Cron('*/5 * * * *')`) — not triggered externally. When it fires, it calls `processAllQueuesWithPriorityAndCycle()`, which processes all four active queue tables and dispatches any pending WhatsApp messages.

---

### What Happens When a User Clicks a Nudge Link

1. User taps the link in the WhatsApp message
2. Link opens: `thestaffroom.in/nudge/go?to=[destination-url]`
3. **Server records the click** before sending user anywhere: destination URL, timestamp, whether a WebView was detected, user ID if known
4. **302 redirect** — user is immediately sent to the destination URL
5. **On destination page load:** the app records the landing again — full URL visited, WebView status, user ID

User sees: only the destination page. The `/nudge/go` step is invisible (too fast to render).

6. If session active → user sees destination directly
7. If session expired → login page first, then redirected to destination

---

### Queue System

Each active nudge type has its own queue table in staffroom's database. When a triggering event happens (e.g., user answers the gate question), a record is added to the relevant queue. The internal NestJS cron runs every 5 minutes, reads each queue for unprocessed records, checks kill-switch conditions, sends the WhatsApp message, and marks the record as processed. Failed sends are marked as failed and not retried automatically.

---

## SECTION 7: UNREACHABLE FEATURES

These pages and features exist in the live codebase but have **no navigation path** that a regular user would follow to reach them. They are built, deployed, and accessible by direct URL, but invisible from the app's navigation.

---

| Feature | URL | What it is | Status |
|---------|-----|-----------|--------|
| **Nearby Schools (pincode search)** | No dedicated URL | A pincode-based school search. Previously existed as a "Nearby" tab in the old tab navigation system. The entire tab system (Top Rated / Career Insights / Nearby) has since been replaced by the current linear section layout. | Dead — the tab infrastructure it belonged to no longer exists. |
| **`/whatsapp-verification`** | `thestaffroom.in/whatsapp-verification` | An alternate WhatsApp OTP login page using a different component. Same API endpoints as `/login`. No auth guard, overlay, nav item, or redirect in the entire codebase points to it. | Orphaned — was never wired into the app's routing. Accessible by URL only. |
| **`/about`** | `thestaffroom.in/about` | A real, complete About page — team bios, platform values, podcast embed, CTA. Well designed. Only included in the sitemap (priority 0.7). Not linked from any nav element or component. | Real content, unreachable from the app. |
| **`/blogs`** and **`/blogs/[id]`** | `thestaffroom.in/blogs` | Real content — 9 podcast episode transcripts with embedded YouTube videos. Titles of named guests. Long-form interview format. Not included in the sitemap. Not linked from any navigation. | Real content, completely orphaned. |
| **`/dashboard/*`** | `thestaffroom.in/dashboard` | Admin-only section with ~10 sub-pages: user management, review moderation, nudge management, school management, WhatsApp stats, analytics, database viewer, and more. Requires a separate admin login (email + password — different from the user OTP system). Not visible to public users. | Admin-only. Intentionally hidden from users. |

---

## SECTION 8: SYSTEM BEHAVIORS & KNOWN LIMITATIONS

---

### WebView Detection — Which Apps Are Detected

staffroom checks the browser's identity string on every page load to detect in-app browsers.

| App / Browser | Detected as WebView? | Advisory banner on login? | OTP works? |
|--------------|---------------------|--------------------------|-----------|
| Instagram | Yes | Yes | Yes |
| WhatsApp | Yes | Yes | Yes |
| Facebook | Yes | Yes | Yes |
| Generic Android in-app browser | Yes | Yes | Yes |
| Chrome, Safari, Firefox | No | No | Yes |

---

### What staffroom Tracks Automatically

**On every page load (once per browser session):**
- Full URL visited
- Whether session is in a WebView (which app)
- User ID (if logged in)

**On specific user actions:**
- School saves: school details, user ID, timestamp
- School shares: platform used, school, user ID, timestamp
- Nudge link clicks: destination URL, timestamp, WebView status, user ID

**External analytics tools running at all times:**
- Microsoft Clarity — session recordings and heatmaps (production only)
- Meta Pixel — page views + registration conversion events
- Google Ads tracking tag (gtag — AW-17177065793)

Note: Umami was removed in May 2026 and is no longer active.

---

### What staffroom Does NOT Track

- UTM parameters from Instagram or other ads (inbound ad source not captured or stored by staffroom)
- Source of organic WhatsApp shares (no way to attribute these)
- User's GPS location or physical location (never requested)
- Device contacts, camera, microphone, or any app data

---

### Session Management

| Scenario | What happens |
|---------|-------------|
| User closes browser and returns within 7 days | Automatically logged in — no OTP required |
| User closes browser and returns after 7 days | Must re-verify phone via OTP (no password needed, no profile refill) |
| User taps Sign Out | Session cleared from browser immediately (cookie + local storage + app memory cleared). No server call — the session token is not actively cancelled on staffroom's server. |
| Multiple devices | Each device holds its own independent session |

---

### Known Limitations & Gaps

| Limitation | User impact |
|-----------|------------|
| **No SMS fallback for OTP** | If a user cannot receive WhatsApp messages on their number (e.g., number is on a phone they don't have), they cannot log in. There is no SMS alternative. |
| **Profile cannot be edited** | Users cannot update their name, pincode, or occupation after the initial profile step. No edit profile feature exists. |
| **Reviews cannot be edited or deleted** | Once submitted, a review is permanent from the user's side. No edit or delete option is available. |
| **Account cannot be deleted** | No self-service account deletion option exists anywhere in the app. |
| **Review form save failure is silent** | If the network drops while auto-saving a form answer, the *"Saving..."* indicator disappears with no error message. The user may believe their answer was saved when it was not. |
| **School 404 and server errors show the same message** | *"Failed to load school data. There might be a temporary issue. Please try again later."* — user cannot tell if the school doesn't exist or if the server had an error. |
| **Saved schools fetch failure is silent** | If the saved schools list fails to load on the profile page, the section simply shows nothing — no error, no retry. |
| **Session is not invalidated on sign-out** | Sign-out clears the browser only. If the token was copied elsewhere, it remains valid until it expires (7 days). |

---

## SECTION 9: COMPLETE ERROR REFERENCE

All user-visible error messages, with exact wording where confirmed from code.

| Where it appears | Situation | Exact message shown |
|-----------------|-----------|-------------------|
| Login — OTP send | Phone number not 10 digits | *"Please enter a valid 10-digit phone number"* |
| Login — OTP send | Too many OTP requests (rate limit: 5 per 5 min) | *"You've requested too many OTPs. Please try again after 5 minutes."* |
| Login — OTP send | WhatsApp service unavailable | *"We couldn't send your OTP. Please try again."* |
| Login — OTP send | Server returns non-parseable response | *"We couldn't send your OTP. Please check your number and try again."* |
| Login — OTP send | Network / connection failure (catch block) | *"Connection error. Please check your internet and try again."* |
| Login — OTP verify | No OTP record found for this phone (e.g. user skipped the send step, or old record was deleted) | *"No verification code found for this number. Please request a new OTP first."* |
| Login — OTP verify | Wrong code | *"Incorrect verification code. Please check the code and try again."* |
| Login — OTP verify | Code already used | *"This code has already been used. Please sign in or request a new OTP."* |
| Login — OTP verify | Code expired (5-min limit) | *"This verification code has expired. Please request a new OTP."* |
| Login — profile step | Pincode not 6 digits | *"Please enter a valid 6-digit pincode"* |
| Login — profile step | Occupation not selected | *"Please select your occupation"* |
| Login — OTP verify | Network failure during verification (catch block) | *"Failed to verify OTP. Please check your internet connection."* |
| Login — profile step | API failure | *"Failed to update profile. Please try again."* |
| School profile | Page fails to load (any reason) | *"Failed to load school data. There might be a temporary issue. Please try again later."* |
| Search (all search bars) | No matching schools | *"No schools found."* |
| Home — Top Rated | School list fails to load | *"No top rated schools found at the moment."* |
| Review form — mid-form | Auto-save fails | Silent — no error shown |
| Profile — saved schools | List fails to load | Silent — section shows blank |

All auth errors delivered as: inline red alert box (`"alert"` accessibility role) + toast notification in the corner of the screen.

---

## APPENDIX — ALL PAGES AT A GLANCE

| Page | URL | Public access | Login required | Reachable from nav | In sitemap |
|------|-----|--------------|---------------|-------------------|-----------|
| Landing | `/` | Yes | No | — (entry point) | Yes |
| Login | `/login` | Yes | No | Via hamburger menu / auth overlay | No |
| Home | `/home` | Yes | No | Bottom nav "Schools" | No |
| School Profile | `/school/[slug]` | Yes | No (read) / Yes (write/save) | Via search & school cards | Yes |
| Share Experience | `/share-experience` | No | Yes | Bottom nav "Your Experience" | Yes |
| Profile | `/profile` | No | Yes | Header menu "Your Profile" | No |
| Referral Redirect | `/referral` | Yes | No | Via referral link only | No |
| 404 | `/404` | Yes | No | — (error state) | No |
| About | `/about` | Yes | No | **No — URL only** | Yes |
| Blogs | `/blogs` | Yes | No | **No — URL only** | No |
| Blog Post | `/blogs/[id]` | Yes | No | **No — URL only** | No |
| WhatsApp Verify | `/whatsapp-verification` | Yes | No | **No — orphaned** | No |
| Dashboard | `/dashboard` | No | Admin only | **No — admin only** | No |

---

*Document built from direct code review of staffroom-v2 (main branch). Codebase last verified: 04 May 2026. All content verified from code.*
