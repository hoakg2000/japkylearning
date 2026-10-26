# 07 – Nội dung & bản quyền

> Cập nhật 2026-10-26 theo [review panel](./REVIEW-2026-10-26.md).

## 1. Dataset mở

| Dữ liệu | Nguồn | License | Nghĩa vụ |
|---------|-------|---------|----------|
| Từ điển (JMdict) | https://www.edrdg.org/ , JSON: https://github.com/scriptin/jmdict-simplified | CC BY-SA 4.0 | Ghi nguồn EDRDG ở credits **và** footer trang từ; share-alike; cập nhật định kỳ (cron hằng tháng) |
| Kanji (KANJIDIC2) | https://www.edrdg.org/wiki/index.php/KANJIDIC_Project | CC BY-SA 4.0 | Như trên, footer trang kanji |
| Furigana từ (JmdictFurigana) | https://github.com/Doublevil/JmdictFurigana | CC BY-SA (**kiểm version trong LICENSE**) | Ghi nguồn; share-alike |
| Stroke order (KanjiVG) | https://kanjivg.tagaini.net | CC BY-SA 3.0 | Ghi nguồn Ulrich Apel; share-alike |
| Câu ví dụ (Tatoeba) | https://tatoeba.org/downloads | CC BY 2.0 FR (một phần CC0) | Ghi nguồn từng câu (`source: tatoeba:<id>`); lọc câu sai |
| Pitch accent (Kanjium) | https://github.com/mifunetoshiro/kanjium | CC BY-SA 4.0 | Ghi nguồn; share-alike |
| JLPT lists (Jonathan Waller) | tanos.co.uk (mirror) | CC BY | Ghi nguồn; không có list JLPT chính thức từ 2010 |
| Hán-Việt (Unihan `kVietnamese`) | https://www.unicode.org/charts/unihan.html | Unicode License v3 | Giữ notice |

**Phạm vi share-alike (CC BY-SA):**
- Áp dụng cho **dữ liệu** và **bản chuyển thể của dữ liệu**: nghĩa tiếng Việt dịch từ JMdict, animation từ KanjiVG, dataset tổng hợp trong `content/`.
- **Không** áp dụng cho mã nguồn ứng dụng.
- → Phát hành `content/` theo **CC BY-SA 4.0**, có bản dump tải về công khai. Điều khoản sử dụng không được cấm tái sử dụng phần nội dung này.
- Trang `/about/credits` liệt kê đầy đủ; footer trang từ/kanji có dòng ghi nguồn ngắn.

## 2. Hán-Việt

Chưa có dataset mở kanji Nhật → Hán-Việt, nên tự build:
1. Lấy `kVietnamese` từ Unihan cho từng kanji.
2. Kanji shinjitai (気, 図, 楽, 学…) → tra qua biến thể phồn thể (`kTraditionalVariant`, biến thể KANJIDIC2).
3. Nhiều âm → chọn âm người Việt quen dùng; **review tay toàn bộ ~100 kanji N5**, đánh dấu `hanVietReviewed: true`.
4. **Hán-Việt của từ:** chỉ ghép cho các đoạn đọc **on'yomi** (学生 → HỌC SINH), dựa trên phân đoạn của JmdictFurigana.
5. **Jukujikun / ateji** (今日, 大人, 明日): gắn `jukujikun: true`, không ghép tự động; nếu cần thì nhập tay (`hanVietSource: 'manual'`).
6. Tham khảo: https://github.com/phucbm/xue-hanzi

## 3. Pipeline ingest

```
scripts/ingest/
  fetch-sources.ts      # tải JMdict-simplified, JmdictFurigana, KANJIDIC2, KanjiVG, Unihan, Kanjium, Tatoeba vào thư mục riêng ngoài src/
  build-kanji.ts        # KANJIDIC2 + Hán-Việt + KanjiVG + JLPT + phân bài
  build-words.ts        # list N5 → JMdict (reading, nghĩa en) → JmdictFurigana (segments) → wanakana (romaji) → ví dụ Tatoeba (kuroshiro cho segments)
  build-audio.ts        # pre-generate audio fish.audio → R2 → ghi audioUrl
  validate-content.ts   # zod, tombstone, license bài hát – chạy trong CI
```

- Không commit file nguồn lớn; chỉ commit output đã lọc trong `content/`.
- Nghĩa tiếng Việt: AI dịch nháp + người review, trạng thái `meaningsViReviewed`.
- Bài học giữ id JMdict cố định; cron hằng tháng cập nhật JMdict và tạo PR.
- Chạy ingest trong CI không có secret (trừ bước audio chạy tay hoặc job riêng).

## 4. Bài hát

Xem [ADR 0006](./adr/0006-song-content-policy.md).

**Quy tắc public domain ở Nhật**
- Thời hạn bảo hộ chuyển sang 70 năm sau khi tác giả mất từ 30/12/2018, **không hồi tố**. → Tác phẩm của tác giả **mất năm 1967 trở về trước** đã là public domain.
- Áp dụng **riêng cho người viết lời và người viết nhạc**: cả hai phải thỏa.
- Tác phẩm khuyết danh (nhiều 唱歌) tính từ năm công bố.
- **Bản phối và bản thu âm là quyền riêng.** Phải tự thu hoặc có license cho bản thu.
- Cẩn thận với bản lời sửa đổi sau này.

**Danh sách khởi đầu** (kiểm năm mất trước khi phát hành, ghi vào `rightsProof`):

| Bài | Lời | Nhạc | Trạng thái |
|-----|-----|------|------------|
| さくらさくら | Dân ca | Dân ca | PD |
| かごめかごめ | Dân ca | Dân ca | PD |
| 春が来た | 高野辰之 (mất 1947) | 岡野貞一 (mất 1941) | PD |
| 七つの子 | 野口雨情 (mất 1945, đã kiểm) | 本居長世 (mất 1945, **cần kiểm**) | PD nếu đúng |
| 赤とんぼ | 三木露風 (mất 1964, **cần kiểm**) | 山田耕筰 (mất 1965, **cần kiểm**) | PD nếu đúng |

**Không dùng:** ぞうさん, かえるのうた (còn bản quyền).

**Bản thu:** chủ dự án tự thu hoặc đặt thu, có hợp đồng chuyển quyền; lưu ở R2.

## 5. Âm thanh, font, hình ảnh, voice

- Sound effect: tự tạo hoặc CC0.
- Font Noto, Be Vietnam Pro: SIL OFL.
- Minh họa/mascot: tự vẽ hoặc license rõ ràng.
- Voice fish.audio: chỉ từ người nói đã ký giấy đồng ý; gói commercial trước launch công khai ([05 §2](./05-AI-SPEECH.md#2-tts)).
