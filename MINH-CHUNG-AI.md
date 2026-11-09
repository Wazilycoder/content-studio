# MINH CHỨNG ỨNG DỤNG AI TRONG XÂY DỰNG SẢN PHẨM
**Cuộc thi:** VIBE-CODING 2026 — FPT Polytechnic (Bộ môn Thương mại điện tử)  
**Bảng thi:** Bảng B – Kinh tế  
**Sản phẩm:** Content Studio — Nền tảng AI tạo nội dung quảng cáo Facebook & Instagram độc bản  
**Đội thi:** Content Studio Team  

---

### 1. Mục tiêu ứng dụng AI
Sử dụng công nghệ AI làm trợ lý toàn trình (AI Co-pilot / Vibe Coding) để:
- Thiết kế hệ thống prompt chống văn mẫu (Anti-AI-Slop) giải quyết triệt để vấn đề kịch bản rập khuôn của các shop online.
- Kiến tạo kiến trúc nội dung phân giải 3 góc nhìn tâm lý: **PAS (Vấn đề - Giải pháp)**, **Cảm xúc & Phong cách sống**, **FAB (Thông số & Giá trị chế tác)**.
- Xây dựng giao diện ứng dụng chuẩn cao cấp (Apple / Linear-grade Luxury Glassmorphism) tối ưu trải nghiệm người bán hàng.

---

### 2. Vòng lặp phát triển cùng AI (Prompt Engineering & Verification)

#### Bước 1 — Yêu cầu ban đầu (Initial Prompt)
> *"Đóng vai trò Creative Director kiêm Senior Frontend Engineer, hãy xây dựng ứng dụng Content Studio bằng Next.js 16 và Tailwind CSS. Ứng dụng nhận vào tên sản phẩm, mô tả, khách hàng mục tiêu và sinh ra 3 kịch bản quảng cáo Facebook/Instagram độc bản."*

#### Bước 2 — Thử nghiệm thực tế & Phát hiện vấn đề (Problem Discovery)
- **Vấn đề phát hiện:** Mô hình sinh ra các câu mở đầu theo lối mòn của bot AI phổ thông (*"Chào các bạn yêu...", "Đừng bỏ lỡ siêu phẩm...", "Bạn đang tìm kiếm..."*). Các câu mở đầu này dài trên 160 ký tự, khi hiển thị trên ứng dụng Facebook Mobile bị nút *"Xem thêm"* che mất thông điệp cốt lõi, khiến người mua lướt qua ngay.

#### Bước 3 — Yêu cầu cải tiến & Ràng buộc chuyên sâu (Refinement Prompt)
> *"Nâng cấp System Prompt theo chuẩn Anti-AI-Slop 2026:
> 1. Áp dụng quy tắc 125 ký tự vàng: Câu mở đầu (Hook) của mỗi bài viết bắt buộc phải kết thúc hoàn chỉnh trước ký tự thứ 125.
> 2. Cấm tuyệt đối 7 câu mở đầu văn mẫu và các tính từ sáo rỗng ('siêu phẩm', 'hoàn hảo', 'đỉnh chóp').
> 3. Tích hợp Zod Schema kiểm tra cấu trúc đầu ra nghiêm ngặt gồm đúng 3 Captions, 3 Headlines và 5 Hashtags."*

#### Bước 4 — Kiểm định mã nguồn & Thử nghiệm lại (Verification & Testing)
- Thử nghiệm với sản phẩm thật (*"Áo sơ mi lụa tơ tằm Bảo Lộc"*):
  - Câu mở đầu Góc 1 (PAS): *"Chiếc sơ mi 800k mua tuần trước đã nhăn nhúm sau 2 lần giặt, làm hỏng cả buổi họp quan trọng của bạn?"* ➔ **Đúng 105 ký tự Unicode**, nằm trọn trong vùng hiển thị an toàn của Facebook Mobile.
  - Tỷ lệ từ ngữ sáo rỗng: **0%**.

#### Bước 5 — Tinh chỉnh giao diện & Tối ưu chuyển đổi (UI Polish)
- Đưa vào thước đo ký tự quang học hai tầng (125 ký tự Facebook Hook và 2.200 ký tự trần Instagram Caption) đổi màu cảnh báo tức thì khi người dùng chỉnh sửa nội dung trên màn hình.

---

### 3. Kết luận
AI đóng vai trò đòn bẩy công nghệ thực thụ: rút ngắn thời gian phát triển từ 2 tuần xuống còn 3 ngày, đồng thời đảm bảo chất lượng kịch bản đầu ra đáp ứng tiêu chuẩn khắt khe của ngành quảng cáo số.

