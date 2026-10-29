# 09 — RESPONSIVE & MOBILE STRATEGY

**Core Principle:** Mobile is not an afterthought or an auto-stacked desktop column. It is a first-class, touch-optimized copywriting companion designed independently for screens from 360px to 1920px.

---

## 1. Breakpoint Grid & Target Devices

| Breakpoint | Target Matrix | Layout Strategy |
| :--- | :--- | :--- |
| **360px** | Compact Android devices (Samsung Galaxy A-series) | Single column, tight 12px margins, collapsed pill navigation. |
| **390px** | Standard iOS devices (iPhone 13, 14, 15, 16) | Native bottom sheet drawers, 44px minimum tap targets. |
| **430px** | Large iOS Max & Flagship Android | Comfortable padding (16px), optimized virtual keyboard views. |
| **768px** | iPad & Android Tablets (Portrait) | 2-column split (Brief 45% + Drafts 55%), slide-over preview. |
| **1024px** | Small Laptops & Tablets (Landscape) | 3-column studio canvas begins (Brief 320px + Drafts flex + Preview 340px). |
| **1440px** | Standard Desktop (MacBook Pro, Desktop Monitors) | Optimal 3-column layout (Brief 380px + Drafts flex + Preview 380px). |
| **1920px** | Ultra-wide & 4K Displays | Max container clamped at 1720px; centered with generous margins. |

---

## 2. Mobile Workspace Architecture

### 2.1 The Mobile Tri-Segmented Controller
On mobile (<768px), attempting to view Brief, Drafts, and Social Preview simultaneously in one continuous vertical scroll creates cognitive overload and endless scrolling.
Instead, the mobile studio uses a **Segmented Studio Bar**:
```
┌──────────────────────────────────────────────┐
│ [1. Bản tóm tắt (Brief)] │ [2. Bản thảo] │ [3. Xem trước] │
└──────────────────────────────────────────────┘
```
- **State 1 (Brief):** The user writes or selects product parameters.
- **State 2 (Drafts):** Once generated, the view automatically shifts to Drafts. A persistent sub-bar allows instant 1-tap switching between `[PAS]`, `[AIDA]`, and `[FAB]`.
- **State 3 (Preview):** Slide-over or tab view showing how the copy looks in a real Facebook/Instagram feed.

### 2.2 Persistent Sticky Bottom Action Dock
At the bottom of the mobile viewport (respecting iOS Safe Area `env(safe-area-inset-bottom)`), a tactile dock provides:
- Left: Fast copy button (`Sao chép`).
- Center: Primary Generation Action (`Tạo lại` or `Tạo 3 góc`).
- Right: Quick angle switcher.

---

## 3. Virtual Keyboard & Touch Ergonomics

### 3.1 Virtual Keyboard Handling
- **Viewport Resize Avoidance:** Use `interactive-widget=resizes-content` in viewport meta tag so bottom docks do not awkwardly cover input fields when the virtual keyboard opens.
- **Auto-scroll to Active Input:** When focusing on "Mô tả sản phẩm" or "Khách hàng mục tiêu", the container smoothly scrolls the active input into the top third of the viewport.

### 3.2 Touch Target Precision (44px Rule)
- All interactive elements (angle tabs, copy buttons, tone chips, navigation toggles) maintain a minimum hit area of `44px x 44px`.
- Padding is applied internally to icons so the visual badge remains compact (e.g., 28px) while the tap target satisfies accessibility guidelines.

### 3.3 Safe Area Insets
All mobile fixed headers and bottom drawers strictly include:
```css
padding-top: max(12px, env(safe-area-inset-top));
padding-bottom: max(16px, env(safe-area-inset-bottom));
```

---

## 4. Hardware Performance on Modest Mobile Devices

To ensure 60fps performance on budget Android devices:
1. **Zero Canvas Particle Loops:** Eliminates the battery drain of canvas simulations.
2. **Zero Continuous 3D Perspective Rotations:** Eliminates GPU thrashing.
3. **Hardware Acceleration:** All sliding drawers and segmented tab indicators use `transform: translate3d(0,0,0)` and `will-change: transform`.
4. **Font Loading Optimization:** Preconnect Google Fonts / self-hosted variable font files with `font-display: swap` to prevent FOIT (Flash of Invisible Text).

