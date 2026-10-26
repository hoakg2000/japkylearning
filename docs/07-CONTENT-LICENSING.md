# 07 – Nội dung & bản quyền

## 1. Dataset mở

| Dữ liệu | Nguồn | License | Nghĩa vụ |
|---------|-------|---------|----------|
| Từ điển (JMdict) | https://www.edrdg.org/ , JSON: https://github.com/scriptin/jmdict-simplified | CC BY-SA 4.0 | Ghi nguồn EDRDG ở trang credits **và** trên trang từ điển; share-alike cho dữ liệu dẫn xuất; cập nhật định kỳ (EDRDG yêu cầu web dictionary cập nhật thường xuyên, ít nhất hằng tháng) |
| Kanji (KANJIDIC2) | https://www.edrdg.org/wiki/index.php/KANJIDIC_Project | CC BY-SA 4.0 | Như trên |
| Stroke order (KanjiVG) | https://kanjivg.tagaini.net | CC BY-SA 3.0 | Ghi nguồn Ulrich Apel; share-alike |
| Câu ví dụ (Tatoeba) | https://tatoeba.org/downloads | CC BY 2.0 FR (một phần CC0) | Ghi nguồn; lọc câu sai |
| Pitch accent (Kanjium) | https://github.com/mifunetoshiro/kanjium | CC BY-SA 4.0 | Ghi nguồn; share-alike |
| JLPT lists (Jonathan Waller) | tanos.co.uk (mirror) | CC BY | Ghi nguồn. Lưu ý: không có list JLPT chính thức từ 2010 |
| Hán-Việt (Unihan `kVietnamese`) | https://www.unicode.org/charts/unihan.html | Unicode License v3 | Giữ notice |

**Hệ quả:** dataset nội dung tổng hợp của Japky phát hành theo **CC BY-SA 4.0**. Mã nguồn có thể giữ license riêng. Trang `/about/credits` liệt kê đầy đủ.

## 2. Build dữ liệu Hán-Việt

Chưa có dataset mở kanji Nhật → Hán-Việt, nên tự build:
1. Lấy `kVietnamese` từ Unihan cho từng kanji.
2. Với kanji giản thể kiểu Nhật (shinjitai: 気, 図, 楽, 学…) không có dữ liệu trực tiếp → tra qua biến thể phồn thể (`kTraditionalVariant`, biến thể trong KANJIDIC2).
3. Khi có nhiều âm, chọn âm người Việt quen dùng; **review tay toàn bộ ~100 kanji N5** trước khi phát hành, đánh dấu `reviewed: true`.
4. Hán-Việt của từ = ghép âm từng kanji (学生 → HỌC SINH), chỉ áp dụng khi từ đọc theo on'yomi.
5. Tham khảo cách làm: https://github.com/phucbm/xue-hanzi

## 3. Pipeline ingest

```
scripts/ingest/
  fetch-sources.ts      # tải bản phát hành mới của JMdict-simplified, KANJIDIC2, KanjiVG, Unihan, Kanjium
  build-kanji.ts        # merge KANJIDIC2 + Hán-Việt + KanjiVG id + JLPT
  build-words.ts        # lọc theo list N5 → map JMdict → furigana/romaji (kuroshiro) → ví dụ Tatoeba
  build-audio.ts        # (tùy chọn) pre-generate TTS fish.audio cho từ N5
  validate-content.ts   # zod, chạy trong CI
```

- Nguồn tải về đặt trong thư mục riêng ngoài `src/`, không commit file gốc lớn; chỉ commit output đã lọc trong `content/`.
- Bản dịch tiếng Việt: JMdict chủ yếu có tiếng Anh → nghĩa tiếng Việt cần biên soạn (có thể AI dịch nháp + người review), lưu trạng thái `reviewed`.
- Job định kỳ (GitHub Actions hằng tháng) cập nhật JMdict và tạo PR.

## 4. Bài hát & lyrics

**Rủi ro bản quyền lớn nhất của dự án.**
- Lời bài hát có bản quyền riêng với bản thu. Ở Nhật, hiển thị lyrics online cần license (JASRAC).
- Nhúng YouTube qua player chính thức là hợp lệ; nhưng **không** đi kèm quyền hiển thị lyrics.

**Chính sách (xem [ADR 0006](./adr/0006-song-content-policy.md)):**
1. Chỉ phát hành bài:
   - **Public domain**: đồng dao (dōyō) mà tác giả lời và nhạc mất từ **1967 trở về trước** (ví dụ 故郷, 春が来た – vẫn phải kiểm tra từng bài).
   - **Creative Commons** cho phép (CC BY / CC BY-SA), ghi nguồn.
   - Nội dung **có license** (tự thu âm, hợp tác nghệ sĩ, mua license).
2. Mỗi bài có trường `license` trong content schema; CI từ chối bài thiếu license.
3. Chưa làm tính năng cho người dùng upload lyrics công khai.

## 5. Âm thanh, font, hình ảnh

- Sound effect: CC0 (ví dụ Kenney, freesound CC0) hoặc tự tạo.
- Font Noto: SIL OFL.
- Minh họa/mascot: tự vẽ hoặc license rõ ràng.
