# CONTENT STUDIO — 100% FRONTEND REDESIGN (LINEAR + REACT BITS)
## COMPONENT MAPPING & TRANSFORMATION MATRIX

**Kiến trúc Đích:** Concept C — Precision Synthesizer & Product Theatre (Linear / Raycast / React Bits Tier)  
**Hệ màu Cốt lõi:** Basalt OLED (`#08090C`, `#0E1017`, `#141722`), Viền Hairline `rgba(255, 255, 255, 0.07)`, Điểm nhấn Cyber Mint (`#00D492`) & Cobalt (`#3B82F6`), Font Kỹ thuật `JetBrains Mono` + Font Công thái học `Plus Jakarta Sans`.

---

### 1. FOUNDATION & TOKENS MAPPING
| File Hiện Tại | Mục Tiêu Nâng Cấp | Linh Kiện Tái Dùng (`abyz-ui-library`) |
| :--- | :--- | :--- |
| `src/app/globals.css` | Xóa bỏ màu gradient hỗn loạn; nạp biến màu Basalt OLED, Hairline viền kính, Double-Bezel chassis, animation cubic-bezier | `emil-design-eng` custom cubic curves |
| `src/components/ui/SpotlightCard.tsx` | Nâng cấp thuật toán spotlight cursor mượt mà không gây reflow | `react-bits-spotlight-card` |
| `src/components/ui/BorderBeam.tsx` | Chùm sáng laser chạy quanh chassis khi AI đang xử lý | `magic-ui/border-beam` |
| `src/components/ui/ShimmerButton.tsx` | Nút bấm xúc giác kim loại có shimmer viền phát sáng | `magic-ui/shimmer-button` |

---

### 2. LANDING PAGE TRANSFORMATION (MẶT TIỀN 100%)
| Component | Hiện Trạng (Cũ) | Trạng Thái Mới (Linear + React Bits) |
| :--- | :--- | :--- |
| `LandingNav.tsx` | Thanh nav bám đỉnh cơ bản, viền xám đục | Floating Command Nav dạng capsule kính tách rời mép trên, status chip nhấp nháy `LIVE ENGINE` |
| `HeroSection.tsx` | Text căn giữa với 3 card tĩnh, hiệu ứng nhảy giật | **The Live Synthesizer Theatre**: Cỗ máy gia công 2 cột (Brief Console + 3 Angles Output) với nút gạt preset thời gian thực |
| `SocialTicker.tsx` | Dòng chữ chạy đơn điệu | Telemetry ticker hiển thị thời gian thực các chỉ số tốc độ (0.5s), số từ, conversion rate |
| `ThreeAnglesFramework.tsx`| 3 Card cơ bản | Khung so sánh cơ học: Cấu trúc giải mã PAS, AIDA, FAB có đèn báo trạng thái độc lập |
| `FeatureGrid.tsx` | Grid 3 cột Bootstrap nhàm chán | Asymmetrical Bento Grid với Spotlight cursor và viền hairline |
| `PricingSection.tsx` | Bảng giá tháp 3 cột truyền thống | Precision Pricing Matrix: Thẻ Pro có viền quang học Cyber Mint, công tắc gạt tháng/năm có haptic |
| `FaqSection.tsx` | Accordion đơn giản | Tactile Collapsible Drawer phong cách thiết bị điện tử |
| `LandingFooter.tsx` | Footer dày đặc link | Minimalist Studio Console Footer với copyright, mono telemetry và system status badge |

---

### 3. WORKSPACE TRANSFORMATION (BÀN LÀM VIỆC 100%)
| Component | Hiện Trạng (Cũ) | Trạng Thái Mới (Linear + React Bits) |
| :--- | :--- | :--- |
| `WorkspaceHeader.tsx` | Header web thông thường | Command Deck: Logo khắc laser, breadcrumb monospace, thanh đo credits neon |
| `WorkspaceContainer.tsx`| Quá nhiều viền xám chồng chéo (1375 lines) | **Precision Atelier**: Cấu trúc Double-Bezel, layout 2 cột chia tỉ lệ 400px / 1fr, phím tắt `⌘+Enter`, `1/2/3` chuyển góc |
| `ProductForm.tsx` | Form input dày cộp viền xám | Terminal Input Bay: Khung nhập liệu trũng sâu với viền phát sáng khi focus, chip ngành hàng tactile |
| `ResultsSection.tsx` | Khung hiển thị rời rạc | Bản thảo chế tác: Hook nổi bật, Body giãn dòng chuẩn xác, bộ đếm ký tự mono `tabular-nums` |
| `FacebookMockup.tsx` | Khung preview chìm trong nền | Floating Social Inspector: Khung điện thoại/feed Facebook chân thực nổi trên nền tối |
| Modals (TopUp, Auth) | Popup viền dày | Floating Frosted Glass Drawers với backdrop blur sâu và animation `scale(0.95) -> scale(1)` |

