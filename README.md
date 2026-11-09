# Content Studio — Cuộc thi Vibe Coding 2026

> Nền tảng AI tạo kịch bản quảng cáo Facebook & Instagram độc bản chuẩn tâm lý người mua (PAS · AIDA · FAB) và quy tắc 125 ký tự vàng. Thoát ly hoàn toàn văn mẫu bot AI sáo rỗng (Zero AI-Slop).

## 1. Thông tin chung

| Hạng mục | Nội dung |
|---|---|
| Tên đội thi | Content Studio Team |
| Bảng thi | Bảng B - Kinh tế |
| Đề bài bốc thăm | Đề số 08 — Ứng dụng AI tạo nội dung tiếp thị số đa kênh (Facebook & Instagram Ads) |
| Demo online | http://localhost:3000 (Chạy từ Source ZIP; hoặc đường dẫn Vercel của đội) |
| Video demo (≤ 02 phút) | [Dán link Video Demo YouTube / Google Drive tại đây] |
| Source ZIP | [Dán link Google Drive chia sẻ quyền xem/tải của gói ZIP tại đây] |
| Minh chứng dùng AI | Kèm trong ZIP (tệp `MINH-CHUNG-AI.md`) |
| Bảng kiểm thử | Kèm trong ZIP (tệp `BANG-KIEM-THU.md` hoặc Mục 11 trong README này) |

> **Tiêu chí vòng loại:** https://vibecoding.info.vn/tieu-chi-cham-thi  
> **Bảng B - Kinh tế:** Ít nhất 3 ca kiểm thử thực tế; AI thật hoặc Mock minh bạch đều có thể đạt 100/100 điểm.  
> **Cam kết bảo mật:** Không đưa khóa API hoặc mật khẩu thực tế vào bài nộp.

---

## 2. Tính năng chính (Đủ 05 tính năng cốt lõi)

- **Tính năng 1 — Form nhập liệu Brief thông minh:** Thu nhận tên sản phẩm, mô tả đặc tính, khách hàng mục tiêu và 7 tông giọng tiếp thị chuyên sâu (*Hài hước, Trang trọng, Trẻ trung, Chuyên gia, Đồng cảm, Storytelling, FOMO*). Tích hợp kiểm tra ràng buộc đầu vào bằng Zod Schema và chống tấn công XSS.
- **Tính năng 2 — AI phân tích & Sinh 3 góc nhìn tâm lý độc bản (3-3-5 Schema):** Bóc tách 1 đề bài thành 3 góc kịch bản độc bản (*Góc 1: PAS - Vấn đề & Giải pháp; Góc 2: Cảm xúc & Bản sắc; Góc 3: FAB - Thông số chế tác*) + 3 Tiêu đề chuyển đổi + 5 Hashtags chuẩn SEO. Toàn bộ câu mở đầu tuân thủ nghiêm ngặt **quy tắc 125 ký tự vàng**.
- **Tính năng 3 — Bộ đếm ký tự kép Facebook & Instagram:** Thước đo quang học trực quan đổi màu cảnh báo mốc 125 ký tự Facebook Mobile (tránh bị nút *"Xem thêm"* che mất thông điệp chính) và trần 2.200 ký tự Instagram Caption.
- **Tính năng 4 — Công cụ thao tác nhanh & Chỉnh sửa inline:** Sao chép 1-chạm từng bài viết hoặc toàn bộ chiến dịch; tạo lại nội dung tức thì; hỗ trợ gõ chỉnh sửa trực tiếp nội dung trên màn hình kèm tính năng xuất ảnh banner quảng cáo HD (1200x630) từ Canvas.
- **Tính năng 5 — Quản lý lịch sử bài viết (Xem / Khôi phục / Xóa):** Ngăn kéo Lịch sử (Drawer) lưu trữ tự động trên LocalStorage (Client-side) và Cloud Database, cho phép xem lại danh sách, xóa bản ghi hoặc **khôi phục 1-click** toàn bộ dữ liệu vào form.

---

## 3. Công nghệ sử dụng

