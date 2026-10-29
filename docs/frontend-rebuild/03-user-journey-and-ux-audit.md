# 03 — USER JOURNEY & EDGE-STATE UX AUDIT

**Project:** Content Studio  
**Methodology:** Comprehensive end-to-end journey mapping across 12 distinct persona states and extreme edge cases.

---

## 1. End-to-End Persona Journey Mapping

```
[Visitor: Discovers Landing Page]
       │
       ▼
[Interactive Proof: Sees Brief → 3 Angles Transformation]
       │
       ├─────────────────────────────────┐
       ▼ (Direct Try)                    ▼ (Click "Bắt đầu ngay")
[Guest Workspace (1 Free Generation)]  [Register / Login Page]
       │                                 │
       ▼                                 ▼
[Input Brief & Select Tone]            [Authenticated User Workspace]
       │                                 │
       ▼ (Hits "Tạo bài viết")           ▼ (Hits "Tạo bài viết")
[Server Deducts Guest Credit]          [Server Deducts Account Credit]
       │                                 │
       ▼                                 ▼
[Generation State: 3-8s Latency]       [Generation State: 3-8s Latency]
       │                                 │
       ▼                                 ▼
[Draft Canvas: Review PAS/AIDA/FAB]    [Draft Canvas: Review PAS/AIDA/FAB]
       │                                 │
       ▼ (Tries to Copy/Save)            ▼ (Inline Edit & Copy)
[Triggers Auth Modal to Persist]       [Auto-saved to Generation History]
```

---

## 2. Forensic Audit of 12 Critical User States

### 2.1 First-time Visitors (Cold Traffic)
- **Current Defect:** The visitor lands on a screen crowded with glowing cards, spinning border beams, and moving particle swarms. The core value proposition—*"How does Content Studio turn my rough product description into 3 high-converting Vietnamese ad angles?"*—is buried under visual gimmicks.
- **New Standard:** A clean, calm, high-contrast hero section. The primary visual is an editorial split: on the left, a realistic Vietnamese merchant brief; on the right, an interactive preview of PAS, AIDA, and FAB angles with zero visual noise.

### 2.2 New Users (Zero Experience)
- **Current Defect:** On first arrival at `/workspace`, the user faces an empty form and disabled results panels without contextual guidance on how to write an effective brief.
- **New Standard:** Intelligent empty state with 1-click curated starter templates (e.g., "Thời trang lụa cao cấp", "Mỹ phẩm thiên nhiên", "Khóa học trực tuyến") that populate the brief instantly to demonstrate capability.

### 2.3 Returning Users (Power Creators)
- **Current Defect:** History is hidden behind a slide-over drawer (`HistoryDrawer.tsx`). Reloading the page resets the active workspace.
- **New Standard:** Persistent active session. Recent generations are accessible via a keyboard shortcut (`Cmd+K` or `Ctrl+H`) or a sleek collapsible timeline, allowing instantaneous re-use of past successful angles.

### 2.4 Mobile Users (360px – 430px Viewports)
- **Current Defect:** The workspace collapses into a vertical scroll nightmare exceeding 3,000 vertical pixels. Users must scroll down past the entire input form to see the generated results, then scroll back up to tweak tone, and scroll down again.
- **New Standard:** Mobile-first segmented tabs: `[1. Bản tóm tắt (Brief)]` ↔ `[2. Bản thảo (Drafts)]` ↔ `[3. Xem trước (Preview)]`. A persistent bottom action bar houses generation triggers, angle switching, and 1-tap copy.

### 2.5 Slow Network & High Latency Connections (3G / Unstable Wi-Fi)
- **Current Defect:** Displays a generic spinning loader icon (`Loader2`) that freezes or gives no indication of multi-step AI progress.
- **New Standard:** Progressive editorial loading feedback:
  - Phase 1 (0–1.5s): *"Đang phân tích tâm lý khách hàng mục tiêu..."*
  - Phase 2 (1.5–4s): *"Đang cấu trúc 3 góc tiếp cận (PAS, AIDA, FAB)..."*
  - Phase 3 (4–6s): *"Đang hoàn thiện tiêu đề và thẻ hashtags..."*
  Accompanied by calm, non-jittery shimmer typography.

### 2.6 Failed Generation Requests (500 / LLM Timeout)
- **Current Defect:** Displays an abrupt red toast error (`setToast("Lỗi khi tạo nội dung")`). Input fields can be locked in a disabled state, requiring a manual page refresh that wipes out the user's brief!
- **New Standard:** Non-destructive error recovery. Form inputs remain 100% intact and editable. A contextual banner explains the issue (e.g., *"Hệ thống AI đang quá tải, vui lòng thử lại sau 5 giây"*) with an immediate "Thử lại ngay" (Retry) button.

### 2.7 Expired Sessions & Unauthorized Errors
- **Current Defect:** If a Supabase JWT expires during generation, the application throws an unhandled rejection, or prompts an abrupt redirect to `/login`, losing unsaved work.
- **New Standard:** Seamless session renewal via background refresh. If authentication fails, an inline non-modal prompt preserves the current generated draft in local storage and re-attaches it upon sign-in.

### 2.8 Insufficient Credits (Out of Credits)
- **Current Defect:** Pops up a harsh `OutOfCreditsModal` that blocks the screen without clearly presenting upgrade options or remaining free trial resets.
- **New Standard:** An elegant, supportive modal highlighting the merchant's ROI: *"Bạn đã tạo thành công 10 bài viết xuất sắc. Nâng cấp gói Pro để tiếp tục sáng tạo không giới hạn"* with a 1-click plan selector.

### 2.9 Long Vietnamese Text & Typographic Overflow
- **Current Defect:** When product descriptions or generated captions reach 800–1,000 words, card containers experience clipping or nested scrollbars. Diacritical tone marks (dấu hỏi, ngã, nặng) collide with preceding line ascenders.
- **New Standard:** Fluid editorial typography with `line-height: 1.72`, generous paragraph spacing, and an expanding reading canvas that guarantees zero text clipping.

### 2.10 Empty History State
- **Current Defect:** Shows a stark "Chưa có lịch sử tạo bài viết" text inside a blank drawer.
- **New Standard:** A beautifully designed empty state with quick-start action cards, tips on archiving favorite angles, and an illustration of how history helps track ad campaign performance.

### 2.11 Keyboard-Only Users (Power Navigation)
- **Current Defect:** Tabbing skips around due to custom `div` buttons; no visible focus rings or keyboard shortcuts.
- **New Standard:** Full keyboard navigation:
  - `Tab` / `Shift+Tab`: Logical focus order with high-contrast 2px focus rings.
  - `Ctrl + Enter` / `Cmd + Enter`: Generate content.
  - `1`, `2`, `3`: Switch between PAS, AIDA, and FAB angles.
  - `Ctrl + Shift + C`: Copy active angle to clipboard.

### 2.12 Reduced-Motion Users
- **Current Defect:** Tilted cards and continuous marquee loops continue running or freeze abruptly in strange visual states.
- **New Standard:** Strict respect for `prefers-reduced-motion: reduce`. All transitions snap cleanly to zero-duration opacity changes; continuous animations are completely disabled.

