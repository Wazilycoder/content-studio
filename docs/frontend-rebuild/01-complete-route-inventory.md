# 01 — COMPLETE ROUTE INVENTORY & ARCHITECTURE MAP

**Project:** Content Studio  
**Root:** `d:\cpp\python\content-studio`  
**Framework:** Next.js 16.4.3 (App Router) + React 19.3.0 + Tailwind CSS v4 + TypeScript 5.x

---

## 1. Technical Stack & Build Environment

| Layer | Current Technology | Status & Assessment |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.3 (App Router) | Modern, fast Turbopack bundling (`@tailwindcss/turbopack`). Retain framework structure. |
| **Runtime** | Node.js v24.21.0 | Stable server runtime for API routes and server actions. |
| **Styling** | Tailwind CSS v4 + raw CSS in `globals.css` (797 lines) | Needs complete hygiene; purge arbitrary animations and replace with clean design tokens. |
| **Icons** | `lucide-react` (v1.61.0) | Retain for clean iconography. |
| **Validation** | `zod` (v4.6.7) | Retain for client/server schema validation. |
| **Auth & DB** | `@supabase/ssr` (^0.12.7), `@supabase/supabase-js` (^2.118.0) | Retain Supabase SSR cookie integration and server clients. |

---

## 2. Route & Layout Inventory

### 2.1 Public & Marketing Routes
- **`/` (`src/app/page.tsx`):**
  - *Layout:* Wrapped by `src/app/layout.tsx`.
  - *Components:* `LandingNav.tsx`, `HeroSection.tsx`, `ThreeAnglesFramework.tsx`, `FeatureGrid.tsx`, `InteractivePlayground.tsx`, `PricingSection.tsx`, `TestimonialsSection.tsx`, `FaqSection.tsx`, `LandingFooter.tsx`.
  - *Purpose:* Conversion of Vietnamese e-commerce sellers; showcases the 3 marketing angles (PAS, AIDA, FAB).
  - *Defects:* Visual clutter, heavy neon cards, bloated DOM, confusing interactive playground duplicating workspace logic.

- **`/guide` (`src/app/guide/page.tsx`):**
  - *Purpose:* User education on crafting effective inputs, choosing tones, and utilizing angles.
  - *Defects:* Under-designed text walls lacking typographic hierarchy or interactive examples.

- **`/privacy` (`src/app/privacy/page.tsx`), `/terms` (`src/app/terms/page.tsx`), `/refund` (`src/app/refund/page.tsx`):**
  - *Purpose:* Legal and compliance pages for Vietnamese merchant SaaS operations.
  - *Defects:* Unpolished generic text documents with no navigation continuity.

### 2.2 Core Product Routes
- **`/workspace` (`src/app/workspace/page.tsx`):**
  - *Access:* Protected / Hybrid (allows guest preview, requires auth for persistence and credits).
  - *Components:* `WorkspaceContainer.tsx`, `WorkspaceHeader.tsx`, `ProductForm.tsx`, `ResultsSection.tsx`, `FacebookMockup.tsx`, `CaptionCard.tsx`, `HeadlineCard.tsx`, `HashtagGroup.tsx`, `HistoryDrawer.tsx`, `AuthModal.tsx`, `OutOfCreditsModal.tsx`, `TopUpModal.tsx`.
  - *State:* Massive client-side state machine embedded in `WorkspaceContainer.tsx`.
  - *Defects:* 1,375-line monolithic component; rigid 3-zone collapsible layout that breaks on standard 13" laptop screens (1280px-1440px) and collapses brutally on mobile.

### 2.3 Authentication Routes & Modals
- **`/login` (`src/app/login/page.tsx`):**
  - *Type:* Server-rendered page with client form.
  - *Actions:* Calls `signInAction` in `src/app/auth/actions.ts`.
- **`/register` (`src/app/register/page.tsx`):**
  - *Type:* Server-rendered page with client form.
  - *Actions:* Calls `signUpAction` in `src/app/auth/actions.ts`.
- **Workspace Auth Modal (`src/components/workspace/AuthModal.tsx`):**
  - *Type:* Inline modal when an unauthenticated user attempts to save or generate beyond guest limits.

