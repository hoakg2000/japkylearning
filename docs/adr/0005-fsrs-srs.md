# ADR 0005 – FSRS cho spaced repetition

- **Trạng thái:** Accepted (2026-10-26)

## Bối cảnh
Flashcard và ôn tập cần thuật toán lập lịch.

## Quyết định
Dùng **FSRS** qua thư viện `ts-fsrs` (5.x stable), lưu trạng thái thẻ theo user × item × chiều thẻ, lưu `review_logs` để tối ưu tham số sau này.

## Hệ quả
- (+) Hiệu quả ôn tốt hơn SM-2, là mặc định của Anki.
- (+) Dữ liệu retrievability dùng được cho adaptive path.
- (−) Khó giải thích hơn SM-2; UI chỉ hiện "ngày ôn tiếp".
