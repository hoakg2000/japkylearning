# ADR 0011 – Tuân thủ PDPL

- **Trạng thái:** Accepted (2026-10-26). Cần luật sư review trước launch công khai

## Bối cảnh
Luật Bảo vệ dữ liệu cá nhân (Luật 91/2025/QH15) hiệu lực 01/01/2026, thay Nghị định 13/2023. Người dùng chủ yếu ở Việt Nam. Hosting ở Singapore và gửi dữ liệu tới LLM, Google STT là chuyển dữ liệu ra nước ngoài. Trẻ dưới 16 cần consent phụ huynh (từ 7 tuổi cần cả trẻ đồng ý – theo nguồn thứ cấp, chưa đọc được văn bản luật).

## Quyết định
- **Chặn người dưới 16** tạo tài khoản và dùng AI/STT ở v1; khách vẫn học nội dung tĩnh.
- **Consent theo từng mục đích** (bảng `consents`), không tick sẵn, rút lại được.
- Hồ sơ đánh giá tác động chuyển dữ liệu ra nước ngoài; danh sách bên xử lý công khai trong privacy policy.
- Tối thiểu hóa: không gửi PII cho LLM, không lưu audio, analytics cookieless.
- Xuất dữ liệu và xóa tài khoản trong `/me`.

## Hệ quả
- (+) Giảm rủi ro pháp lý; tạo niềm tin.
- (−) Mất nhóm người học dưới 16 ở v1; thêm bước consent trong luồng đăng ký.
