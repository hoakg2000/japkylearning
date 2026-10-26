# ADR 0003 – Precompute furigana/romaji lúc ingest

- **Trạng thái:** Accepted (2026-10-26), sửa đổi sau review panel cùng ngày

## Bối cảnh
Cần chuyển kanji → kana/romaji bằng thư viện open-source. kuromoji (dictionary ~12–17 MB) không phù hợp chạy trên client hay Edge. kuroshiro upstream ít được bảo trì. Reading của IPADIC không đáng tin với từ đứng riêng và xử lý kém jukujikun (今日, 大人).

## Quyết định
- **Từ vựng:** reading lấy từ **JMdict**, phân đoạn ruby từ **JmdictFurigana**, romaji bằng **wanakana**.
- **Câu ví dụ:** **kuroshiro + kuroshiro-analyzer-kuromoji** trong script ingest (Node, CI, không secret) sinh `segments` + `romaji`.
- Kết quả lưu trong `content/`, người biên tập sửa được. Render `<ruby>` ở server → SEO tốt, không tốn JS client.
- **Không có route phân tích runtime.** Text động từ AI dùng markup furigana do model xuất, validate bằng zod.
- **wanakana** ở client cho kana ↔ romaji khi gõ.

## Hệ quả
- (+) Nhanh, rẻ, chính xác hơn; kuroshiro không chạy trên input không tin cậy.
- (−) Phải chạy lại ingest khi đổi nội dung. Phương án thay kuroshiro: `lindera-wasm`.
