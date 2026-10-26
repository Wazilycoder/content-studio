# 💎 Content Studio — Nền Tảng Sáng Tạo Nội Dung Quảng Cáo Chuyển Đổi Cao
> **Giải pháp kiến tạo nội dung quảng cáo Facebook & Instagram độc bản chuẩn AIDA & PAS cho người bán hàng online tại Việt Nam. Thoát ly hoàn toàn văn mẫu AI sáo rỗng (Zero AI-Slop).**

---

## 🎯 1. BÀI TOÁN & GIÁ TRỊ THỰC TIỄN (USE CASE & USER PERSONA)

### 📌 Chân dung người dùng mục tiêu
- Các chủ shop online kinh doanh đa ngành (Thời trang, Mỹ phẩm, F&B, Mẹ & Bé, Gia dụng, Công nghệ).
- Các nhà bán hàng cá nhân hoặc doanh nghiệp nhỏ chưa có ngân sách thuê phòng marketing hay copywriter chuyên nghiệp (5–10 triệu VNĐ/tháng).

### ⚡ Nỗi đau thực tế (Pain Points)
1. **Cạn kiệt ý tưởng & Văn phong rập khuôn:** Tự viết bài thì lủng củng; dùng ChatGPT miễn phí thì bị dính "văn mẫu bot AI" (*"Bạn đang tìm kiếm..."*, *"Đừng bỏ lỡ siêu phẩm..."*), khách lướt qua ngay, lãng phí chi phí chạy quảng cáo Facebook Ads.
2. **Bị cắt cụt thông điệp quan trọng:** Không nắm được quy tắc **125 ký tự vàng** của Facebook Mobile, khiến nội dung hay nhất bị ẩn sau nút *"Xem thêm"*.
3. **Thiếu đa dạng góc nhìn tâm lý:** Chỉ chăm chăm kể tính năng sản phẩm mà quên đánh vào nỗi đau thực tế (PAS) hoặc cảm xúc tự hào của khách hàng.

### 💡 Tình huống thực tế (Real-World Scenario)
> **Ví dụ:** Chị Lan — Chủ shop thời trang thiết kế công sở.  
> Chị nhập thông tin sản phẩm: *"Áo sơ mi lụa tơ tằm Bảo Lộc, thêu tay thủ công, dáng suông giấu bụng, tệp khách nữ công sở 28–45 tuổi, tông giọng trang trọng"*.  
> **Chỉ trong 3 giây**, Content Studio xuất ra:
> - **Góc 1 (PAS - Vấn đề & Giải pháp):** Đánh thẳng vào nỗi e ngại áo lụa bị nhăn nhúm, bí bách khi ngồi văn phòng cả ngày ➔ Giải pháp từ chất lụa Bảo Lộc dệt tự nhiên, thoáng mát, giữ nếp phẳng phiu.
> - **Góc 2 (Cảm xúc & Bản sắc):** Khắc họa thần thái tự tin, sang trọng và khí chất của người phụ nữ thành đạt khi bước vào phòng họp.
> - **Góc 3 (FAB - Tính năng & Giá trị):** Phân tích kỹ thuật mật độ sợi dệt, đường thêu tay tỉ mỉ, độ bền giặt ➔ Chứng minh sản phẩm xứng đáng từng đồng chi ra.
> - **3 Headlines giật tít:** Tò mò, Lợi ích trực diện, Khẳng định uy tín.
> - **5 Hashtags chuẩn SEO:** Tối ưu tiếp cận tự nhiên trên mạng xã hội.

---

## 🚀 2. TÍNH NĂNG CỐT LÕI (5 TÍNH NĂNG CHÍNH + TÍNH NĂNG MỞ RỘNG)

### ✅ 5 Tính Năng Chính Hoàn Thiện Đầu-Cuối:
1. **Form Nhập Liệu Thông Minh:**
   - Thu nhận tên sản phẩm, mô tả ngắn, khách hàng mục tiêu và 7 tông giọng tiếp thị chuyên sâu (*Hài hước, Sang trọng, Trẻ trung, Đồng cảm, Chuyên gia, Kể chuyện, Kích thích FOMO*).
   - Kiểm tra ràng buộc hợp lệ đầu vào (Input validation) với Zod Schema và phòng chống tấn công XSS / Buffer Overflow.
2. **AI Sinh Bộ Nội Dung Độc Bản (3-3-5 Schema):**
   - Sinh chính xác **03 Captions** (theo 3 góc nhìn tâm lý PAS, Cảm xúc, FAB) + **03 Headlines** + **05 Hashtags**.
   - Tích hợp quy tắc 125 ký tự vàng mở đầu (Hook) tối ưu chuyển đổi click nút *"Xem thêm"*.
3. **Công Cụ Thao Tác Nhanh (Copy & Tạo Lại):**
   - Nút **Sao chép 1-chạm** cho từng caption, từng headline, trọn bộ hashtags hoặc toàn bộ chiến dịch.
   - Nút **Tạo lại** (`RefreshCw`) để sinh bộ ý tưởng mới tức thì.
   - Cho phép **Chỉnh sửa trực tiếp inline** từng bài viết trên giao diện.
4. **Lịch Sử Bài Viết Đa Tầng (LocalStorage + Supabase):**
   - Lưu trữ tự động ngoại tuyến và đồng bộ Cloud.
   - Ngăn kéo Lịch sử (Drawer): Xem lại, xóa từng mục hoặc **Khôi phục 1-click** toàn bộ dữ liệu vào form.
5. **Bộ Đếm Ký Tự Unicode & Thước Đo Cảnh Báo:**
   - Đo lường ký tự Unicode tiếng Việt chuẩn xác.
   - Thanh thước đo trực quan cảnh báo mốc 125 ký tự Facebook Mobile và trần 2.200 ký tự Instagram.