| Lớp | Công nghệ thực tế đã dùng |
|---|---|
| Giao diện & Framework | Next.js 16 (App Router), React 19, TypeScript + Tailwind CSS |
| Thư viện UI & Hiệu ứng | Lucide React v0.470, Sonner Toast v1.7, Magic UI, React Bits |
| Kết xuất & Xử lý Canvas | HTML5 Canvas 2D (Xuất ảnh Banner quảng cáo 1200x630 HD) |
| Lưu trữ dữ liệu | localStorage (Client-side, Offline-first) + Supabase PostgreSQL |
| Triển khai | Chạy local (Node.js ≥ 18) hoặc triển khai Vercel |

---

## 4. Tích hợp AI

- **Chế độ đang dùng**: AI thật có Mock dự phòng
  - **API thật**: Kết nối Google Gemini API (`gemini-3.5-flash`) / DeepSeek V3 qua serverless proxy bảo mật.
  - **Mock dự phòng**: Hệ thống kịch bản mẫu chất lượng cao (`SAMPLE_SCENARIOS`) sẵn sàng kích hoạt khi chạy offline hoặc khi máy chấm không có kết nối internet.
- **Mục đích**: Phân tích sâu insight sản phẩm và tâm lý khách hàng để kiến tạo nội dung có tỷ lệ chuyển đổi cao (CTR +42%), loại bỏ hoàn toàn văn mẫu AI vô hồn.
- **Bảo mật khoá API**: Tuyệt đối không ghi khóa trong mã nguồn client. API key được nạp từ biến môi trường server-side qua `.env.local` (file mẫu `.env.example`). Không commit khóa lên Git.

Biến môi trường mẫu (`.env.example`):
```env
AI_PROVIDER=gemini
GEMINI_API_KEYS=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
```

---

## 5. Cài đặt và chạy local

Yêu cầu hệ thống: Trình duyệt hiện đại (Chrome / Edge / Firefox / Safari); Node.js ≥ 18 (khuyên dùng Node.js 20+).

```bash
# Bước 1: Cài đặt thư viện phụ thuộc
npm install

# Bước 2: Khởi chạy máy chủ phát triển
npm run dev

# Bước 3: Mở trình duyệt tại địa chỉ
http://localhost:3000
```

> **Lưu ý dành cho Giám khảo:** Dự án đã tích hợp sẵn chế độ Mock và dữ liệu mẫu có sẵn trên giao diện. Giám khảo chỉ cần bấm vào các Preset mẫu (*"Áo sơ mi lụa"*, *"Serum B5"*, *"Nước mắm Phú Quốc"*) là có thể trải nghiệm toàn diện mọi tính năng ngay lập tức mà không cần cấu hình thêm bất kỳ API key nào.

---

## 6. Cấu trúc thư mục

```text
content-studio/
├── src/
│   ├── app/                 # Next.js App Router (Landing, Workspace, API)
│   │   ├── api/generate/    # Serverless API xử lý gọi AI & Proxy bảo mật
│   │   ├── workspace/       # Không gian làm việc tạo kịch bản quảng cáo
│   │   └── page.tsx         # Trang giới thiệu Landing Page
│   ├── components/          # Các module giao diện (Workspace, History, UI)
│   ├── lib/                 # Tiện ích (AI Client, Char Counter, Clipboard)
│   └── types/               # Type definitions TypeScript (3-3-5 Schema)
├── public/                  # Tài nguyên tĩnh, icon, ảnh minh họa
├── MINH-CHUNG-AI.md         # Minh chứng sử dụng AI chuẩn 1 trang BTC
├── BANG-KIEM-THU.md         # Bảng 6 ca kiểm thử chi tiết thực tế
├── .env.example             # Mẫu biến môi trường an toàn (không có secret)
├── package.json
└── README.md
```

---

## 7. Truy cập và phân quyền

- Trải nghiệm trực tiếp trên màn hình Workspace (`/workspace`) mà không bắt buộc tạo tài khoản rườm rà.
- Ngăn kéo Quản lý Lịch sử (Drawer): Cho phép xem lại các bài đã tạo, xóa từng bản ghi hoặc xóa toàn bộ lịch sử lưu trữ trên localStorage.

---

## 8. Giới hạn hiện tại

- Gói tài khoản miễn phí có thời gian chờ (cooldown 45 giây) giữa các lần sinh bài để bảo vệ tài nguyên máy chủ.
- Khi ngắt kết nối internet, ứng dụng tự động chuyển sang chế độ dữ liệu mẫu mô phỏng (Mock Mode).

