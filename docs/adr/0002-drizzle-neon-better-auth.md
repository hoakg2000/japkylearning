# ADR 0002 – Drizzle + Neon Postgres + Better Auth

- **Trạng thái:** Accepted (2026-10-26)

## Bối cảnh
Cần lưu tiến độ, SRS, streak, lịch sử AI; muốn tự chủ, không phụ thuộc nặng vào 1 vendor.

## Quyết định
- **Postgres trên Neon** (branch DB cho preview deploy).
- **Drizzle ORM** (SQL-first, nhẹ, hợp serverless).
- **Better Auth** (email + Google OAuth, role admin). Auth.js v5 hiện chỉ nhận bản vá bảo mật.
- Guest dùng localStorage, merge khi đăng nhập.

## Hệ quả
- (+) Kiểm soát schema và dữ liệu; đổi host Postgres dễ.
- (−) Tự lo auth UI và email; nhiều code hơn Supabase/Clerk.
