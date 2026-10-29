# 02 — FRONTEND COMPONENT FORENSICS: DEEP CODE & VISUAL DEFECT AUDIT

**Project:** Content Studio  
**Audit Scope:** Every visual and interactive component in `src/components/` and `src/app/`

---

## 1. Landing Page Components Forensics

### 1.1 `HeroSection.tsx` (405 lines)
- **Current Role:** Renders hero headline, sub-copy, interactive 3-angle transformation preview, and action CTAs.
- **Visual & Code Defects:**
  - Employs `SpotlightCard`, `Particles`, and `ShimmerButton` in combination with arbitrary inline colors (`#818cf8`, `#fb7185`, `#34d399`).
  - High degree of visual noise: The animated particles canvas runs continuously in the background, creating unnecessary GPU overhead on mobile devices.
  - Tightly coupled state: Transformation tabs use static mock data (`SAMPLE_BRIEF`) and copy-to-clipboard logic that partially duplicates workspace functionality.
- **Accessibility & Mobile:**
  - Viewport <400px causes the brief card and transformation result to vertically stack with cramped margins, pushing the primary CTA below the fold.
  - Interactive tabs lack standard ARIA `role="tab"` and `aria-selected` attributes.
- **Replacement Blueprint:**
  - Strip particle effects and glowing borders.
  - Rebuild as a high-contrast editorial transformation stage: On the left, an elegant, readable input brief; on the right, three distinct copy angles rendered with pristine typographic hierarchy.

---

### 1.2 `InteractivePlayground.tsx` (340 lines)
- **Current Role:** An in-page demo allowing visitors to generate sample copy before signing up.
- **Visual & Code Defects:**
  - Cluttered UI trying to imitate the full workspace inside a narrow container.
  - Contains duplicate sample scenarios and ad-hoc generation mock delays (`setTimeout`).
- **Replacement Blueprint:**
  - Merge the interactive storytelling directly into the hero experience. Eliminate redundant mini-apps on the landing page to keep the narrative focused and punchy.

---

### 1.3 `FeatureGrid.tsx` & `BentoGrid.tsx`
- **Current Role:** Displays product capabilities (PAS/AIDA/FAB frameworks, 1-click social export, tone customization).
- **Visual & Code Defects:**
  - Overly generic "Bento Grid" layout with glowing borders (`BorderBeam`) and hover tilts (`Tilt.tsx`).
  - Lacks genuine personality; looks identical to open-source Tailwind templates.
- **Replacement Blueprint:**
  - Replace with an asymmetric editorial feature breakdown modeled after Linear/Raycast, using authentic copywriting workflows, clear diagrams, and zero gratuitous glows.

---

### 1.4 `PricingSection.tsx`
- **Current Role:** Displays Free, Pro, and Enterprise pricing tiers with monthly/yearly billing toggle.
- **Visual & Code Defects:**
  - Typical glowing border on the "Recommended" tier card.
  - Unclear credit conversion explanation for Vietnamese merchants (e.g., how many credits equals how many Facebook ads).
- **Replacement Blueprint:**
  - Redesign based on Stripe/Framer pricing standards: clean table comparisons, transparent credit math, and crisp CTA hierarchy.

---

## 2. Workspace Components Forensics

### 2.1 `WorkspaceContainer.tsx` (1,375 lines — The Monolith)
- **Current Role:** Hosts the entire content studio application: form, generated results, social preview, history, modals, and toasts.
- **Architectural & Code Defects:**
  - **God Component Anti-pattern:** Manages 28 separate `useState` hooks, 6 `useRef` instances, and multiple asynchronous handlers in a single file.
  - **Hardware Hack Layout:** Uses CSS classes like `.workspace-zone.zone-expanded-1`, `.zone-panel-visible`, and manual transition delay hacks (`transition: opacity 160ms ... 110ms`) to manage collapsible columns. On screen resizing, this creates visible jank, text reflow glitches, and layout jumps.
  - **Memory & Re-render Waste:** Any update to a single field in the product form triggers a full re-render of the results panel, history drawer, and modals.
