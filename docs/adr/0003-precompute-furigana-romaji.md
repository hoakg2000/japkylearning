# ADR 0003 – Precompute furigana/romaji lúc ingest

- **Trạng thái:** Accepted (2026-10-26)

## Bối cảnh
Cần chuyển kanji → kana/romaji bằng thư viện open-source. kuromoji (dictionary ~12–17 MB) không phù hợp chạy trên client hay Edge. kuroshiro upstream ít được bảo trì.

## Quyết định
- Dùng **kuroshiro + kuroshiro-analyzer-kuromoji** trong script ingest (Node) để sinh `segments` (surface + reading) và `romaji`, lưu vào `content/`. Đã có tiền lệ trong project secretary.
- Render `<ruby>` ở server → SEO tốt, không tốn JS client.
- Text động (chat AI, câu người dùng nhập): API route Node runtime, có rate limit + cache.
- **wanakana** ở client cho kana ↔ romaji khi gõ.
- Người biên tập sửa được reading sai trong `content/`.

## Hệ quả
- (+) Nhanh, rẻ, chính xác hơn (có review tay).
- (−) Phải chạy lại ingest khi đổi nội dung. Phương án thay: `lindera-wasm` nếu kuroshiro lỗi.
