# ADR 0006 – Chính sách nội dung bài hát

- **Trạng thái:** Accepted (2026-10-26)

## Bối cảnh
Học qua bài hát cần lyrics đồng bộ. Lyrics có bản quyền riêng; ở Nhật hiển thị lyrics online cần license (JASRAC). Nhúng YouTube hợp lệ nhưng không kèm quyền lyrics.

## Quyết định
- Chỉ phát hành bài **public domain** (tác giả mất từ 1967 trở về trước, kiểm tra từng bài), **Creative Commons** cho phép, hoặc **có license**.
- Video chỉ qua YouTube IFrame Player chính thức (`youtube-nocookie.com`).
- Content schema bắt buộc trường `license`; CI từ chối bài thiếu.
- v1 không có tính năng người dùng đăng lyrics công khai.

## Hệ quả
- (+) Tránh rủi ro pháp lý.
- (−) Thư viện bài hát ban đầu nhỏ (đồng dao); mở rộng khi có license/hợp tác.
