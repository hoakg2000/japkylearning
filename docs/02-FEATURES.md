# 02 – Đặc tả tính năng

Mức ưu tiên: **P0** = MVP, **P1** = cần cho v1, **P2** = sau v1, **P3** = ý tưởng.

## Traceability: yêu cầu gốc → tính năng → phase

| Yêu cầu gốc | Mục | Phase |
|-------------|-----|-------|
| Web 2 ngôn ngữ vi/en | [03-ARCHITECTURE §i18n](./03-ARCHITECTURE.md#4-i18n) | 0 |
| Next.js TypeScript | [03-ARCHITECTURE](./03-ARCHITECTURE.md) | 0 |
| Các bảng chữ cái | [F1](#f1-bảng-chữ-cái-kana) | 1 |
| Check-in daily, giữ streak | [F2](#f2-daily-check-in--streak) | 1 |
| Kanji chia nhiều ngành nghề | [F3](#f3-kanji--từ-vựng-theo-jlpt-và-ngành-nghề) | 2 |
| Giao diện trực quan, tiện ích | [06-UI-UX](./06-UI-UX.md) | 0–5 |
| Bài học N5 | [F4](#f4-bài-học-n5) | 1–2 |
| Chế độ kiểm tra, thẻ | [F5](#f5-flashcard-srs--kiểm-tra) | 1–2 |
| Sharing widget (iframe) | [F12](#f12-sharing-widget-iframe) | 5 |
| Test dựa trên bài học + test AI | [F5](#f5-flashcard-srs--kiểm-tra), [F6](#f6-test-với-ai) | 2–3 |
| Voice đọc (device / fish.audio) | [F9](#f9-voice-tts) | 1 |
| Học theo chế độ AI | [F7](#f7-ai-learning-mode-adaptive-path) | 3 |
| Học qua bài hát + lyrics + highlight | [F11](#f11-học-qua-bài-hát) | 4 |
| Thẻ từ vựng đủ phiên âm, ví dụ | [F13](#f13-component-từ-vựng-wordcard) | 1 |
| Component từ có nhiều mode | [F13](#f13-component-từ-vựng-wordcard) | 1 |
| Thư viện open-source kanji→romaji | [ADR 0003](./adr/0003-precompute-furigana-romaji.md) | 1 |
| Chatbox AI | [F8](#f8-ai-chat-tutor) | 3 |
| Speech-to-text chấm phát âm | [F10](#f10-chấm-phát-âm-speech-to-text) | 4 |
| Extendable, SEO, tối ưu, bảo mật | [08-NFR](./08-NFR.md) | 0–5 |
| Giao diện sáng, 2 mode Full/Minimal | [06-UI-UX](./06-UI-UX.md) | 0 |
| Âm thanh cho action | [06-UI-UX §Âm thanh](./06-UI-UX.md#4-âm-thanh-action) | 1 |
| AI provider đổi được (Gemini/ChatGPT/Claude/MotAPI/Copilot), mock trước, gateway sau | [05-AI-SPEECH](./05-AI-SPEECH.md), [ADR 0004](./adr/0004-ai-provider-abstraction.md) | 3 |

---

## F1. Bảng chữ cái (Kana)

**Mô tả.** Hiragana và Katakana đầy đủ: 46 âm cơ bản, dakuten/handakuten (が, ぱ), yōon (きゃ), kana nhỏ (っ, ゃ), âm dài (ー), và katakana mở rộng (ファ, ティ, ヴ) ở P1.

**Chức năng**
- Bảng tương tác dạng lưới gojūon. Bấm vào ô → phát âm + hiện stroke order (KanjiVG có cả kana).
- Chế độ học: thẻ từng chữ, mnemonic hình ảnh (P1).
- Quiz: chọn romaji đúng (1 đáp án + 4 nhiễu, xáo trộn – port logic từ `src/screens/LearningScreen.js`), nghe → chọn kana, gõ romaji → tự chuyển kana (wanakana), quiz ngược (romaji → kana).
- Chọn hàng muốn luyện (あ行, か行…), tracking độ chính xác từng chữ, chữ hay sai được hỏi nhiều hơn (đưa vào SRS).

**Acceptance criteria**
- [ ] Có đủ ≥ 104 mục hiragana và ≥ 104 mục katakana (cơ bản + biến âm + yōon).
- [ ] Mỗi mục có romaji Hepburn, audio (TTS), stroke order.
- [ ] Quiz không bao giờ có 2 đáp án trùng nhau.
- [ ] Dùng được hoàn toàn bằng bàn phím.

## F2. Daily check-in & streak

**Mô tả.** Một "ngày học" được tính khi người dùng đạt **daily goal** (ví dụ 20 XP) hoặc bấm check-in sau khi hoàn thành ≥ 1 hoạt động.

**Chức năng**
- Streak hiện tại, streak dài nhất, lịch heatmap.
- **Streak freeze**: tối đa 2 freeze, kiếm bằng XP; tự dùng khi lỡ 1 ngày.
- Daily goal tùy chọn (casual 10 / regular 20 / serious 50 XP).
- Nhắc học: web push notification (P2), email (P3).
- Share card ảnh streak (OG image động) (P1).
- Hiệu ứng + âm thanh khi giữ streak.

**Quy tắc**
- Lưu timezone IANA của người dùng. "Ngày học" = ngày địa phương, rollover lúc **04:00** sáng.
- Bảng `study_days(user_id, local_date)` có unique constraint → idempotent.
- Chỉ cho đổi timezone 1 lần/ngày để chống gian lận.
- Guest: lưu localStorage; đăng nhập thì merge (lấy hợp các ngày).

**Acceptance criteria**
- [ ] Học lúc 23:59 và 00:01 giờ địa phương → 2 ngày khác nhau; học lúc 02:00 → vẫn tính ngày hôm trước.
- [ ] Lỡ 1 ngày khi còn freeze → streak giữ nguyên, freeze giảm 1.
- [ ] Unit test cho các trường hợp DST và đổi timezone.

## F3. Kanji & từ vựng theo JLPT và ngành nghề

**Mô tả.** Kanji và từ vựng được nhóm thành **pack**. Có 2 loại pack: theo cấp JLPT và theo ngành nghề.

**Pack ngành nghề** (16 lĩnh vực Tokutei Ginou + bổ sung):

| Nhóm | Pack | Ưu tiên |
|------|------|---------|
| Tokutei Ginou | Kaigo (介護) – điều dưỡng | P1 |
| | Food service (外食) – nhà hàng | P1 |
| | Chế tạo sản phẩm công nghiệp – nhà máy | P1 |
| | Xây dựng | P2 |
| | Nông nghiệp | P2 |
| | Chế biến thực phẩm | P2 |
| | Lưu trú – khách sạn | P2 |
| | Sửa chữa ô tô, vận tải ô tô | P2 |
| | Vệ sinh tòa nhà, đóng tàu, hàng không, ngư nghiệp, đường sắt, lâm nghiệp, gỗ | P3 |
| Bổ sung | IT / kỹ sư | P1 |
| | Văn phòng / keigo / email | P2 |
| | Đời sống (ủy ban, ngân hàng, biển báo) | P2 |

Ví dụ nội dung: kaigo (食事・入浴・排泄, bộ phận cơ thể), nhà máy (安全, 危険, 禁止, 検査, 5S), nhà hàng (注文, 会計, dị ứng), IT (設計, 実装, 障害, 仕様).

**Mỗi kanji có:** chữ, on'yomi, kun'yomi, **Hán-Việt**, nghĩa vi/en, bộ thủ, số nét, stroke order animation, cấp JLPT, các ngành liên quan, từ ví dụ (dùng WordCard), luyện viết (P2).

**Acceptance criteria**
- [ ] 100% kanji N5 có Hán-Việt đã review tay.
- [ ] Trang `/[locale]/kanji/[char]` là trang tĩnh, có metadata SEO.
- [ ] Mỗi pack có thể thêm toàn bộ vào SRS bằng 1 nút.

## F4. Bài học N5

**Lộ trình đề xuất (~30 bài, mỗi bài 10–15 phút):**

| Bài | Chủ đề | Ngữ pháp chính |
|-----|--------|----------------|
| 0 | Hiragana, Katakana | – |
| 1 | Chào hỏi, tự giới thiệu | 〜は〜です, じゃありません, か |
| 2 | Đồ vật | これ/それ/あれ, の |
| 3 | Địa điểm | ここ/そこ/あそこ, どこ |
| 4 | Số đếm, thời gian | 〜時〜分, から〜まで |
| 5 | Di chuyển | 行きます/来ます, へ, で (phương tiện) |
| 6 | Hành động hằng ngày | を, で (nơi chốn), ませんか |
| 7–8 | Tính từ い / な | Chia tính từ, とても/あまり |
| 9 | Sở thích, khả năng | が好き, が分かる |
| 10 | Tồn tại | あります/います, に |
| 11–15 | Số lượng, so sánh, quá khứ | 〜つ, より, 〜ました |
| 16–20 | Thể て | 〜てください, 〜ています, 〜てもいい |
| 21–25 | Thể ない, từ điển | 〜ないでください, 〜ことができる |
| 26–30 | Thể た, ôn tập | 〜たことがある, tổng ôn |

**Mỗi bài gồm:** mục tiêu, từ vựng (WordCard), ngữ pháp (giải thích vi/en + ví dụ), hội thoại mẫu (audio), bài tập (chọn, sắp xếp câu, điền, nghe), mini test cuối bài. Hoàn thành bài → mở khóa bài tiếp + đưa từ vào SRS.

**Cấu trúc mở rộng:** `content/levels/{n5,n4,...}/lessons/NN-slug.json` – thêm N4 chỉ là thêm thư mục.

**Acceptance criteria**
- [ ] Bài học là nội dung tĩnh (SSG), có trang SEO riêng cho phần ngữ pháp.
- [ ] Tiến độ bài học lưu theo user (DB) hoặc guest (localStorage).

## F5. Flashcard (SRS) & kiểm tra

**Flashcard**
- Thuật toán **FSRS** (`ts-fsrs`). Đánh giá 4 mức: Again / Hard / Good / Easy.
- Kiểu thẻ: lật (front/back), chọn đáp án, gõ đáp án (wanakana chuyển kana), nghe → chọn, cloze trong câu ví dụ.
- Chiều thẻ: Nhật → nghĩa, nghĩa → Nhật, kanji → cách đọc.
- Hàng đợi ôn hằng ngày, giới hạn thẻ mới/ngày, phát hiện "leech" (thẻ sai nhiều lần).
- Tạo deck tùy chỉnh (P2), import/export CSV/Anki (P3).

**Kiểm tra**
- Test cuối bài (10–15 câu từ bài đó).
- Test tổng hợp nhiều bài đã học.
- **Mock JLPT N5** có hẹn giờ: 文字・語彙, 文法・読解, 聴解 (P2).
- Kết quả: điểm theo skill tag (vocab, kanji, grammar, listening), xem lại câu sai + giải thích.

**Acceptance criteria**
- [ ] Câu hỏi test chỉ lấy từ nội dung người dùng đã học (trừ mock JLPT).
- [ ] Mỗi câu trả lời lưu `skill_tags` để F7 dùng.
- [ ] Unit test cho wrapper FSRS (lịch ôn tăng dần khi chọn Good liên tiếp).

## F6. Test với AI

- AI **sinh câu hỏi mới** chỉ từ vocab/grammar người dùng đã mở khóa (danh sách item được truyền vào prompt; output validate bằng zod).
- AI **chấm câu tự luận** (dịch câu, đặt câu), trả lời: đúng/sai, sửa lỗi, giải thích bằng ngôn ngữ giao diện.
- Câu hỏi sinh ra được lưu (`ai_generated_items`), review được ở admin, tái dùng cho người khác → giảm chi phí.
- Giai đoạn đầu chạy bằng **mock provider** (trả fixtures cố định).

**Acceptance criteria**
- [ ] Output không hợp lệ schema → retry 1 lần, rồi fallback sang câu hỏi tĩnh.
- [ ] Có quota theo user/ngày.

## F7. AI learning mode (adaptive path)

**Mục tiêu:** sau mỗi phiên, hệ thống đề xuất "Hôm nay nên học gì" + lý do.

**Thuật toán (2 tầng):**
1. **Rule-based (luôn chạy, rẻ, có thể kiểm thử):**
   - Thẻ SRS đến hạn > ngưỡng → ưu tiên ôn.
   - Skill tag có tỉ lệ sai cao trong 7 ngày → đề xuất bài ôn kỹ năng đó.
   - Bài kế tiếp chưa học → học mới.
   - Đầu ra: danh sách hoạt động có điểm ưu tiên.
2. **LLM (tùy chọn):** nhận tóm tắt tiến độ (không gửi dữ liệu cá nhân thừa) → viết lời nhận xét, giải thích, tạo bài ôn cá nhân hóa.

**Acceptance criteria**
- [ ] Tắt AI → tầng rule-based vẫn đưa ra đề xuất.
- [ ] Unit test cho bộ chấm điểm ưu tiên.

## F8. AI chat tutor

- Chatbox streaming, giữ lịch sử theo thread.
- Chế độ: hỏi đáp ngữ pháp, dịch & giải thích, **roleplay** (konbini, phỏng vấn xin việc, nhà máy, nhà hàng, kaigo).
- Tin nhắn AI có thể bấm vào từ → mở WordCard, phát âm (TTS).
- System prompt giới hạn chủ đề học tiếng Nhật; nói tiếng Việt/Anh theo locale.
- Quota tin nhắn/ngày; rate limit.
- Chạy với mock provider trước (trả lời mẫu stream từng chữ).

## F9. Voice (TTS)

- **Mặc định:** Web Speech API `speechSynthesis` với voice `ja-JP` của thiết bị. Không có voice ja-JP → hiện thông báo + gợi ý bật cloud voice.
- **Cloud voice:** nếu user/admin cấu hình `voiceId` (fish.audio `reference_id`) → client gọi `/api/tts` → server proxy tới fish.audio (key không bao giờ lộ ra client).
- Cache audio theo `sha256(text + voiceId + model)` (object storage hoặc DB `audio_cache`) → mỗi câu chỉ tốn tiền 1 lần.
- Điều khiển: tốc độ (0.5x–1.25x), lặp lại.
- Chi tiết: [05-AI-SPEECH](./05-AI-SPEECH.md#2-tts).

## F10. Chấm phát âm (speech-to-text)

- Chế độ **shadowing**: nghe câu mẫu → ghi âm → chấm.
- Pipeline: audio → STT → chuyển hiragana → tách mora → so sánh Levenshtein theo mora với câu mẫu → điểm 0–100 + highlight mora sai.
- Provider STT có interface riêng; bắt đầu bằng `mock` và `webspeech` (Chrome/Edge/Safari), sau đó Azure Pronunciation Assessment (hỗ trợ ja-JP) / fish.audio ASR / Whisper.
- Xin quyền micro rõ ràng; không lưu audio mặc định (chỉ lưu điểm).
- Chi tiết: [05-AI-SPEECH](./05-AI-SPEECH.md#3-stt--chấm-phát-âm).

## F11. Học qua bài hát

- Trình phát YouTube (IFrame API, `youtube-nocookie.com`) + lyrics dạng **LRC / Enhanced LRC** (timestamp từng từ).
- Highlight dòng hiện tại và từng từ theo `player.getCurrentTime()` (vòng `requestAnimationFrame` khi đang phát).
- **Từ đáng chú ý** được đánh dấu màu (theo JLPT level / từ chưa học). Bấm từ → WordCard popover → thêm vào SRS.
- Hiển thị furigana / romaji / bản dịch vi-en theo toggle.
- **Chế độ điền lỗ** (kiểu Lyricstraining): ẩn 10/25/50/100% từ, người dùng gõ hoặc chọn khi bài hát dừng.
- Chỉnh offset đồng bộ ±; lặp 1 dòng; giảm tốc độ.
- Nội dung: **chỉ bài có quyền sử dụng** (đồng dao public domain, bài Creative Commons, nội dung có license). Xem [ADR 0006](./adr/0006-song-content-policy.md).

## F12. Sharing widget (iframe)

**Nhúng Japky vào web khác**
- Route `/embed/[type]/[id]`: `word-of-the-day`, `kanji/[char]`, `word/[id]`, `streak/[userPublicId]`, `kana-quiz`.
- Không dùng cookie đăng nhập, chỉ đọc dữ liệu công khai, CSP `frame-ancestors *`.
- Trang "Get embed code": chọn widget, theme, ngôn ngữ, kích thước → copy `<iframe>`.
- Endpoint **oEmbed** `/api/oembed` + thẻ discovery → dán link vào WordPress/Notion tự thành widget.
- Tự co chiều cao bằng `postMessage` (có kiểm tra origin).

**Nhúng nội dung web khác vào Japky**
- Component `<SafeEmbed>`: chỉ cho domain trong allowlist (YouTube, Spotify…), `sandbox`, `referrerpolicy`, lazy-load facade.

## F13. Component từ vựng (WordCard)

Một component, nhiều **variant** từ cơ bản đến mở rộng. Tất cả dùng chung kiểu dữ liệu `Word` ([04-DATA-MODEL](./04-DATA-MODEL.md#2-content-schema)).

| Variant | Hiển thị | Dùng ở |
|---------|----------|--------|
| `inline` | Từ với `<ruby>` furigana | Trong câu, lyrics, chat |
| `compact` | Từ + kana + nghĩa 1 dòng | Danh sách từ |
| `card` | Kanji, furigana, romaji, **Hán-Việt**, loại từ, nghĩa vi/en, pitch accent, nút audio, 1–3 ví dụ (có furigana + dịch) | Bài học |
| `detail` | `card` + stroke order từng kanji, từ liên quan, ghi chú, nút thêm SRS, link trang từ | Trang từ, popover |
| `flashcard` | Mặt trước / mặt sau, lật bằng click/space | SRS |
| `embed` | Bản gọn cho iframe, có link về Japky | Widget |

**Toggle hiển thị** (lưu trong user settings): furigana, romaji, Hán-Việt, nghĩa. Ví dụ: người học nâng cao tắt romaji.

**Ràng buộc dữ liệu:** mỗi `Word` bắt buộc có `reading`, `romaji`, nghĩa vi + en, và **≥ 1 ví dụ** có bản dịch. Script build content fail nếu thiếu.

**Acceptance criteria**
- [ ] Storybook-like trang `/dev/word-card` hiện mọi variant (chỉ môi trường dev).
- [ ] Mọi variant render được trên server (không cần JS để thấy nội dung) trừ phần tương tác.
- [ ] Contrast và kích thước chữ đạt WCAG AA; furigana đọc được trên mobile.

## F14. Backlog (P2/P3)

| Tính năng | Ưu tiên |
|-----------|---------|
| Từ điển tra nhanh (JMdict) + tra bằng viết tay | P2 |
| Chế độ đọc truyện/tin dễ (graded reader), tap-to-define | P2 |
| League tuần, quest, badge, XP | P2 |
| PWA offline cho deck đã tải | P2 |
| Admin CMS nội dung (sửa bài, sửa furigana sai) | P2 |
| Pitch accent đồ thị | P2 |
| Luyện viết tay kanji (so nét với KanjiVG) | P2 |
| Friend streak, lớp học cho giáo viên | P3 |
| Video có phụ đề song ngữ | P3 |