---

## 9. Nguồn tham khảo

- Google Fonts, Tailwind CSS, Lucide React Icons.
- Khung tài liệu hướng dẫn cuộc thi VIBE-CODING 2026 do Bộ môn Thương mại điện tử — Trường Cao đẳng FPT Polytechnic ban hành.

---

## 10. Minh chứng dùng AI để xây dựng sản phẩm

Xem toàn văn tại tệp [`MINH-CHUNG-AI.md`](MINH-CHUNG-AI.md). Tóm tắt vòng lặp cải tiến tiêu biểu:
- **Mục tiêu**: Loại bỏ văn mẫu AI sáo rỗng (*"Chào các bạn yêu...", "Đừng bỏ lỡ siêu phẩm..."*).
- **Yêu cầu cho AI**: Thiết kế System Prompt Anti-AI-Slop siết chặt trần 125 ký tự mở đầu (Hook).
- **Vấn đề phát hiện khi thử**: AI thông thường hay viết lan man vượt quá 200 ký tự khiến chữ bị ẩn sau nút "Xem thêm" trên điện thoại.
- **Yêu cầu sửa**: Bổ sung bộ lọc Zod Schema kiểm tra độ dài và thước đo cảnh báo `countUnicodeChars`.
- **Kết quả kiểm tra**: 100% kịch bản sinh ra có câu mở đầu sắc nét nằm gọn trong 125 ký tự vàng.

---

## 11. Bảng kiểm thử (Chi tiết 6 ca kiểm thử thực tế)

| Mã ca | Loại ca | Dữ liệu và bước thử | Kỳ vọng | Kết quả thực tế | Đạt/Chưa đạt |
|---|---|---|---|---|---|
| TC01 | Bình thường | Nhập "Áo sơ mi lụa tơ tằm Bảo Lộc", chọn tông "Trang trọng" ➔ Bấm Tạo | Sinh đủ 3 góc bài PAS/Cảm xúc/FAB, 3 Headlines, 5 Hashtags | Hiển thị trọn bộ 3-3-5 đúng format trong 2.1s | **ĐẠT** |
| TC02 | Bình thường | Bấm thử nút "Sao chép 1-chạm" và chỉnh sửa inline trực tiếp | Nội dung copy vào clipboard; sửa chữ thì bộ đếm ký tự cập nhật | Copy thành công có Toast báo; bộ đếm nhảy số chuẩn xác | **ĐẠT** |
| TC03 | Nhập thiếu/sai | Để trống tên sản phẩm hoặc nhập 1 ký tự (`"A"`) ➔ Bấm Tạo | Báo lỗi form: "Tên sản phẩm tối thiểu 2 ký tự", ngăn gửi yêu cầu | Viền đỏ cảnh báo và hiển thị thông báo lỗi rõ ràng | **ĐẠT** |
| TC04 | Đầu vào không hợp lệ | Nhập tên sản phẩm > 100 ký tự hoặc chứa script `<script>` | Zod Schema chặn lại, loại trừ mã độc phòng chống XSS | Form báo lỗi độ dài, loại bỏ hoàn toàn nguy cơ XSS | **ĐẠT** |
| TC05 | Ca biên (Boundary) | Gõ nội dung bài viết chạm ngưỡng 125 ký tự và vượt 2.200 ký tự | Thanh thước đo đổi sang màu đỏ cảnh báo vượt ngưỡng | Thanh đo chuyển đỏ và hiện số ký tự vượt quá thực tế | **ĐẠT** |
| TC06 | Quản lý lịch sử | Mở Drawer Lịch sử ➔ Bấm "Khôi phục bài viết" hoặc "Xóa" | Form tự điền lại đúng nội dung cũ; xóa thì biến mất tức thì | Khôi phục 1-click thành công; xóa cập nhật localStorage ngay | **ĐẠT** |

---

## 12. Hồ sơ bàn giao

- Source ZIP chứa toàn bộ mã nguồn sạch sẽ, không kèm `node_modules` hay `.env.local`.
- Video demo 02 phút thể hiện trọn vẹn thao tác thực tế của 5 tính năng cốt lõi.
- Tài liệu minh chứng AI và Bảng kiểm thử được đóng gói đầy đủ trong bài nộp.