- **Replacement Blueprint:**
  - Break into a clean architecture:
    1. `WorkspaceProvider` (Zustand or React Context) managing form state, active drafts, and generation history.
    2. `StudioHeader`: Clean breadcrumb, active project title, credit meter, profile pill.
    3. `BriefPanel`: Focused, distraction-free input column.
    4. `DraftCanvas`: Tabbed/segmented view of Angles 1 (PAS), 2 (AIDA), and 3 (FAB) with inline rich text editing.
    5. `PreviewDrawer`: On-demand slide-over preview (Facebook, Instagram, Plain Text) instead of permanently taking up 33% of the viewport.

---

### 2.2 `ProductForm.tsx`
- **Current Role:** Input form for product name, description, target audience, and tone.
- **Defects:**
  - Generic rounded inputs with heavy borders and standard focus rings.
  - Tone selector is a cramped dropdown or wrapped pill list that overflows awkwardly on tablet viewports.
  - Character counter indicators lack visual subtlety.
- **Replacement Blueprint:**
  - Rebuild as a bespoke "Creative Brief Sheet": auto-resizing textareas, elegant tone selector chips, contextual keyboard shortcuts (`Ctrl+Enter` to generate), and quick-load sample presets.

---

### 2.3 `ResultsSection.tsx`, `CaptionCard.tsx`, `HeadlineCard.tsx`, `HashtagGroup.tsx`
- **Current Role:** Displays generated copy across angles, headlines, and hashtags.
- **Defects:**
  - Heavy border nesting. Each caption card has its own header, copy button, edit button, and character count badge, creating visual clutter.
  - Editing state is clunky: clicking edit swaps paragraph text for a basic textarea without auto-expanding height.
- **Replacement Blueprint:**
  - Clean typographic drafts. Text is editable in-place with subtle hover actions. One-click copy with refined tactile feedback.

---

### 2.4 `FacebookMockup.tsx`
- **Current Role:** Renders a simulated Facebook mobile feed post with avatar, page name, post text, like/comment counts.
- **Defects:**
  - Distracting when always visible; takes up valuable screen real estate on desktop and forces horizontal scrolling or awkward stacking on smaller screens.
  - Uses hardcoded fake user metrics ("3.2k lượt thích") that feel cheap.
- **Replacement Blueprint:**
  - Make preview an on-demand modal or dockable drawer. Allow toggling between Facebook Feed, Instagram Caption, and Plain Text / Markdown formats.

---

## 3. UI Library & Micro-effects Forensics

| Component | Lines | Issues Identified | Resolution |
| :--- | :--- | :--- | :--- |
| `BorderBeam.tsx` | 55 | Continuous CSS animation with CSS variables; distracting gradient halo. | **DELETE** |
| `Particles.tsx` | 134 | 2D canvas animation running `requestAnimationFrame` constantly; battery killer. | **DELETE** |
| `Tilt.tsx` | 92 | Mousemove event listener calculating 3D matrix transforms; janky on low-end hardware. | **DELETE** |
| `SpotlightCard.tsx` | 65 | Mouse position radial gradient overlay. Lowers contrast of text inside card. | **DELETE** |
| `ShimmerButton.tsx` | 78 | CSS shimmer sweep; feels like an advertisement button. | **REPLACE with tactile button** |
| `ScrollReveal.tsx` | 48 | Basic IntersectionObserver wrapper with rigid fade-up animation. | **REPLACE with lightweight CSS reveal** |

---

## 4. Accessibility (a11y) & Performance Audit

1. **Color Contrast Violations:**
   - Dark mode secondary text (`--ink-secondary: #515662` on `#0B0D13`) yields a contrast ratio of only 3.1:1, failing WCAG AA (requires 4.5:1).
   - Tone badges with light pastel text on transparent borders fail contrast checks in daylight environments.
2. **Focus Management:**
   - Modals (`AuthModal`, `OutOfCreditsModal`) lack proper focus trapping. Pressing `Tab` leaks focus behind the modal into the disabled workspace.
3. **Reduced Motion:**
   - Although `globals.css` includes `@media (prefers-reduced-motion: reduce)`, several keyframe animations (`@keyframes keycardSheenSweep`, `@keyframes shimmer`) were not properly bypassed, causing potential motion sickness for sensitive users.