### 2.4 API Endpoints & Server Actions
- **`POST /api/generate` (`src/app/api/generate/route.ts`):**
  - *Input:* `{ productName, productDescription, targetAudience, tone }`.
  - *Validation:* Zod schema (`InputSchema`).
  - *Security:* Rate limiting (`src/lib/security/rateLimiter.ts`), HMAC dev session verification, Supabase user check.
  - *AI Orchestration:* Calls `callUnifiedAi()` in `src/lib/ai/index.ts`.
  - *Output:* `{ captions: [3], headlines: [3], hashtags: [5] }`.
  - *Contract Status:* **STRICTLY PRESERVED.** No changes to payload structure.

- **`src/app/auth/actions.ts`:**
  - *Actions:* `signInAction`, `signUpAction`, `signOutAction`, `verifyCaptchaAction`, `getUserProfile`.
  - *Contract Status:* **PRESERVED.**

- **`src/app/history/actions.ts`:**
  - *Actions:* `fetchUserHistory`, `deleteHistoryItem`, `toggleStarHistoryItem`.
  - *Contract Status:* **PRESERVED.**

---

## 3. Server/Client Component Boundary Analysis

```
src/app/layout.tsx (Server Component)
├── <html> <head> <body>
│   ├── ThemeProvider / CSS Tokens
│   └── {children}
│
├── / (page.tsx - Server Component)
│   ├── LandingNav (Client Component - state: mobile menu, auth profile)
│   ├── HeroSection (Client Component - state: transformation tab activeAngle)
│   ├── ThreeAnglesFramework (Server/Client mix)
│   ├── FeatureGrid (Client Component - SpotlightCard / BentoGrid)
│   ├── InteractivePlayground (Client Component - sample test generator)
│   ├── PricingSection (Client Component - annual/monthly toggle)
│   ├── TestimonialsSection (Client Component - Marquee / Ticker)
│   ├── FaqSection (Client Component - Accordion state)
│   └── LandingFooter (Server Component)
│
└── /workspace (page.tsx - Server Component)
    └── WorkspaceContainer (CLIENT MONOLITH - 1,375 lines)
        ├── WorkspaceHeader (Credit balance, history toggle, top-up trigger)
        ├── ProductForm (Inputs, tone selector, sample quick-fills)
        ├── ResultsSection (PAS, AIDA, FAB display, copy buttons, edit state)
        │   ├── CaptionCard
        │   ├── HeadlineCard
        │   └── HashtagGroup
        ├── FacebookMockup (Simulated FB post feed with reactions & comments)
        ├── HistoryDrawer (Slide-over drawer with search, delete, star)
        └── Modals (AuthModal, OutOfCreditsModal, TopUpModal)
```

---

## 4. Complete Component Classification