### 🌟 Tính Năng Mở Rộng Cao Cấp (Awwwards-Tier Polish):
- **Live Interactive Mockups:**
  - *Facebook Post Mockup:* Nút Like đổi màu nảy số, ngăn kéo bình luận khách hàng tương tác thực, hộp thoại chia sẻ.
  - *Instagram Feed Mockup (1:1):* Avatar viền Story gradient, tích xanh xác minh, Double-tap Like Heart pop-up, dải hashtag xanh đặc trưng.
- **Xuất Ảnh Banner Quảng Cáo:** Kết xuất ảnh bài đăng PNG (1200x630) trực tiếp từ HTML5 Canvas.
- **Live Typewriter Streaming:** Hiệu ứng chữ gõ thời gian thực mượt mà kèm con trỏ nhấp nháy phát quang, hỗ trợ bấm bỏ qua để đọc ngay.
- **Zero AI-Slop Design:** Thanh trừng 100% icon ngôi sao lấp lánh `Sparkles`, thay bằng bộ nhận diện thương hiệu `Layers3` và các icon ngữ cảnh kỹ thuật cao cấp (`Zap`, `Wand2`, `Crown`, `ShieldCheck`).

---

## 🛠️ 3. KIẾN TRÚC KỸ THUẬT & CÔNG NGHỆ (TECH STACK)

- **Frontend & Fullstack Framework:** Next.js 16 (App Router), React 19, TypeScript.
- **Styling & Motion:** Tailwind CSS, CSS Custom Properties, Vanilla CSS Animations, Touch Gestures.
- **Database & Auth:** Supabase PostgreSQL, Row-Level Security (RLS), Postgres RPC Atomic Transactions.
- **AI Engine & Routing:** OpenRouter API / Gemini API, DeepSeek V3, Claude 3.5 Sonnet, Gemini Flash.
- **Bảo mật & Rate Limiting:**
  - In-memory Sliding Window Rate Limiter (tối đa 5 lượt gọi/phút/user).
  - HMAC SHA-256 Math Captcha chống bot tự động.
  - Cơ chế Atomic Refund RPC: Tự động hoàn credit 100% nếu AI gặp sự cố gián đoạn mạng.

---

## 💻 4. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY (LOCAL SETUP)

### Yêu cầu hệ thống
- Node.js version 18.18 trở lên (khuyên dùng Node.js 20+).
- Trình quản lý gói: `npm` (hoặc `pnpm`, `yarn`, `bun`).

### Bước 1: Clone mã nguồn
```bash
git clone https://github.com/Wazilycoder/content-studio.git
cd content-studio
```

### Bước 2: Cài đặt thư viện phụ thuộc
```bash
npm install
```

### Bước 3: Cấu hình biến môi trường
Tạo file `.env.local` từ mẫu `.env.example`:
```bash
cp .env.example .env.local
```
*(Chế độ Local Dev đã tích hợp sẵn cơ chế Dev Session Bypass và Mock Fallback, cho phép chạy thử nghiệm đầy đủ ngay cả khi chưa gắn API Key ngoài).*

### Bước 4: Khởi chạy máy chủ phát triển
```bash
npm run dev
```
Mở trình duyệt tại: **`http://localhost:3000`**

### Bước 5: Chạy bộ kiểm thử tự động (Test Suite)
Dự án được bảo vệ bởi bộ kiểm thử tự động kiểm tra toàn diện Captcha, Dev Session Cookie, AI 3-3-5 Schema và Rate Limiter:
```bash
npm test
```
*Kết quả chuẩn: 11/11 tests pass.*

---

## 🎬 5. KỊCH BẢN DEMO ĐỀ XUẤT (3 PHÚT BÀN GIAO)

1. **Phút 1 — Giới thiệu Landing Page:**
   - Trải nghiệm Hero Section vừa vặn trọn vẹn 1 màn hình (`100dvh`).
   - Khám phá Trục rễ cây cuộn trang (Feature Root Tree Spine), Vòng quay đánh giá 3D Cylindrical Orbit và FAQ Knowledge Hub.
2. **Phút 2 — Thao tác trên Workspace:**
   - Vào Workspace (`/workspace`). Bấm thử một trong các sản phẩm gợi ý (hoặc tự nhập sản phẩm mới).
   - Chọn tông giọng (ví dụ: *Hài hước* hoặc *Sang trọng*) ➔ Bấm **"Tạo 3 góc bài viết"**.
   - Quan sát hiệu ứng **Typewriter Streaming** gõ từng chữ mượt mà kèm con trỏ nhấp nháy.
   - Thử nghiệm chỉnh sửa inline, quan sát thanh thước đo 125 ký tự co giãn theo thời gian thực.
3. **Phút 3 — Kiểm tra Mockup & Lịch sử:**
   - Chuyển sang Vùng 3: Thử nghiệm **Facebook Post** (Thả tim, mở ngăn kéo bình luận thử gõ phản hồi khách hàng, bấm tải banner PNG).
   - Bấm tab **Instagram Feed**: Chiêm ngưỡng tỉ lệ 1:1, thử Double-tap vào ảnh để nảy tim đỏ rực.
   - Mở Drawer **Lịch sử**: Thử nghiệm khôi phục 1-click hoặc xóa bản ghi.

---

## 📄 6. THÔNG TIN BÀN GIAO
- **Mã nguồn:** [https://github.com/Wazilycoder/content-studio](https://github.com/Wazilycoder/content-studio) (Private Repository).
- **Trạng thái:** Sạch 100% mã rác, 0 lỗi TypeScript (`npx tsc --noEmit` exit 0), 11/11 test cases pass.
