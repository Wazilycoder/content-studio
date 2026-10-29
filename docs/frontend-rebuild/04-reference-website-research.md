# 04 — REFERENCE WEBSITE RESEARCH & FORENSIC BENCHMARKING

**Tools Used:** Browser Automation MCP (Playwright Engine)  
**Methodology:** Live runtime DOM extraction, computed styles inspection, viewport testing, and interaction analysis across 7 world-class benchmarks.

---

## 1. Primary Benchmark Deep Dives

### 1.1 Linear (`https://linear.app`) — Primary Inspiration for Workspace & Architecture
- **Computed Styles & Live Data:**
  - Background: `rgb(8, 9, 10)` (#08090A — deep obsidian basalt).
  - Text Primary: `rgb(247, 248, 248)` (#F7F8F8 — high-contrast crisp off-white).
  - Typography: `Inter Variable` / `SF Pro Display`, font size 64px, weight 510, tight letter-spacing `-1.408px`, line-height 1:1.
  - Header / Navigation: `rgba(0, 0, 0, 0)` with `backdrop-filter: blur(20px)`, bottom border `1px solid rgba(255, 255, 255, 0.08)`.
  - Buttons: Borderless pills (`radius: 9999px`, font size 13px, padding `0px 12px`), zero drop-shadow bloat.
- **Key Architectural Strengths:**
  - High information density without visual crowding.
  - Utter absence of decorative AI glows, border beams, or floating particles.
  - Hairline borders (`rgba(255, 255, 255, 0.08)`) create structure without heavy visual weight.
  - Superb keyboard-first focus management and keyboard shortcuts.
- **What Content Studio Adapts:**
  - Layout density, header navigation, hairline grid dividers, and calm keyboard-driven workspace state management.
- **What We Reject:**
  - Pure monochrome starkness: Content Studio needs an intentional warm editorial touch for Vietnamese copywriters.

---

### 1.2 Raycast (`https://www.raycast.com`) — Inspiration for Tactile Feedback & Micro-interactions
- **Computed Styles & Live Data:**
  - Background: `rgb(7, 8, 10)` (#07080A).
  - Primary CTA: `rgb(230, 230, 230)` with `border-radius: 8px`, `padding: 8px 12px`, `font-size: 14px`.
  - Contrast: High-contrast white and dark surfaces; crisp 8px rounded corners rather than excessive 2rem bubbles.
- **Key Strengths:**
  - Tactile physical feedback: Clicking buttons produces an immediate, subtle `scale(0.98)` spring reaction.
  - Clear copy-to-clipboard interactions with instant inline confirmation.
- **What Content Studio Adapts:**
  - Tactile button physics (`.btn-tactile`), compact 8px radius tokens, and crisp copy actions.

---

### 1.3 Cursor (`https://cursor.com`) — Inspiration for Warm Editorial Canvas & Typographic Confidence
- **Computed Styles & Live Data:**
  - Background: `rgb(247, 247, 244)` (#F7F7F4 — warm parchment paper).
  - Text Color: `rgb(38, 37, 30)` (#26251E — deep bistre ink, warmer than harsh #000000).
  - Typography: `CursorGothic` / System, 26px heading, letter-spacing `-0.325px`.
- **Key Strengths:**
  - Technical confidence and editorial calmness: Feels like an author's private study or an artisan's workbench rather than an arcade game.
  - Warm off-white light mode eliminates eye strain during hours of intense writing.
- **What Content Studio Adapts:**
  - Light mode canvas palette: Warm paper surface (`#F9F9F7`) paired with bistre ink (`#1A1A18`) for our day-mode workspace.

---

### 1.4 Clerk (`https://clerk.com`) & Supabase (`https://supabase.com`) — Authentication Architecture
- **Computed Styles & Live Data:**
  - Background: `rgb(247, 247, 248)`.
  - Auth Cards: Border `1px solid rgb(217, 217, 222)`, radius `12px`, zero heavy box-shadow.
- **Key Strengths:**
  - Trustworthy, clear input fields with instant validation feedback.
  - Clean separation between OAuth / Email actions and legal agreement terms.
- **What Content Studio Adapts:**
  - Full redesign of `/login`, `/register`, and `AuthModal` into centered, trustworthy cards with clear typography, inline error handling, and passwordless cues.

---

### 1.5 Framer (`https://www.framer.com`) & Stripe (`https://stripe.com`) — Visual Storytelling & Pricing Presentation
- **Key Strengths:**
  - Section Composition: Clear storytelling where every section visually proves one specific product capability.
  - Transparent pricing tiers with clear feature-by-feature comparison matrices.
- **What Content Studio Adapts:**
  - Transformation storytelling: Using side-by-side comparative views rather than disconnected interactive widgets.
  - Transparent pricing grid detailing exact credit consumption per ad angle.

---

## 2. Synthesis: Unified Art Direction Choice

| Reference | Primary Responsibility | Adopted Pattern |
| :--- | :--- | :--- |
| **Linear** | Studio Layout & Information Density | 3-pane responsive canvas, hairline borders, breadcrumbs, zero-slop cards. |
| **Cursor** | Typographic Tone & Light Mode | Warm parchment canvas (`#F9F9F7`), bistre ink (`#1A1A18`), editorial discipline. |
| **Raycast** | Micro-interactions & Tactility | Sub-0.15s tactile button springs, instant copy confirmation, crisp 8px radii. |
| **Clerk** | Authentication & Account Security | Center-stage auth container, clean input styling, contextual error messaging. |
| **Stripe / Framer**| Storytelling & Transparent Pricing | Clear merchant ROI, comparison tables, structured FAQ accordion. |

**The Primary Art Direction:** **"Precision Editorial Studio" (Xưởng Chế tác Ngôn từ Tinh xảo)**.  
A harmonious fusion of Linear's operational speed and Cursor/Kinfolk's typographic warmth.

