# 07 — MASTER DESIGN SYSTEM SPECIFICATION

**System Name:** StudioTokens v3  
**Framework:** Tailwind CSS v4 Compatible  
**Philosophy:** Purposeful, accessible, high-density component tokens. Zero design filler.

---

## 1. Spacing & Spatial Grid Tokens

All layout proportions adhere to an 8px base rhythm with 4px sub-grid precision:

```css
--space-1:   4px;    /* Micro gaps, inner icon padding */
--space-2:   8px;    /* Compact element spacing, badge padding */
--space-3:   12px;   /* Button horizontal padding, input padding */
--space-4:   16px;   /* Card inner padding, form field gaps */
--space-5:   20px;   /* Section sub-headers */
--space-6:   24px;   /* Panel margins, desktop column gaps */
--space-8:   32px;   /* Large component separation */
--space-12:  48px;   /* Desktop section headers */
--space-16:  64px;   /* Major landing section vertical rhythm */
--space-24:  96px;   /* Hero block breathing space */
```

### Container Width Constraints
- **Studio Shell (Desktop):** Fluid 100vw, max `1720px`, clamped margins.
- **Landing Content Container:** Max `1200px`, centered with `24px` gutter padding.
- **Focused Copywriting Column:** Max `760px` (optimal reading measure: 65–75 characters per line).
- **Mobile Container:** Fluid 100%, minimum `16px` lateral safety margin.

---

## 2. Component System Specifications

### 2.1 Buttons (`<Button>`)
No generic AI glowing gradients. Tactile, physical feedback inspired by Raycast:

- **Primary Action (e.g., "Tạo bài viết", "Đăng ký"):**
  - Background: `var(--brand)` (Klein Cobalt `#2A4BF5` / `#5874FF`).
  - Text: High-contrast pure white (`#FFFFFF`).
  - Border: 1px solid `rgba(255, 255, 255, 0.12)`.
  - Radius: `8px` (compact, professional).
  - Physics: Active state shrinks to `scale(0.98)` with `120ms` spring easing.
- **Secondary Action (e.g., "Sao chép toàn bộ", "Đổi góc"):**
  - Background: `var(--surface-raised)`.
  - Border: `1px solid var(--border-hairline)`.
  - Text: `var(--ink-primary)`.
  - Hover: Background subtle shift + `translateY(-1px)`.
- **Ghost / Subtle Action (e.g., "Hủy", "Xem mẫu"):**
  - Background: Transparent.
  - Text: `var(--ink-secondary)`, hovers to `var(--ink-primary)`.

---

### 2.2 Form Fields & Textareas (`<Input>`, `<Textarea>`)
Designed specifically for writers and brand owners entering extensive text:

- **Surface:** `var(--surface-subdued)`.
- **Border:** `1px solid var(--border-hairline)` default; `1px solid var(--brand)` on `:focus-visible`.
- **Focus Ring:** Clean 2px offset halo (`rgba(42, 75, 245, 0.25)`), zero blurry neon spread.
- **Typography:** `font-size: 15px`, `line-height: 1.65`, clear placeholder in `var(--ink-tertiary)`.
- **Textarea Behavior:** `min-height: 140px`, auto-expands vertically with content volume.

---

### 2.3 Angle Segmented Selector (`<AngleTabs>`)
Replaces clunky buttons with a tactile segmented switch:

- **Structure:** Pill/box track containing 3 segments: `[01. PAS: Vấn đề & Giải pháp]`, `[02. AIDA: Cảm xúc & Phong cách]`, `[03. FAB: Tính năng & Giá trị]`.
- **Active Indicator:** Sliding physical indicator pill with subtle drop shadow (`box-shadow: 0 1px 4px rgba(0,0,0,0.12)`).
- **Keyboard Navigation:** Arrow keys (`Left` / `Right`) or numeric shortcuts (`1`, `2`, `3`) switch active angle instantaneously.

---

### 2.4 Modals & Drawers (`<Dialog>`, `<Drawer>`)
Accessible, keyboard-trapped overlay primitives:

- **Backdrop:** `rgba(0, 0, 0, 0.65)` in dark mode; `rgba(26, 26, 24, 0.45)` in light mode with `backdrop-filter: blur(8px)`.
- **Container:** Rounded `14px`, 1px hairline border, entry animation `fade-in-up 200ms var(--ease-spring)`.
- **Focus Management:** Focus is trapped inside the dialog; pressing `Escape` closes the overlay and returns focus to the trigger.

---

### 2.5 Toast Notifications (`<Toast>`)
- Replaces generic alert boxes with a sleek, bottom-center pill:
- Dimensions: Height `38px`, horizontal padding `14px`, font size `13px`.
- Auto-dismisses in 3 seconds; displays micro-spring checkmark icon for copy events.

---

## 3. Motion System & Easing Curves

```css
/* Spring physics for tactile clicks and tab transitions */
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);

/* Smooth deceleration for modals and drawers */
--ease-out:    cubic-bezier(0.25, 1, 0.5, 1);

/* Microinteraction durations */
--duration-instant:  80ms;   /* Button press, hover highlight */
--duration-fast:     160ms;  /* Tab switch, copy confirmation */
--duration-normal:   240ms;  /* Modal open, drawer slide */
--duration-reveal:   320ms;  /* Section entry, draft text reveal */
```

### Accessibility Guard (Reduced Motion)
When `prefers-reduced-motion: reduce` is detected:
- All transitions drop to `0ms`.
- Animated shimmers and continuous tickers freeze in their final static state.

