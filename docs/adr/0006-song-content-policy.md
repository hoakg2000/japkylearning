# ADR 0006 – Chính sách nội dung bài hát

- **Trạng thái:** Accepted (2026-10-26), viết lại sau review panel cùng ngày

## Bối cảnh
Học qua bài hát cần lyrics đồng bộ. Lời và nhạc có bản quyền; bản phối và bản thu là quyền riêng. Ở Nhật, hiển thị lyrics online cần license (JASRAC). Nhúng YouTube hợp lệ nhưng không kèm quyền hiển thị lyrics, còn đặt cookie Google và có quy định về bố cục player.

## Quyết định
- **Không dùng YouTube ở v1.** Dùng **audio tự host** (R2): bản thu do chủ dự án tự thực hiện hoặc đặt thu, có hợp đồng chuyển quyền.
- Chỉ dùng bài **public domain**: cả người viết lời và người viết nhạc mất **năm 1967 trở về trước** (luật Nhật 2018 không hồi tố), hoặc dân ca. Không dùng bài còn bản quyền (ví dụ ぞうさん, かえるのうた).
- Mỗi bài có `license`, `recordingRights`, `rightsProof` (năm mất có nguồn, hợp đồng thu âm). CI từ chối bài thiếu.
- Sync theo dòng (LRC); word-level để sau.
- v1 không cho người dùng đăng lyrics công khai.

## Hệ quả
- (+) Không rủi ro bản quyền lyrics, không cookie bên thứ ba, toàn quyền giao diện.
- (−) Phải tự thu âm; thư viện bài hát ban đầu nhỏ (3–5 bài).
