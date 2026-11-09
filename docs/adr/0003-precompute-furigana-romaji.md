# ADR 0003 – Precompute furigana/romaji lúc ingest

- **Trạng thái:** Accepted (2026-10-26), sửa đổi sau review panel cùng ngày

## Bối cảnh
Cần chuyển kanji → kana/romaji bằng thư viện open-source. kuromoji (dictionary ~12–17 MB) không phù hợp chạy trên client hay Edge. kuroshiro upstream ít được bảo trì. Reading của IPADIC không đáng tin với từ đứng riêng và xử lý kém jukujikun (今日, 大人).

## Quyết định
- **Từ vựng:** reading lấy từ **JMdict**, phân đoạn ruby từ **JmdictFurigana**, romaji bằng **wanakana**.
- **Câu ví dụ, ngữ pháp, hội thoại:** viết tay bằng markup furigana `{漢字|かんじ}`, cách từ bằng dấu cách (`src/lib/japanese/markup.ts`); script ingest sinh `segments` + `romaji` (trợ từ は/へ/を đọc đúng wa/e/o). *Cập nhật P2: không cần kuroshiro – markup chính xác hơn và không thêm dependency. kuroshiro/lindera chỉ cần nếu sau này ingest câu từ nguồn ngoài (Tatoeba).*
- Kết quả lưu trong `content/`, người biên tập sửa được. Render `<ruby>` ở server → SEO tốt, không tốn JS client.
- **Không có route phân tích runtime.** Text động từ AI dùng markup furigana do model xuất, validate bằng zod.
- **wanakana** ở client cho kana ↔ romaji khi gõ.

## Hệ quả
- (+) Nhanh, rẻ, chính xác hơn; kuroshiro không chạy trên input không tin cậy.
- (−) Phải chạy lại ingest khi đổi nội dung. Phương án thay kuroshiro: `lindera-wasm`.