| File Path | Classification | Detailed Justification |
| :--- | :--- | :--- |
| `src/app/globals.css` | **REPLACE** | 797 lines of uncurated CSS; replace with clean, tokenized Tailwind v4 stylesheet. |
| `src/components/ui/BorderBeam.tsx` | **REMOVE** | Pure visual slop. Obscures focus and drains mobile battery. |
| `src/components/ui/Particles.tsx` | **REMOVE** | Unnecessary canvas simulation. Distracts from product copywriting value. |
| `src/components/ui/Tilt.tsx` | **REMOVE** | Gimmicky 3D physics on mouse move. Degrades UX and performance. |
| `src/components/ui/ShimmerButton.tsx`| **REPLACE** | Replace with tactile, high-contrast, accessible editorial button primitive. |
| `src/components/ui/SpotlightCard.tsx` | **REPLACE** | Replace with clean border-contrast and subtle surface-layer elevation. |
| `src/components/ui/BentoGrid.tsx` | **REPLACE** | Overused bento layout; redesign into purposeful asymmetric product layout. |
| `src/components/landing/HeroSection.tsx` | **REPLACE** | Retain brief transformation concept, but completely rebuild visuals (Kinfolk/Linear tier). |
| `src/components/landing/LandingNav.tsx` | **REPLACE** | Discard glassmorphic pill nav; replace with crisp, sticky editorial header. |
| `src/components/landing/FeatureGrid.tsx`| **REPLACE** | Replace generic AI cards with structured editorial feature comparisons. |
| `src/components/landing/InteractivePlayground.tsx` | **REPLACE** | Harmonize directly with workspace architecture rather than disconnected demo. |
| `src/components/landing/PricingSection.tsx` | **REPLACE** | Redesign with Stripe/Framer clarity, transparent credit economics, and billing switch. |
| `src/components/landing/TestimonialsSection.tsx` | **REPLACE** | Rebuild into authenticated merchant case studies with real typography. |
| `src/components/landing/FaqSection.tsx` | **REPLACE** | Replace with accessible, keyboard-navigable native disclosure accordion. |
| `src/components/landing/LandingFooter.tsx` | **REPLACE** | Modernize typography, footer sitemap, legal links, and status badges. |
| `src/components/workspace/WorkspaceContainer.tsx`| **EXTRACT LOGIC & REPLACE** | Decompose 1,375 lines into clean Context/Hooks + modular, focused panels. |
| `src/components/workspace/ProductForm.tsx` | **REPLACE** | Rebuild into an intuitive, keyboard-optimized copywriting brief input panel. |
| `src/components/workspace/ResultsSection.tsx` | **REPLACE** | Transform into an editorial multi-draft canvas with instant comparison. |
| `src/components/workspace/FacebookMockup.tsx` | **REPLACE** | Redesign as a pixel-accurate, distraction-free social preview pane. |
| `src/components/workspace/CaptionCard.tsx` | **REPLACE** | Rebuild with inline editing, character counter badges, and 1-click export. |
| `src/components/workspace/HeadlineCard.tsx` | **REPLACE** | Typography-led hook card with copy and variation controls. |
| `src/components/workspace/HashtagGroup.tsx` | **REPLACE** | Clean tag cloud with bulk-copy and category filtering. |
| `src/components/workspace/HistoryDrawer.tsx`| **REPLACE** | Slide-over drawer replaced with an integrated history timeline and filter. |
| `src/components/workspace/AuthModal.tsx` | **REPLACE** | Unified with new Clerk-inspired design system. |
| `src/components/workspace/OutOfCreditsModal.tsx` | **REPLACE** | Clean upgrade modal with immediate value proposition and package selection. |
| `src/components/workspace/TopUpModal.tsx` | **REPLACE** | Integrated checkout / credit top-up dialog. |
| `src/types/content.ts` | **RETAIN NON-VISUAL** | Authoritative domain types (`ToneOption`, `GeneratedContent`, `CaptionItem`). |
| `src/lib/utils/charCounter.ts` | **RETAIN NON-VISUAL** | Unicode character counting logic for Facebook/Instagram limits. |
| `src/lib/utils/clipboard.ts` | **RETAIN NON-VISUAL** | Robust clipboard API fallback helper. |
| `src/lib/utils/filename.ts` | **RETAIN NON-VISUAL** | File name sanitization helper. |
| `src/lib/utils/cn.ts` | **RETAIN NON-VISUAL** | Standard class name merging utility. |
| `src/lib/ai/*` | **RETAIN NON-VISUAL** | Gemini, OpenRouter, and AI orchestration engines. |
| `src/lib/supabase/*` | **RETAIN NON-VISUAL** | Supabase client and server-side authentication helpers. |
| `src/lib/security/rateLimiter.ts` | **RETAIN NON-VISUAL** | Token-bucket rate limiter. |

---

## 5. Regression Risks & Hidden Dependencies

1. **Dev Session HMAC Signing:** `COOKIE_DEV_SESSION` is shared between `src/app/auth/actions.ts` and `src/app/api/generate/route.ts`. Any alteration to cookie names or serialization will break local dev guest mode.
2. **Vietnamese Tone Enum Synchronization:** The form options must strictly map to `ToneOption` union in `src/types/content.ts` ("hai-huoc", "trang-trong", etc.), as the prompt generator relies on exact string keys.
3. **Credit Accounting Timing:** Credits are deducted server-side in `/api/generate` before the LLM stream resolves. The frontend must correctly handle out-of-credits (HTTP 402) responses.

