# 11 — VISUAL QUALITY ASSURANCE & ACCEPTANCE CRITERIA

**Directive:** A page must not be considered finished merely because it compiles (`npm run build` exit code 0). Completion requires strict visual proof, responsive validation, and accessibility verification across real browser viewports.

---

## 1. Visual Verification Harness (Playwright MCP)

Every rebuilt page will be verified at four canonical viewports using automated screenshots and DOM layout audits:

1. **Mobile Compact:** `360px x 780px` (Samsung Galaxy A-series)
2. **Mobile Standard:** `390px x 844px` (iPhone 14/15/16)
3. **Tablet Portrait:** `768px x 1024px` (iPad Mini / iPad Air)
4. **Desktop Standard:** `1440px x 900px` (MacBook Pro / Standard Desktop)

Screenshots will be captured at:
- Initial page load (above-the-fold)
- Mid-page (transformation stage / feature grid)
- Full-page scroll settle
- Active interaction states (dropdown open, modal active, inline edit focused)

---

## 2. Objective Acceptance Matrix

### 2.1 Composition & Layout Integrity
- [ ] **Zero Horizontal Overflow:** `document.documentElement.scrollWidth === window.innerWidth` across all viewports.
- [ ] **Grid Discipline:** All elements align to the 8px spatial grid. No arbitrary margin or padding hacks (`margin-top: 13px`).
- [ ] **Fluid Scaling:** Margins and containers transition smoothly between breakpoints without abrupt visual snaps or overlapping text.

### 2.2 Typography & Vietnamese Language Quality
- [ ] **Zero Diacritical Clipping:** All uppercase and lowercase Vietnamese tone marks (Ả, Ẽ, Ồ, Ự, ắ, ệ) render with clean vertical clearance.
- [ ] **Optimal Measure:** Copywriting reading column strictly maintains 60–80 characters per line for maximum readability.
- [ ] **Tabular Telemetry:** Character counter figures do not jitter or shift adjacent text when count updates.

### 2.3 Anti-AI-Slop Audit (The Zero-Gimmick Rule)
- [ ] **No Glowing Borders:** Absence of `BorderBeam`, neon shadows, or rotating gradient perimeters.
- [ ] **No Canvas Particles:** Hero section operates with zero background canvas simulations.
- [ ] **No Unrequested 3D Tilt:** Mouse movements do not tilt cards in 3D space.
- [ ] **Authentic Realism:** Transformation examples use authentic, high-converting Vietnamese e-commerce briefs rather than placeholder dummy text.

### 2.4 Interaction & Tactility Quality
- [ ] **Tactile Press Feedback:** All interactive buttons exhibit a crisp, immediate physical response (`scale(0.98)` on active) within 120ms.
- [ ] **Copy Confirmation:** Clicking "Sao chép" produces an immediate visual confirmation badge without jarring the layout.
- [ ] **Angle Switching Velocity:** Switching between PAS, AIDA, and FAB angles occurs in `<50ms` without layout re-measurement jank.

### 2.5 Accessibility & Performance Gates
- [ ] **WCAG AA Contrast Compliance:** All text-to-background contrast ratios measure >= 4.5:1 (>= 3:1 for large display titles).
- [ ] **Keyboard Navigability:** Full end-to-end user journey (Login → Workspace → Generate → Copy) is executable using only `Tab`, `Enter`, and shortcut keys.
- [ ] **Reduced Motion Support:** When `prefers-reduced-motion: reduce` is enabled, all animations snap to zero duration; zero continuous motion occurs.
- [ ] **Lighthouse Performance Score:** Target score >= 90 on Desktop and >= 85 on Mobile.

