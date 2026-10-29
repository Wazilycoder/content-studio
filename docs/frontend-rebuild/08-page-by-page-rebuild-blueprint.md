# 08 — PAGE-BY-PAGE REBUILD BLUEPRINT

**Scope:** Blueprint for every user-facing route and flagship interface in Content Studio.

---

## 1. Flagship Experience A: Landing Page (`/` — `src/app/page.tsx`)

### 1.1 Strategic Purpose & Target User
- **Purpose:** Transform cold Vietnamese e-commerce sellers, marketing teams, and agency copywriters into active users by visually proving how Content Studio converts a raw product idea into 3 production-ready ad angles.
- **Reference Inspiration:** Linear (discipline & speed) + Framer (storytelling & comparison clarity).

### 1.2 Layout & Section Composition
1. **Header / Navigation (`LandingNav`):**
   - Slim 56px height, sticky with `backdrop-filter: blur(16px)`.
   - Left: Wordmark "Content Studio" in 550 weight with a subtle studio dot.
   - Center: Minimalist links: `Phương pháp 3 Góc`, `Tính năng`, `Bảng giá`, `Hướng dẫn`.
   - Right: "Đăng nhập" text button + Primary tactile CTA "Bắt đầu miễn phí".
2. **Hero Transformation Canvas (`HeroSection`):**
   - Headline: *"Biến một ý tưởng thô thành 3 góc bài viết bán hàng đỉnh cao trong 5 giây."*
   - Sub-headline: *"Không còn bế tắc ý tưởng. Tạo tức thì góc Vấn đề (PAS), góc Cảm xúc (AIDA) và góc Tính năng (FAB) chuẩn xác tâm lý người mua Việt."*
   - **The Transformation Stage:**
     - Left Column (40% width): **"Bản tóm tắt đầu vào (Brief)"** — An authentic Vietnamese product brief (e.g., Áo sơ mi lụa Bảo Lộc, 100% kén tơ tằm thủ công, tone Trang trọng).
     - Right Column (60% width): **"3 Bản thảo chuyển hóa"** — Segmented control `[01. PAS]` / `[02. AIDA]` / `[03. FAB]`. Clicking switches the headline, body copy, and hashtags with smooth editorial typography.
3. **The 3-Angles Framework (`ThreeAnglesFramework`):**
   - Structured visual breakdown explaining why single-angle ads fail and how testing PAS vs AIDA vs FAB triples ROAS.
4. **Feature Comparison & Evidence (`FeatureGrid`):**
   - No generic bento grids. Real comparison matrix: Generic Chatbots (generic paragraphs, hallucinations) vs. Content Studio (structured angles, Facebook/Instagram character limit compliance, instant 1-click export).
5. **Transparent Pricing (`PricingSection`):**
   - 3 clean tiers: Dùng thử (Miễn phí 10 bài), Chuyên nghiệp (199k/tháng - 300 bài), Doanh nghiệp (499k/tháng - Không giới hạn).
   - Clear credit accounting breakdown.
6. **FAQ Accordion & Footer (`FaqSection`, `LandingFooter`):**
   - Clean, keyboard-navigable native disclosure items addressing common merchant doubts.

### 1.3 Desktop vs. Mobile Behavior
- **Desktop (1024px – 1920px):** Balanced side-by-side split screen for the transformation stage; sticky nav.
- **Mobile (360px – 430px):** Brief card and transformed copy are tabbed: `[Xem Đầu vào] ↔ [Xem 3 Góc bài viết]`. Sticky bottom CTA "Dùng thử ngay".

---

## 2. Flagship Experience B: Workspace Studio (`/workspace` — `src/app/workspace/page.tsx`)

### 2.1 Strategic Purpose & Target User
- **Purpose:** A fast, calm, professional content production studio where copywriters write briefs, generate multi-angle copy, edit inline, and export to social platforms in seconds.
- **Reference Inspiration:** Linear (keyboard velocity) + Cursor (calm writing canvas) + Raycast (tactility).

### 2.2 Reconstructed Component Architecture
The 1,375-line monolith is completely dismantled into modular, decoupled units:

```
src/components/workspace/
├── WorkspaceProvider.tsx      # Central state: form, active draft, history, credits
├── StudioHeader.tsx           # Breadcrumb, project title, credit meter, account menu
├── BriefPanel.tsx             # Left pane (380px): Product name, description, audience, tone
├── DraftCanvas.tsx            # Center pane (flex-1): Angle tabs (PAS/AIDA/FAB), inline editor
│   ├── AngleTabBar.tsx        # Segmented switch with keyboard shortcuts [1, 2, 3]
│   ├── HeadlineStrip.tsx      # 3 high-converting hook options with 1-click select
│   ├── CaptionEditor.tsx      # Auto-expanding editorial textarea with live character limits
│   └── HashtagCloud.tsx       # 5 curated hashtags with single and bulk-copy
├── PreviewDrawer.tsx          # Right slide-over: Pixel-accurate Facebook & Instagram previews
└── HistoryTimeline.tsx        # Drawer/collapsible panel: Past generations, search, filter
```

### 2.3 Interactive States & Precision Workflows
- **Drafting & Inline Editing:** Every generated caption is editable immediately in-place. Changes are held in client state and auto-saved to history.
- **Live Character Limits:** Subdued indicator: `680 / 1.000 ký tự (Tối ưu cho Facebook Feed)`. Flips to amber at 900+ and red if overflowing platform guidelines.
- **Instant Export Actions:**
  - `Sao chép toàn bộ (Hook + Body + Hashtags)` with visual check-pop confirmation.
  - `Xem trước bài đăng` opens the slide-over preview.

---

## 3. Authentication Routes (`/login`, `/register`)

### 3.1 Purpose & Target User
- Fast, secure sign-in and sign-up for returning merchants and newly converted visitors.
- **Reference Inspiration:** Clerk / Supabase.

### 3.2 Layout & Key Elements
- **Layout:** Centered single-column card on warm canvas base with hairline border.
- **Elements:**
  - Studio wordmark at the top.
  - Email & Password fields with clean focus states and show/hide password toggle.
  - Mathematical human verification captcha (server-validated via HMAC).
  - Clear error alerts with human-readable Vietnamese copy (e.g., *"Mật khẩu hoặc email chưa chính xác"*).
  - One-click link between login and registration.

---

## 4. Supporting & Legal Routes (`/guide`, `/privacy`, `/terms`, `/refund`)

### 4.1 Layout & Content Standards
- **Layout:** Elegant single-column reading document (max-width `760px`), centered, generous leading (`1.72`).
- **Elements:** Sticky back navigation to `/workspace` or `/`, structured table of contents, and clearly defined clauses with date of last revision.

---

## 5. Acceptance Criteria Checklist

- [ ] Zero presence of `BorderBeam`, `Particles`, `Tilt`, or 3D KeyCard pseudo-sheen.
- [ ] Landing page loads with zero jank, 0 layout shifts (CLS < 0.01), and fully responsive down to 360px.
- [ ] Workspace brief inputs support multiline Vietnamese text with zero diacritical mark clipping.
- [ ] Keyboard navigation: `Ctrl+Enter` triggers generation; `1, 2, 3` switches angles.
- [ ] All API contracts (`/api/generate`), Supabase auth flows, and credit deduction rules preserved 100%.

