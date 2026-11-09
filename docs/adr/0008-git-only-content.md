# ADR 0008 – Nội dung chỉ nằm trong git

- **Trạng thái:** Accepted (2026-10-26)

## Bối cảnh
Bản kế hoạch đầu có "Admin CMS" ở Phase 5, mâu thuẫn với việc nội dung là JSON trong git (app serverless không ghi được vào `content/`). Thẻ SRS và tiến độ trỏ tới id nội dung mà không có foreign key.

## Quyết định
- `content/` là **nguồn nội dung duy nhất** ở v1. Sửa nội dung qua PR. **Bỏ Admin CMS.**
- `validate-content` so danh sách id với commit trước; id biến mất mà không có trong `content/tombstones.json` → build fail.
- Thẻ SRS trỏ tới id đã tombstone → `suspended`, giữ lịch sử.

## Hệ quả
- (+) Có review, lịch sử, rollback miễn phí qua git; không có kiến trúc thứ hai.
- (−) Người biên tập không phải developer cần làm quen quy trình PR (có thể dùng GitHub web editor).
