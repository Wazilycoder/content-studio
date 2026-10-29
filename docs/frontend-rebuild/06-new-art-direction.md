# 06 — NEW ART DIRECTION: "PRECISION EDITORIAL STUDIO"

**Concept:** Xưởng Chế tác Ngôn từ Tinh xảo (The High-Performance Wordsmith)  
**Philosophy:** Elevate AI ad copywriting from an algorithmic novelty into a calm, authoritative craft. Eliminate glowing circus effects in favor of razor-sharp typography, warm paper surfaces, and tactile precision.

---

## 1. Creative Concept & Brand Expression

### 1.1 The Metaphor: An Artisan's Writing Studio
Content Studio is not a robotic chatbot; it is a specialized drafting table for Vietnamese brand owners and marketing directors. 
- **The Physicality of Paper & Ink:** In light mode, the canvas evokes heavy archival cream paper (`#F9F9F7`), and typography feels printed in warm charcoal bistre (`#1A1A18`).
- **The Obsidian Night Mode:** In dark mode, the interface shifts to deep basalt slate (`#0A0B0E`) with crisp hairline borders (`rgba(255, 255, 255, 0.08)`), reminiscent of an architect’s nocturnal workstation.

### 1.2 Distinctive Visual Motif: The Editorial Hairline Grid
Instead of thick card borders, floating blobs, or neon glows, the interface is defined by **whisper-thin hairline structural dividers** (`1px solid var(--border-hairline)`). 
Every block has a purposeful geometric anchor, creating an aesthetic of discipline and quiet confidence.

---

## 2. Typographic System (Vietnamese-First)

Vietnamese copywriting presents unique challenges: compound tone marks (dấu hỏi, ngã, sắc, huyền, nặng) and vowel modifiers (ơ, ư, ă, ê, ô) can easily collide with ascenders or line heights.

### 2.1 Typeface Selection
- **Primary Display & Headings:** **Plus Jakarta Sans** / **Inter Variable** (or system `SF Pro Display`, `Geist Sans`).
  - *Weights:* 500 (Medium) for UI labels, 600 (SemiBold) for section titles. Strictly avoid faux-heavy 900 weights that make Vietnamese diacritics look like ink blots.
- **Editorial Body & Copywriting Canvas:** **Be Vietnam Pro** / **Inter**.
  - *Leading:* Generous line-height of `1.72` (28px on 16px font size) to give Vietnamese diacritical marks ample breathing room.
- **Data, Character Counters & Telemetry:** **JetBrains Mono** / **Geist Mono** / System Monospace.
  - Tabular figures (`font-variant-numeric: tabular-nums`) so character counters do not cause layout twitching as text is typed.

### 2.2 Typographic Hierarchy Scale

| Token | Size | Line Height | Tracking | Weight | Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-hero` | 56px (3.5rem) | 1.12 | -0.025em | 600 | Landing Page Primary Hero Hook |
| `heading-1` | 36px (2.25rem) | 1.20 | -0.020em | 600 | Section Titles, Major Modals |
| `heading-2` | 24px (1.5rem) | 1.30 | -0.015em | 550 | Angle Titles (PAS, AIDA, FAB) |
| `heading-3` | 18px (1.125rem)| 1.40 | -0.010em | 550 | Card Headers, Step Indicators |
| `body-editorial`| 15px (0.9375rem)| 1.72 | +0.005em | 400 | Generated Captions & Main Text |
| `ui-label` | 13px (0.8125rem)| 1.40 | +0.010em | 500 | Form Field Labels, Meta Badges |
| `mono-counter` | 12px (0.75rem) | 1.00 | 0.000em | 500 | Live Character Counter, Telemetry |

---

## 3. Color Architecture: Dual-Mode Palette

### 3.1 Light Mode — "Warm Parchment & Bistre Ink"
A soothing daylight palette designed for long hours of reading and editing without eye fatigue.

```
Canvas Base:        #F9F9F7  (Warm cream paper, non-glare)
Surface Raised:     #FFFFFF  (Pure white for active writing cards)
Surface Subdued:    #F1F1ED  (Muted secondary container)
Border Hairline:    #E5E5DE  (Whisper-thin stone border)
Border Strong:      #D1D1C7  (Interactive element boundary)

Ink Primary:        #1A1A18  (Bistre charcoal ink — WCAG AAA 13.8:1)
Ink Secondary:      #60605A  (Subdued editorial copy — WCAG AA 5.2:1)
Ink Tertiary:       #8A8A82  (Metadata, placeholders, timestamps)

Brand Accent:       #2A4BF5  (International Klein Cobalt — authoritative, calm)
Accent Vermilion:   #DE4732  (Editorial Vermilion — PAS angle accent)
Accent Amber:       #D97706  (Warm ochre — AIDA angle accent)
Accent Sage:        #15803D  (Deep forest sage — FAB angle accent)
```

### 3.2 Dark Mode — "Obsidian Slate & Luminescent Ink"
A distraction-free, battery-saving dark environment.

```
Canvas Base:        #0A0B0E  (Obsidian slate basalt)
Surface Raised:     #12141A  (Elevated writing surface)
Surface Subdued:    #181B23  (Form inputs and inactive panels)
Border Hairline:    rgba(255, 255, 255, 0.08)  (Crisp wireframe separation)
Border Strong:      rgba(255, 255, 255, 0.16)  (Active borders)

Ink Primary:        #F4F5F7  (Luminescent crisp text — WCAG AAA 15.2:1)
Ink Secondary:      #9AA0AE  (Balanced neutral gray — WCAG AA 6.1:1)
Ink Tertiary:       #5E6575  (Subtle telemetry and hints)

Brand Accent:       #5874FF  (Bright Cobalt — high contrast on dark)
Accent Vermilion:   #FF6B57  (Luminous coral — PAS angle)
Accent Amber:       #FBBF24  (Warm golden amber — AIDA angle)
Accent Sage:        #34D399  (Luminous emerald sage — FAB angle)
```

---

## 4. Depth, Elevation & Surface Model

**Strictly Ban Blur Gimmicks:** No blurry 60px neon box-shadows or radial glow overlays.  
Depth is achieved exclusively through:
1. **Luminance Steps:** Canvas (`#0A0B0E`) → Surface (`#12141A`) → Raised Active (`#181B23`).
2. **Hairline Outlines:** 1px borders with precise alpha opacity (`rgba(255, 255, 255, 0.08)` in dark, `#E5E5DE` in light).
3. **Sharp Diffuse Shadows:** Small, physically plausible contact shadows:  
   `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 8px 24px -4px rgba(0, 0, 0, 0.08);`

