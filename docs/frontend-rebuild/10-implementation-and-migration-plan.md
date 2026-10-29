# 10 — IMPLEMENTATION & SAFE MIGRATION PLAN

**Strategy:** Parallel Shadow Architecture & Atomic Swap  
**Guiding Rule:** Zero downtime, zero broken backend contracts, zero destruction of working code during development.

---

## 1. Safety Architecture: Parallel Implementation

To avoid breaking the running application or polluting git history with half-finished states:
1. **Isolated Directory Structure:** All rebuilt components will be authored in a clean parallel directory:
   `src/components/v2/`
   `src/app/(v2)/` (or staged components swapping via feature flags).
2. **Strict Backend Immutability:**
   - No modifications to Supabase database tables or RLS policies.
   - `/api/generate/route.ts` remains 100% untouched.
   - `src/lib/ai/` and `src/lib/supabase/` remain stable.
3. **Rollback Guarantee:**
   - The legacy implementation in `src/components/workspace/` and `src/components/landing/` is preserved in place until the v2 suite passes all visual and functional acceptance tests.

---

## 2. Phased Execution Roadmap

```
[Phase 0: Audit & Blueprint] ──▶ (YOU ARE HERE — STOP & AWAIT APPROVAL)
       │
       ▼
[Phase 1: Foundations & Design Tokens]
  - Create src/styles/tokens.css (Precision Editorial System)
  - Build core UI primitives in src/components/v2/ui/ (Button, Input, Tabs, Dialog)
  - Verify zero-slop standards & WCAG AA contrast compliance
       │
       ▼
[Phase 2: Flagship Landing Page Rebuild]
  - Implement LandingNav, HeroSection, ThreeAnglesFramework, PricingSection
  - Integrate live brief-to-angles transformation demo
  - Verify responsive rendering across 360px, 768px, 1440px
       │
       ▼
[Phase 3: Flagship Workspace Studio Rebuild]
  - Create WorkspaceProvider & custom hooks (extracting 1,375-line monolith)
  - Build BriefPanel, DraftCanvas, AngleTabs, PreviewDrawer, HistoryTimeline
  - Wire to /api/generate and Supabase history actions
       │
       ▼
[Phase 4: Auth & Supporting Pages]
  - Rebuild /login, /register with Clerk-grade aesthetics
  - Rebuild /guide, /privacy, /terms
       │
       ▼
[Phase 5: Visual QA, Atomic Swap & Sunset]
  - Run Playwright screenshot comparison across all devices
  - Swap v2 components into primary routes
  - Deprecate and safely remove legacy AI-slop files (Particles, BorderBeam, Tilt)
```

---

## 3. Dependency & Regression Safeguards

| Component/Feature | Potential Regression Risk | Verification Mechanism |
| :--- | :--- | :--- |
| **API Contract** | Request body mismatch or response parsing failure in `/api/generate`. | Automated test with `test/generate.test.mjs` verifying schema validity. |
| **Guest Dev Cookie** | `cs_dev_session` HMAC fails to sign or parse in local development. | Test guest flow without Supabase credentials. |
| **Vietnamese Tone Enum** | Input form sends unexpected string, causing AI prompt failure. | TypeScript strict union type `ToneOption` enforced at compile time. |
| **Credit Deductions** | Frontend fails to handle HTTP 402 Out of Credits properly. | Mock 402 response test verifying `OutOfCreditsModal` triggers cleanly. |

---

## 4. Rollback Plan

If an unforeseen regression or build failure occurs during staging:
1. **Instant Git Rollback:** Because legacy components remain untouched during Phases 1–4, reverting the route imports in `src/app/page.tsx` and `src/app/workspace/page.tsx` restores the previous working state in under 60 seconds.
2. **Zero Database Migrations:** Since no database schemas are altered, rollback requires zero database rollbacks or data restoration scripts.

