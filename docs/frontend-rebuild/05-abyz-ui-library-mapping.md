# 05 — ABYZ UI LIBRARY MAPPING & INTEGRATION AUDIT

**Local Corpus:** `D:\cpp\python\abyz-ui-library`  
**Master Registry:** `registry/components.json` (81 components) | `registry/effects.json` | `registry/licenses.json`  
**Directive:** Audit and select only high-utility, lightweight, accessible primitives. **Strictly reject gratuitous WebGL, heavy shaders, floating particles, and battery-draining visual noise.**

---

## 1. Selected Components: Approved for Adaptation

### 1. `motion-primitives-in-view`
- **Registry ID:** `motion-primitives-in-view`
- **Source Repository:** `motion-primitives`
- **Source File Path:** `components/core/in-view.tsx`
- **License:** MIT (`copy_ok: true`, `commercial: true`)
- **Dependencies:** React, standard IntersectionObserver (or lightweight CSS scroll-driven animation).
- **Purpose:** Graceful scroll-triggered section reveal on the landing page without full Framer Motion bundle overhead.
- **Next.js Compatibility:** 100% compatible with React 19 / Next.js 16 Client Components.
- **a11y & Performance:** Uses native browser IntersectionObserver with rootMargin; automatically bypassed when `prefers-reduced-motion` is active.
- **Verdict:** **ADAPT (Source copy, no heavy npm installs).**

---

### 2. `motion-primitives-text-effect`
- **Registry ID:** `motion-primitives-text-effect`
- **Source Repository:** `motion-primitives`
- **Source File Path:** `components/core/text-effect.tsx`
- **License:** MIT (`copy_ok: true`, `commercial: true`)
- **Dependencies:** React.
- **Purpose:** Clean, subtle word-by-word reveal for freshly generated Vietnamese headlines in the workspace.
- **Next.js Compatibility:** 100% compatible.
- **a11y & Performance:** Runs once upon completion of generation stream; screen readers read the full inner text immediately via hidden `aria-live` container.
- **Verdict:** **ADAPT.**

---

### 3. `motion-primitives-magnetic`
- **Registry ID:** `motion-primitives-magnetic`
- **Source Repository:** `motion-primitives`
- **Source File Path:** `components/core/magnetic.tsx`
- **License:** MIT (`copy_ok: true`, `commercial: true`)
- **Dependencies:** React, spring physics.
- **Purpose:** Subtle magnetic attraction (sub-4px) on the primary "Tạo bài viết" CTA to provide tactile delight without distraction.
- **Next.js Compatibility:** 100% compatible.
- **a11y & Performance:** Desktop pointer only (`hover: hover`); disabled on touch devices and reduced-motion settings.
- **Verdict:** **ADAPT.**

---

### 4. `cult-dynamic-island`
- **Registry ID:** `cult-dynamic-island`
- **Source Repository:** `cult-ui`
- **Source File Path:** `components/dynamic-island.tsx`
- **License:** MIT (`copy_ok: true`, `commercial: true`)
- **Dependencies:** React.
- **Purpose:** Floating status badge / generation progress pill in the mobile workspace header, showing live generation state ("Đang viết góc PAS...") and credit balance.
- **Next.js Compatibility:** 100% compatible.
- **a11y & Performance:** Smooth CSS transitions; announces state changes via `role="status"`.
- **Verdict:** **ADAPT.**

---

### 5. `magic-marquee` (Lightweight CSS version)
- **Registry ID:** `magic-marquee`
- **Source Repository:** `magic-ui`
- **Source File Path:** `packages/react/src/marquee.tsx`
- **License:** MIT (`copy_ok: true`, `commercial: true`)
- **Dependencies:** Pure CSS (`transform: translate3d`).
- **Purpose:** Used strictly for the client brand logo ribbon on the landing page.
- **Next.js Compatibility:** 100% compatible.
- **a11y & Performance:** Pauses on hover/focus; completely static when `prefers-reduced-motion: reduce`.
- **Verdict:** **ADAPT (Pure CSS implementation).**

---

## 2. Explicitly Rejected Components (Anti-AI-Slop Filter)

| Registry ID | Source Repo | Reason for Rejection |
| :--- | :--- | :--- |
| `magic-particles` | `magic-ui` | Continuous 2D canvas particle calculations drain mobile battery and add zero editorial value. |
| `magic-border-beam` | `magic-ui` | The ultimate AI-slop cliché; spinning neon perimeter borders distract from copywriting text. |
| `liquid-glass-core` | `liquid-glass-react`| WebGL refraction shader is excessive for an e-commerce copywriting tool and causes GPU lag on mobile. |
| `react-bits-splash-cursor` | `react-bits` | WebGL fluid cursor trail is noisy, gimmicky, and unlicensed for commercial resale (Commons Clause). |
| `threeui-cloth-study` | `threeui` | 3D WebGL cloth simulation adds unnecessary bundle weight (~600KB Three.js) for no UX gain. |
| `motion-primitives-tilt` | `motion-primitives`| Gimmicky card tilt creates disorientation and interferes with text selection. |
| `magic-meteors` | `magic-ui` | Falling meteor animation is generic SaaS visual noise. |

---

## 3. Integration Architecture & Dependency Rules

1. **Zero Monolithic Imports:** Never `npm install` entire component libraries. Copy only the necessary 30–80 line primitive into `src/components/ui/` and adapt it directly to the project's Tailwind v4 tokens.
2. **License Compliance:** All selected components are strictly **MIT** licensed with full commercial rights. Maintain attribution comments in source headers.
3. **No Unwanted Dependencies:** No additional heavy libraries (`three.js`, `@react-three/fiber`, or full `framer-motion`) will be added to `package.json`. All selected interactions run on native CSS transitions and lightweight React hooks.

