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
  build-n5.ts           # content/source/n5 (bài, từ, ví dụ viết tay) → JMdict (id, nghĩa en) → JmdictFurigana (segments) → Hán-Việt (on'yomi) → content/levels/n5/*.json
  build-audio.ts        # pre-generate audio fish.audio → R2 → ghi audioUrl
  build-songs.ts        # LRCLIB → parse LRC → segments/romaji → AI lyrics-keywords + lyrics-translate → content/songs/*.json
  validate-content.ts   # zod, tombstone, keyword khớp vị trí lyrics – chạy trong CI
```

- Không commit file nguồn lớn; chỉ commit output đã lọc trong `content/`.
- Nghĩa tiếng Việt: AI dịch nháp + người review, trạng thái `meaningsViReviewed`.
- Bài học giữ id JMdict cố định; cron hằng tháng cập nhật JMdict và tạo PR.
- Chạy ingest trong CI không có secret (trừ bước audio chạy tay hoặc job riêng).

## 4. Bài hát

Xem [ADR 0012](./adr/0012-song-source-and-engine.md) (thay [ADR 0006](./adr/0006-song-content-policy.md)).

**Quyết định của chủ dự án:** v1 **tạm chưa xử lý bản quyền** lyrics/bài hát, để ưu tiên trải nghiệm học với nhạc thật.

| Nguồn | Dùng cho | Ghi chú |
|-------|----------|---------|
| [LRCLIB](https://lrclib.net) API | Lyrics + timeline (LRC) | Miễn phí, không key, dữ liệu do cộng đồng đóng góp; gửi `User-Agent` nhận diện app; cache kết quả, không gọi dồn dập |
| YouTube IFrame Player API | Phát nhạc | Player chính thức, `youtube-nocookie.com` |
| YouTube Data API v3 (v2) | Metadata video | Cần API key, quota 10.000 đơn vị/ngày mặc định |

**Rủi ro đã biết (ghi lại để xử lý ở giai đoạn thương mại):**
- Lyrics có bản quyền; ở Nhật, hiển thị lyrics online thường cần license (JASRAC/NexTone). LRCLIB không cấp quyền này.
- YouTube API Policies: không che/overlay player, không ẩn video chỉ để phát audio, player ≥ 200×200; privacy policy phải dẫn chính sách của Google; nhúng YouTube đặt cookie khi phát → cần nêu trong consent.
- **v2 engine tải audio từ YouTube để phân tích** → vi phạm YouTube Terms of Service (cấm tải nội dung ngoài cách YouTube cho phép). Cần quyết định lại trước khi build v2 (ví dụ: chỉ phân tích audio người dùng tự tải lên, hoặc làm việc với nhà cung cấp lyrics có license như Musixmatch / LyricFind).
- Giảm thiểu tạm thời: chỉ hiển thị lyrics cho người dùng đăng nhập ở v2; có cơ chế gỡ bài theo yêu cầu (takedown) ngay từ v1.

## 5. Âm thanh, font, hình ảnh, voice

- Sound effect: tự tạo hoặc CC0.
- Font Noto, Be Vietnam Pro: SIL OFL.
- Minh họa/mascot: tự vẽ hoặc license rõ ràng.
- Voice fish.audio: chỉ từ người nói đã ký giấy đồng ý; gói commercial trước launch công khai ([05 §2](./05-AI-SPEECH.md#2-tts)).
