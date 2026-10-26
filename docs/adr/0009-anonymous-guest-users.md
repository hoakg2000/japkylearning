# ADR 0009 – Khách là anonymous user

- **Trạng thái:** Accepted (2026-10-26). Thay phần "guest localStorage + merge" trong [ADR 0002](./0002-drizzle-neon-better-auth.md)

## Bối cảnh
Lưu tiến độ khách trong localStorage rồi merge khi đăng nhập buộc mọi tính năng viết 2 lần (localStorage và DB). Merge kiểu "bản mới hơn thắng" làm mất review log và sai khi dùng nhiều thiết bị.

## Quyết định
- Dùng **Better Auth anonymous plugin**. Anonymous user được tạo **lười** khi có lần ghi đầu tiên (không tạo khi chỉ xem trang), qua **Turnstile** + giới hạn theo IP.
- Khi đăng ký: `onLinkAccount({ anonymousUser, newUser })` chuyển dữ liệu học trong 1 transaction.
- Cron xóa anonymous user không hoạt động > 30 ngày.
- Anonymous user không dùng AI, cloud TTS, STT.

## Hệ quả
- (+) Một đường dữ liệu duy nhất; không có code merge.
- (−) DB có thêm user tạm → cần cron dọn và chống bot.
