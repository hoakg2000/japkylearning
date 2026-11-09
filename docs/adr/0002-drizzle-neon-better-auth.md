# ADR 0002 – Drizzle + Neon Postgres + Better Auth

- **Trạng thái:** Accepted (2026-10-26)

## Bối cảnh
Cần lưu tiến độ, SRS, streak, lịch sử AI; muốn tự chủ, không phụ thuộc nặng vào 1 vendor.

## Quyết định
- **Postgres trên Neon** (branch DB cho preview deploy).
- **Drizzle ORM** (SQL-first, nhẹ, hợp serverless).
- **Better Auth** (email + Google OAuth, role admin). Auth.js v5 hiện chỉ nhận bản vá bảo mật.
- Khách là Better Auth anonymous user ([ADR 0009](./0009-anonymous-guest-users.md)). Bản gốc dùng localStorage + merge, đã bỏ.
- Neon `ap-southeast-1`, Vercel function region `sin1`; WebSocket `Pool` cho transaction.

## Hệ quả
- (+) Kiểm soát schema và dữ liệu; đổi host Postgres dễ.
- (−) Tự lo auth UI và email; nhiều code hơn Supabase/Clerk.
