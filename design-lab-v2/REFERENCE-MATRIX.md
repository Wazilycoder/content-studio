# CONTENT STUDIO — REFERENCE MATRIX & DESIGN SYSTEM TOKENS

## 1. BẢNG MÃ MÀU CHUẨN (BASALT OLED PALETTE)
```css
/* Backgrounds */
--bg-void: #050608;          /* OLED pitch black */
--bg-base: #08090C;          /* Main canvas background */
--bg-chassis: #0E1017;       /* Outer chassis for cards/containers */
--bg-surface: #12141C;       /* Inner recessed panel */
--bg-surface-elevated: #181B26; /* Hover & dropdowns */

/* Borders & Glows */
--hairline: rgba(255, 255, 255, 0.07);
--hairline-hover: rgba(255, 255, 255, 0.14);
--hairline-highlight: inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
--hairline-active: rgba(0, 212, 146, 0.4);

/* Accents */
--accent-mint: #00D492;      /* Primary electric mint (Linear/Raycast tier) */
--accent-mint-glow: rgba(0, 212, 146, 0.15);
--accent-cobalt: #2563EB;    /* Secondary technical blue */
--accent-rose: #F43F5E;      /* Warning / PAS pain point */
--accent-amber: #F59E0B;     /* Pro tier / Credit warning */

/* Inks & Typography */
--text-primary: #F8FAFC;    /* Crisp heading */
--text-secondary: #94A3B8;  /* Readable body */
--text-tertiary: #64748B;   /* Monospace labels & placeholders */
```

## 2. QUY CHUẨN ĐỘNG HỌC (MOTION CHOREOGRAPHY)
- **Active Button Feedback:** `transition: transform 140ms cubic-bezier(0.16, 1, 0.3, 1);` -> `transform: scale(0.98);`
- **Modal & Popover Entrance:** Bắt đầu từ `scale(0.95)` và `opacity: 0` (Tuyệt đối không bắt đầu từ `scale(0)`).
- **Tab Switching:** Dùng Sliding Pill Indicator chuyển vị trí X mượt mà trong 240ms với curve `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Angle Switching:** Hiệu ứng fade-blur nhẹ (`filter: blur(2px)` chuyển về `blur(0)` trong 180ms) để che chuyển giao văn bản không bị giật mắt.

## 3. TYPOGRAPHY MATRIX
- **Display & Heading:** `Plus Jakarta Sans`, font-weight 700-800, `letter-spacing: -0.025em`.
- **Editorial Body:** `Be Vietnam Pro` hoặc `Plus Jakarta Sans`, line-height 1.6, `letter-spacing: -0.01em`.
- **Technical Telemetry:** `JetBrains Mono` / `Geist Mono`, `font-variant-numeric: tabular-nums`, `letter-spacing: -0.01em`.

