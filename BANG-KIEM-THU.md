# BẢNG KIỂM THỬ SẢN PHẨM (TEST CASES)
**Cuộc thi:** VIBE-CODING 2026 — FPT Polytechnic (Bộ môn Thương mại điện tử)  
**Bảng thi:** Bảng B – Kinh tế  
**Sản phẩm:** Content Studio — AI Content Generator cho Facebook & Instagram Ads  

---

### Bảng tổng hợp ca kiểm thử thực tế

| Mã ca | Loại ca | Dữ liệu đầu vào & Bước thử nghiệm | Kết quả kỳ vọng | Kết quả thực tế | Đánh giá |
|---|---|---|---|---|---|
| **TC01** | **Bình thường (Happy Path)** | - **Tên SP:** Áo sơ mi lụa tơ tằm dệt tay Bảo Lộc<br>- **Mô tả:** Lụa 100% tự nhiên dệt tay 16 momme, form suông thoáng mát 2-3°C, không nhăn.<br>- **Khách hàng:** Nữ công sở 28–45 tuổi, chuộng quiet luxury.<br>- **Tông:** Trang trọng.<br>➔ Nhấn **"Tạo 3 góc bài viết"**. | Hệ thống phân tích ngữ nghĩa và sinh đầy đủ bộ nội dung 3-3-5: 3 góc bài (PAS, Cảm xúc, FAB), 3 Headlines, 5 Hashtags. Câu mở đầu không quá 125 ký tự. | Hệ thống phản hồi trong 2.1 giây. Xuất đủ 3 kịch bản sắc bén, Hook mở đầu 105 ký tự, không chứa từ ngữ sáo rỗng. | **ĐẠT** |
| **TC02** | **Bình thường (Thao tác nhanh)** | - Chọn bài viết đã tạo ở TC01.<br>- Bấm nút **"Sao chép"** tại Góc 1.<br>- Bấm nút **"Chỉnh sửa"**, gõ thêm số điện thoại hotline vào cuối bài. | - Nội dung được lưu vào Clipboard và hiện Toast thông báo thành công.<br>- Cho phép gõ sửa trực tiếp; thước đo ký tự Facebook cập nhật nhảy số theo thời gian thực. | Clipboard nhận trọn vẹn văn bản; Toast màu xanh hiển thị ngay; bộ đếm tăng từ 412 lên 425 ký tự chính xác. | **ĐẠT** |
| **TC03** | **Nhập thiếu / Sai dữ liệu** | - Bỏ trống trường **Tên sản phẩm** (hoặc chỉ gõ 1 ký tự `"A"`).<br>- Nhấn **"Tạo 3 góc bài viết"**. | Form chặn gửi dữ liệu, viền ô nhập đổi màu đỏ cảnh báo: *"Tên sản phẩm tối thiểu 2 ký tự"*. Không tốn lượt tạo AI. | Hệ thống chặn submit ngay lập tức, hiển thị lỗi dưới ô nhập; không gọi API máy chủ. | **ĐẠT** |
| **TC04** | **Đầu vào không hợp lệ (An toàn)** | - Gõ tên sản phẩm dài 150 ký tự (vượt trần 100).<br>- Chèn chuỗi mã độc XSS: `<script>alert('hack')</script>`.<br>- Nhấn **"Tạo bài viết"**. | - Bộ đếm ký tự của trường nhập chuyển đỏ cảnh báo.<br>- Bộ lọc Zod Schema và React DOM tự động escape chuỗi mã độc, bảo đảm an toàn dữ liệu. | Chuỗi script được mã hóa hiển thị dạng văn bản thuần an toàn; hệ thống không bị crash hoặc dính lỗi bảo mật. | **ĐẠT** |
| **TC05** | **Ca biên (Boundary Check)** | - Gõ câu mở đầu bài viết dài đúng 125 ký tự.<br>- Tiếp tục gõ lên 135 ký tự.<br>- Gõ bài viết dài vượt trần 2.200 ký tự Instagram. | - Khi ở mức 125 ký tự: Thước đo hiển thị màu xanh an toàn.<br>- Khi vượt 125 ký tự: Thước đo cảnh báo nguy cơ bị nút "Xem thêm" che cụt.<br>- Khi vượt 2.200 ký tự: Thước đo Instagram chuyển sang cảnh báo đỏ. | Thước đo quang học đổi màu chuẩn xác: Xanh ngọc lục bảo (≤125) ➔ Cam cảnh báo (>125) ➔ Đỏ (vượt trần Instagram). | **ĐẠT** |
| **TC06** | **Chế độ Ngoại tuyến & Lịch sử** | - Ngắt kết nối mạng hoặc chạy ở môi trường không có API Key.<br>- Nhấn nút nạp đề bài mẫu ➔ Bấm Tạo bài.<br>- Mở ngăn kéo Lịch sử (Drawer). | - Hệ thống tự động chuyển sang chế độ Mock minh bạch, nạp dữ liệu mẫu tức thì.<br>- Lịch sử lưu trữ trên LocalStorage cho phép xem lại và khôi phục 1-click. | Ứng dụng hoạt động mượt mà không bị treo lỗi; mở Drawer thấy đầy đủ danh sách bài đã tạo và khôi phục thành công. | **ĐẠT** |

---
**Kết luận kiểm thử:** Đạt 6/6 ca kiểm thử thực tế (vượt tiêu chuẩn tối thiểu 3 ca của Bảng B – Kinh tế).

