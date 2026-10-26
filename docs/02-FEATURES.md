# 02 – Đặc tả tính năng

> Cập nhật 2026-10-26 theo [review panel](./REVIEW-2026-10-26.md).

Mức ưu tiên: **P0** = public beta, **P1** = v1 sau beta, **P2** = sau v1, **P3** = ý tưởng. Tính năng đánh dấu **beta** chạy sau feature flag và có giới hạn.

## Traceability: yêu cầu gốc → tính năng → phase

| Yêu cầu gốc | Mục | Phase |
|-------------|-----|-------|
| Web 2 ngôn ngữ vi/en | [03-ARCHITECTURE §i18n](./03-ARCHITECTURE.md#4-i18n) | 0 |
| Next.js TypeScript | [03-ARCHITECTURE](./03-ARCHITECTURE.md) | 0 |
| Giao diện trực quan, tiện ích | [F0](#f0-first-run-onboarding--màn-hình-today), [06-UI-UX](./06-UI-UX.md) | 0–1 |
| Các bảng chữ cái | [F1](#f1-bảng-chữ-cái-kana) | 1 |
| Check-in daily, giữ streak | [F2](#f2-daily-check-in--streak) | 1 |
| Kanji chia nhiều ngành nghề | [F3](#f3-kanji--từ-vựng-theo-jlpt-và-ngành-nghề) | 2, 5 |
| Bài học N5 | [F4](#f4-bài-học-n5) | 2, 5, 7 |
| Chế độ kiểm tra, thẻ | [F5](#f5-flashcard-srs--kiểm-tra) | 2 |
| Sharing widget (iframe) | [F12](#f12-sharing-widget-iframe) | 3 |
| Test dựa trên bài học + test AI | [F5](#f5-flashcard-srs--kiểm-tra), [F6](#f6-test-với-ai-beta) | 2–3 |
| Voice đọc (thiết bị / fish.audio) | [F9](#f9-voice-tts) | 1, 3 |
| Học theo chế độ AI | [F7](#f7-ai-learning-mode-adaptive-path) | 1–3 |
| Học qua bài hát + lyrics + highlight (v1 LRCLIB, v2 engine YouTube, AI trích keyword) | [F11](#f11-học-qua-bài-hát) | 6 (v1), v2 |
| Thẻ từ vựng đủ phiên âm, ví dụ; component nhiều mode | [F13](#f13-component-từ-vựng-wordcard) | 2 |
| Thư viện open-source kanji→romaji | [ADR 0003](./adr/0003-precompute-furigana-romaji.md) | 2 |
| Chatbox AI | [F8](#f8-ai-chat-tutor-beta) | 5 |
| Speech-to-text chấm phát âm | [F10](#f10-chấm-phát-âm-beta) | 6 |
| Extendable, SEO, tối ưu, bảo mật | [08-NFR](./08-NFR.md) | 0–7 |
| Giao diện sáng, 2 mode Full/Minimal | [06-UI-UX](./06-UI-UX.md) | 0 |
| Âm thanh cho action | [06-UI-UX §Âm thanh](./06-UI-UX.md#5-âm-thanh-action) | 0–1 |
| AI provider đổi được (OpenAI, Gemini, Claude, MotAPI, GitHub Models thay Copilot), mock trước, gateway sau | [05-AI-SPEECH](./05-AI-SPEECH.md), [ADR 0010](./adr/0010-ai-provider-strategy.md) | 3 |

---

## F0. First-run, onboarding & màn hình Today

**First-run (không cần đăng ký)**
- Landing có quiz 5 câu hiragana chạy ngay. Kết quả kiêm **placement thô**: chưa biết gì / đã biết kana / đã học một phần N5.
- Sau quiz hỏi 3 câu: đã biết gì, mục tiêu (JLPT / Tokutei Ginou theo ngành / IT), daily goal.
- Người dùng là **anonymous user** ([ADR 0009](./adr/0009-anonymous-guest-users.md)). Chỉ khi bấm "Lưu tiến độ" mới hiện đăng ký, cổng tuổi 16+ và consent.
- Người đã biết kana / một phần N5: làm **placement test** ngắn (~3 phút) để bỏ qua kana hoặc mở khóa bài.

**Màn hình Today (`/[locale]/home`)**
- 1 nút chính lớn "Tiếp tục" + tối đa 3 thẻ: ôn tập đến hạn, bài tiếp theo, 1 mục thêm (kanji hôm nay / bài hát).
- Streak là chip nhỏ góc trên, không phải tiêu điểm.
- Hết thẻ ôn → hiện trạng thái hoàn thành (không phải trang trống).
- Danh sách việc lấy từ adaptive rule-based ([F7](#f7-ai-learning-mode-adaptive-path)).

**Điều hướng mobile:** bottom nav 4 tab: **Hôm nay / Học / Ôn / Tôi**. Bài hát, Chat, Luyện nói nằm trong "Học".

**Acceptance criteria**
- [ ] Khách làm xong quiz đầu tiên không cần nhập gì.
- [ ] Đăng ký sau khi đã học → tiến độ giữ nguyên.
- [ ] Người dùng chọn "đã biết kana" + qua placement → không bị bắt học lại kana.

## F1. Bảng chữ cái (Kana)

**Mô tả.** Hiragana và Katakana đầy đủ: 46 âm cơ bản, dakuten/handakuten (が, ぱ), yōon (きゃ), kana nhỏ (っ, ゃ), âm dài (ー), katakana mở rộng (ファ, ティ, ヴ) ở P1.

**Chức năng**
- Bảng tương tác dạng lưới gojūon. Bấm ô → phát âm + stroke order (KanjiVG có cả kana).
- Mnemonic hình ảnh (P1).
- Quiz: chọn romaji đúng (1 đáp án + 4 nhiễu, xáo trộn – port logic từ `src/screens/LearningScreen.js` của app Expo cũ), nghe → chọn kana, gõ romaji → tự chuyển kana (wanakana), quiz ngược.
- Chọn hàng muốn luyện; tracking độ chính xác từng chữ; chữ hay sai đưa vào SRS.
- Có **bài kiểm tra bỏ qua kana**.

**Acceptance criteria**
- [ ] ≥ 104 mục hiragana và ≥ 104 mục katakana.
- [ ] Mỗi mục có romaji Hepburn, audio pre-generate, stroke order.
- [ ] Quiz không bao giờ có 2 đáp án trùng nhau.
- [ ] Dùng được hoàn toàn bằng bàn phím.

## F2. Daily check-in & streak

**Mô tả.** Một "ngày học" được tính khi đạt **daily goal** (XP) hoặc check-in sau ≥ 1 hoạt động.

**Chức năng**
- Streak hiện tại, dài nhất, lịch heatmap.
- **Streak freeze:** tự tặng **1 freeze mỗi tuần** (giữ tối đa 2); tự dùng khi lỡ 1 ngày.
- **Mục tiêu tuần** (ví dụ 4/7 ngày) là lựa chọn thay cho streak hằng ngày.
- Daily goal: casual 10 / regular 20 / serious 50 XP.
- Ăn mừng mốc 3 / 7 / 30 ngày (hiệu ứng + âm thanh).
- Nhắc học: email (Resend, opt-in) ở P1; web push P2; Zalo LATER.
- Share card ảnh streak (OG image on-demand) P1.
- **Không dark pattern:** không bán phục hồi streak, không thông báo gây cảm giác tội lỗi.

**Quy tắc**
- Lưu timezone IANA. "Ngày học" = ngày địa phương, rollover **04:00**. `local_date` tính trên server.
- `study_days(user_id, local_date)` unique; ghi bằng upsert `xp = xp + excluded.xp` (an toàn khi nhiều sự kiện cùng lúc).
- Streak là **pure function** `(study_days, freezes, timezone, now) → streak`, tính khi đọc. Freeze áp dụng lười khi phát hiện khoảng trống.
- Chỉ cho đổi timezone 1 lần/ngày.

**Acceptance criteria**
- [ ] 23:59 và 00:01 giờ địa phương → 2 ngày khác nhau; 02:00 → vẫn tính ngày hôm trước.
- [ ] Lỡ 1 ngày khi còn freeze → streak giữ nguyên, freeze giảm 1.
- [ ] Người dùng ngừng học → streak hiển thị 0 ngay (không còn giá trị cũ).
- [ ] Unit test (có property-based) cho DST và đổi timezone.

## F3. Kanji & từ vựng theo JLPT và ngành nghề

**Mô tả.** Kanji và từ vựng nhóm thành **pack**: theo cấp JLPT và theo ngành nghề.

**Pack ngành nghề**

| Nhóm | Pack | Ưu tiên |
|------|------|---------|
| Tokutei Ginou | **Kaigo (介護) – điều dưỡng** | P1 (pack ngành đầu tiên) |
| | Food service (外食) – nhà hàng | P1 |
| | Chế tạo sản phẩm công nghiệp – nhà máy | P2 |
| | Xây dựng, nông nghiệp, chế biến thực phẩm, khách sạn, ô tô | P2 |
| | Vệ sinh tòa nhà, đóng tàu, hàng không, ngư nghiệp, đường sắt, lâm nghiệp, gỗ | P3 |
| Bổ sung | IT / kỹ sư | P1 |
| | Văn phòng / keigo / email, đời sống | P2 |

Ví dụ nội dung: kaigo (食事・入浴・排泄, bộ phận cơ thể), nhà máy (安全, 危険, 禁止, 検査, 5S), nhà hàng (注文, 会計, dị ứng), IT (設計, 実装, 障害, 仕様).

**Mỗi kanji có:** chữ, on'yomi, kun'yomi, **Hán-Việt**, nghĩa vi/en, bộ thủ, số nét, stroke order, cấp JLPT, ngành liên quan, từ ví dụ (WordCard), luyện viết (P2).

**Acceptance criteria**
- [ ] 100% kanji N5 có Hán-Việt đã review tay.
- [ ] Trang `/[locale]/kanji/[char]` là trang tĩnh, có metadata SEO.
- [ ] Mỗi pack thêm toàn bộ vào SRS bằng 1 nút.

## F4. Bài học N5

**Nhịp bài:** 6–8 bước (5–7 từ mới mỗi nhóm, nhận diện, ngữ pháp, luyện, mini test), **15–18 từ/bài**. Khoảng **600 từ** nằm trong 30 bài; phần còn lại của danh sách N5 là deck SRS tùy chọn. Kanji được **phân vào từng bài** (theo tần suất và bộ thủ đã học), ~3–4 kanji/bài.

**Lộ trình đề xuất (~30 bài):**

| Bài | Chủ đề | Ngữ pháp chính |
|-----|--------|----------------|
| 0 | Hiragana, Katakana | – |
| 1 | Chào hỏi, tự giới thiệu | 〜は〜です, じゃありません, か |
| 2 | Đồ vật | これ/それ/あれ, の |
| 3 | Địa điểm | ここ/そこ/あそこ, どこ |
| 4 | Số đếm, thời gian | 〜時〜分, から〜まで |
| 5 | Hành động hằng ngày | 〜ます / ません / **ました** / ませんでした, を |
| 6 | Di chuyển | 行きます/来ます, へ, で (phương tiện) |
| 7 | Tồn tại | あります/います, に |
| 8 | Nơi hành động, rủ rê | で (nơi chốn), ませんか, ましょう |
| 9–10 | Tính từ い / な | Chia tính từ (cả quá khứ), とても/あまり |
| 11 | Sở thích, khả năng | が好き, が分かる |
| 12–15 | Số lượng, so sánh | 〜つ, trợ số từ, より, 一番 |
| 16–20 | Thể て | 〜てください, 〜ています, 〜てもいい |
| 21–25 | Thể ない, từ điển | 〜ないでください, 〜ことができる |
| 26–30 | Thể た, ôn tập | 〜たことがある, tổng ôn |

**Mỗi bài gồm:** mục tiêu, từ vựng (WordCard), ngữ pháp (giải thích tiếng Việt trước; tiếng Anh sau), hội thoại mẫu có audio, bài tập (chọn, sắp xếp câu, điền, **nghe**), mini test. Tự lưu khi thoát, tiếp tục giữa bài. Hoàn thành bài → mở khóa bài tiếp + đưa từ và mẫu ngữ pháp vào SRS.

**Mở rộng:** `content/levels/{n5,n4,...}/lessons/NN-slug.json`. Nội dung JFT-Basic là một level riêng trong tương lai.

**Acceptance criteria**
- [ ] Bài học là nội dung tĩnh (SSG); phần ngữ pháp có trang SEO riêng.
- [ ] Mỗi bài ≤ 18 từ mới, có ≥ 1 bài tập nghe.

## F5. Flashcard (SRS) & kiểm tra

**Flashcard**
- **FSRS** (`ts-fsrs`). 4 mức: Again / Hard / Good / Easy.
- Kiểu thẻ: lật, chọn đáp án, gõ đáp án (wanakana), nghe → chọn, cloze.
- **Thẻ ngữ pháp:** câu cloze có mẫu ngữ pháp cần điền (kiểu Bunpro).
- **Thẻ nghe:** phát audio pre-generate → chọn nghĩa / chọn câu.
- Ban đầu mỗi item chỉ có **1 thẻ nhận diện**; chiều "nghĩa → Nhật" và "kanji → cách đọc" mở khi thẻ đã mature.
- Giới hạn thẻ mới/ngày, phát hiện leech. Deck tùy chỉnh P2, import/export P3.

**Kiểm tra**
- Test cuối bài (10–15 câu), test tổng hợp, **mock JLPT N5** có hẹn giờ (P1), mock JFT-Basic (P2).
- Kết quả theo skill tag (vocab, kanji, grammar, listening), xem lại câu sai + giải thích.

**Acceptance criteria**
- [ ] Câu hỏi test chỉ lấy từ nội dung đã học (trừ mock).
- [ ] Mỗi câu trả lời lưu `skill_tags` cho F7.
- [ ] Unit test cho wrapper FSRS.

## F6. Test với AI (beta)

- AI sinh câu hỏi chỉ từ vocab/grammar người dùng đã mở khóa; output validate zod.
- AI chấm câu tự luận (dịch, đặt câu): đúng/sai, sửa lỗi, giải thích theo ngôn ngữ giao diện.
- Câu hỏi sinh ra lưu ở `ai_generated_items`; **chỉ câu đã `approved` mới được dùng lại cho người khác**.
- Giới hạn: chỉ người dùng đăng nhập (16+), **5 lượt sinh/ngày**.
- Chạy qua `mock` trước, sau đó adapter `openai-compatible` ([05](./05-AI-SPEECH.md)).

**Acceptance criteria**
- [ ] Output sai schema → retry 1 lần → fallback câu hỏi tĩnh.
- [ ] Kill-switch tắt AI → tính năng ẩn đi, phần còn lại của app vẫn chạy.

## F7. AI learning mode (adaptive path)

**Mục tiêu:** đề xuất "Hôm nay nên học gì" + lý do. Đây là nguồn dữ liệu của màn hình Today ([F0](#f0-first-run-onboarding--màn-hình-today)).

1. **Rule-based (P0, luôn chạy):**
   - Thẻ SRS đến hạn > ngưỡng → ưu tiên ôn.
   - Skill tag sai nhiều trong 7 ngày → bài ôn kỹ năng đó.
   - Bài kế tiếp chưa học → học mới.
   - Đầu ra: danh sách hoạt động có điểm ưu tiên.
2. **LLM (beta):** nhận tóm tắt tiến độ (không gửi PII) → 1–2 câu nhận xét, bài ôn cá nhân hóa.

**Acceptance criteria**
- [ ] Tắt AI → rule-based vẫn đưa ra đề xuất.
- [ ] Unit test cho bộ chấm điểm ưu tiên.

## F8. AI chat tutor (beta)

- Chatbox streaming (Route Handler SSE), lịch sử theo thread.
- Beta: **chỉ hỏi đáp ngữ pháp / dịch & giải thích**, **20 tin/ngày**, người dùng đăng nhập 16+. Roleplay (konbini, phỏng vấn, nhà máy, kaigo) làm sau.
- Từ tiếng Nhật trong câu trả lời render bằng `WordCard inline` (AI xuất markup furigana, validate bằng zod).
- Audio câu trả lời dùng voice thiết bị (không gọi fish.audio).
- System prompt giới hạn chủ đề; trả lời theo locale.

## F9. Voice (TTS)

- **Nội dung học:** audio **pre-generate** lúc ingest (fish.audio, voice đã có giấy đồng ý), lưu R2, URL bất biến. Không tốn chi phí runtime.
- **Text động** (câu AI, câu người dùng): mặc định `speechSynthesis` `ja-JP` của thiết bị; không có voice → thông báo.
- **Cloud voice theo `voiceId`:** người dùng chọn voice trong **allowlist do admin quản lý**. `/api/tts` chỉ cho người dùng đăng nhập, chỉ đọc **text do server tạo** (id nội dung hoặc id tin nhắn AI), có quota, có cache.
- Tốc độ 0.5x–1.25x, lặp lại.
- Chi tiết: [05-AI-SPEECH §2](./05-AI-SPEECH.md#2-tts).

## F10. Chấm phát âm (beta)

- Chế độ shadowing: nghe → ghi âm → chấm.
- Beta: **Web Speech API** (Chrome/Edge/Safari), **chỉ chấm từ đơn**, người dùng đăng nhập 16+. Trước lần ghi âm đầu tiên hiện thông báo: **audio được gửi tới Google** để nhận dạng; cần consent.
- Pipeline: STT → hiragana → tách mora → Levenshtein theo mora → điểm 0–100 + highlight mora sai.
- Chỉ lưu điểm, không lưu audio.
- Provider khác (Azure Pronunciation Assessment, fish ASR, Whisper) qua interface `SttProvider` ở P2.
- Chi tiết: [05-AI-SPEECH §3](./05-AI-SPEECH.md#3-stt--chấm-phát-âm).

## F11. Học qua bài hát

Xem [ADR 0012](./adr/0012-song-source-and-engine.md). Ở v1 tạm chưa xử lý bản quyền theo quyết định của chủ dự án (rủi ro ghi ở [07 §4](./07-CONTENT-LICENSING.md#4-bài-hát)).

### Trải nghiệm học (chung cho v1 và v2)
- Trình phát **YouTube IFrame API** (`youtube-nocookie.com`). Lyrics hiển thị **bên cạnh / bên dưới** player, không che player.
- Highlight dòng hiện tại theo `player.getCurrentTime()` (vòng `requestAnimationFrame` khi đang phát, tìm nhị phân theo timestamp). Có timestamp từng từ (Enhanced LRC) thì highlight cả từ.
- Mỗi dòng có furigana / romaji / bản dịch vi-en (toggle).
- **Keyword học** (do AI trích ở F11.3) được tô màu theo cấp JLPT. Từ người dùng đã học thì nhạt đi (lọc phía client theo thẻ SRS). Bấm từ → WordCard popover → thêm vào SRS.
- **Chế độ điền lỗ:** ẩn 10/25/50/100% keyword; dừng nhạc cuối dòng để người dùng gõ hoặc chọn.
- Chỉnh offset ±; lặp 1 dòng; tốc độ 0.75x (`setPlaybackRate`).
- Sau bài: tóm tắt keyword đã gặp → "Thêm tất cả vào SRS".

### F11.1 v1 – Nguồn lyrics public: LRCLIB
- **Nguồn lyrics + timeline:** [LRCLIB](https://lrclib.net) – API public, miễn phí, không cần key, trả `syncedLyrics` (LRC theo dòng) và `plainLyrics`.
  - `GET /api/get?track_name=&artist_name=&album_name=&duration=` – khớp chính xác (thời lượng sai lệch tối đa ±2 s).
  - `GET /api/search?q=` hoặc `?track_name=&artist_name=` – tìm kiếm.
  - Gửi header `User-Agent` nhận diện app (LRCLIB yêu cầu).
- **Danh sách bài do curator chọn:** mỗi bài trong `content/songs/<slug>.json` khai báo `youtubeId` + tên bài / ca sĩ / thời lượng. Script `build-songs.ts` lúc ingest:
  1. Gọi LRCLIB lấy `syncedLyrics` (ưu tiên) hoặc `plainLyrics`.
  2. Parse LRC → `lines[{ t, text }]`; sinh `segments` (furigana) + romaji bằng kuroshiro.
  3. Gọi AI mode `lyrics-keywords` ([F11.3](#f113-ai-trích-keyword-từ-lyrics-v1--v2)) → `keywords`.
  4. Ghi kết quả vào `content/songs/<slug>.json`. Người review chỉnh offset, keyword, bản dịch qua PR.
- Bài chỉ có `plainLyrics` (không timestamp) → hiện lyrics tĩnh, không highlight, đánh dấu chờ engine v2.
- Không gọi LRCLIB lúc runtime ở v1 → trang bài hát vẫn SSG, không phụ thuộc uptime của LRCLIB.
- Mục tiêu v1: 20–30 bài J-pop / anime / ballad dễ nghe, phân theo độ khó.

### F11.2 v2 – Song engine: người dùng chọn video YouTube
Người dùng dán link YouTube → hệ thống tự chuẩn bị bài học. Chạy như job nền, có trạng thái hiển thị cho người dùng.

```
YouTube URL
  → [1] Lấy metadata (YouTube Data API v3: videos.list)
  → [2] Có phải nhạc không?
  → [3] Tìm lyrics + timeline: cache → LRCLIB get → LRCLIB search
  → [4] Không có timeline → engine tự xây (tách vocal → ASR → căn timeline)
  → [5] Furigana/romaji + AI trích keyword
  → [6] Lưu song_tracks, mở bài học
```

1. **Metadata:** `snippet.title`, `snippet.channelTitle`, `snippet.categoryId`, `contentDetails.duration`. Chặn video quá dài (> 10 phút) hoặc livestream.
2. **Nhận diện nhạc** (kết hợp, cho điểm tin cậy):
   - `categoryId == "10"` (Music).
   - Kênh dạng "<Artist> - Topic", "VEVO", hoặc tiêu đề có mẫu `Artist - Title`, `「…」`, `MV`, `Official`.
   - Tách artist / title từ tiêu đề (rule + LLM mode `song-metadata` khi rule không chắc).
   - Không phải nhạc → báo người dùng, dừng.
3. **Tìm lyrics:** cache `song_tracks` theo `youtube_id` → LRCLIB `/api/get` (title, artist, duration ±2 s) → `/api/search` với các biến thể tên (kanji / kana / romaji, bỏ "feat.", "(TV size)"…). Có `syncedLyrics` → sang bước 5.
4. **Engine tự xây** (worker Python có GPU, tách khỏi Next.js):
   - Lấy audio của video → **tách vocal** (Demucs / htdemucs).
   - Đã có `plainLyrics` → **forced alignment** lyrics vào audio (stable-ts `align` hoặc CTC aligner) → timestamp theo dòng và theo từ.
   - Không có lyrics → **ASR tiếng Nhật** có word timestamp (Whisper large-v3 / kotoba-whisper qua WhisperX hoặc stable-ts) → lyrics do máy nghe ra, gắn nhãn "độ tin cậy thấp", người dùng báo sửa được.
   - Xuất Enhanced LRC + `confidence`.
   - Tùy chọn: đóng góp ngược kết quả đã được duyệt lên LRCLIB (`POST /api/publish`).
5. **Xử lý văn bản:** segments + romaji, AI `lyrics-keywords`, AI dịch dòng (mode `lyrics-translate`).
6. **Lưu & chia sẻ:** `song_tracks` dùng chung cho mọi người dùng (bài đã xử lý thì lần sau có ngay). Người dùng có danh sách bài của mình.

**Giới hạn:** chỉ người dùng đăng nhập; quota job engine/ngày (tốn GPU); kill-switch như AI.

### F11.3 AI trích keyword từ lyrics (v1 + v2)
- Mode AI `lyrics-keywords` ([05 §1](./05-AI-SPEECH.md#1-ai-provider-abstraction)). Input: các dòng lyrics (đặt trong delimiter, coi là data), cấp mục tiêu (N5…), locale. Output (zod):
  `keywords[{ surface, lemma, reading, lineIndex, charStart, charEnd, jlpt, pos, meaning{vi,en}, reason }]`.
- Hậu xử lý: map `lemma` → id JMdict (có thì dùng WordCard đầy đủ; không có thì thẻ tạm từ output AI, gắn nhãn "AI"). Bỏ keyword không tìm thấy trong dòng lyrics tương ứng (chống bịa).
- Ưu tiên: từ thuộc cấp mục tiêu, từ hay gặp, mẫu ngữ pháp (〜たい, 〜ている…), cách nói đặc trưng trong lời bài hát (君, 僕, 〜ね).
- **Fallback khi AI tắt / mock:** rule-based – tách từ, giữ từ có trong danh sách JLPT, xếp theo cấp và tần suất.
- v1 chạy lúc ingest (kết quả review qua PR). v2 chạy trong job engine, lưu vào `song_tracks.keywords`.
- Cá nhân hóa (lọc từ đã học, theo cấp người dùng) làm phía client, không gọi lại AI.

**Acceptance criteria**
- [ ] v1: ≥ 20 bài có `syncedLyrics`, lệch đồng bộ < 300 ms sau khi chỉnh offset.
- [ ] Mọi keyword trỏ đúng vị trí trong dòng lyrics (test `charStart/charEnd`).
- [ ] AI tắt → vẫn có keyword từ rule-based.
- [ ] v2: link YouTube không phải nhạc bị từ chối; bài có trên LRCLIB xử lý xong < 15 s; bài cần engine có trạng thái tiến độ và thông báo khi xong.

## F12. Sharing widget (iframe)

**Nhúng Japky vào web khác**
- v1: `/embed/kanji/[char]` (tĩnh, SSG). Sau đó: `word/[id]`, `word-of-the-day`.
- `/embed/streak/[publicId]`: **opt-in, mặc định tắt**, id ngẫu nhiên đổi được.
- Không cookie, chỉ dữ liệu công khai, layout riêng không có app shell, CSP `frame-ancestors *` chỉ cho `/embed/*`.
- Trang "Lấy mã nhúng": chọn widget, theme, ngôn ngữ → copy `<iframe>`.
- `postMessage` chỉ gửi chiều cao, không lắng nghe message.
- oEmbed: LATER.

**Nhúng nội dung web khác vào Japky**
- `<SafeEmbed>`: chỉ domain trong allowlist, `sandbox`, `referrerpolicy`, lazy-load facade. Chưa dùng ở v1.

## F13. Component từ vựng (WordCard)

Một component, **4 layout × 3 density**. Density là mặt nạ ẩn/hiện trường dữ liệu, không phải 12 thiết kế riêng. Dùng chung kiểu `Word` ([04](./04-DATA-MODEL.md#2-content-schema)).

| Layout | Dùng ở |
|--------|--------|
| `inline` | Trong câu, lyrics, chat (`<ruby>` furigana) |
| `row` | Danh sách từ |
| `card` | Bài học, trang từ, popover, widget (`context="embed"`) |
| `flashcard` | SRS (mặt trước / sau) |

| Density | Trường hiển thị |
|---------|-----------------|
| `basic` | Từ, furigana, nghĩa |
| `standard` | + romaji, **Hán-Việt**, loại từ, nút audio, 1 ví dụ |
| `extended` | + pitch accent, 2–3 ví dụ, stroke order từng kanji, từ liên quan, ghi chú, nút SRS |

**Phase 2 làm:** `inline`, `card` (3 density), `flashcard`. `row` sau.

**Toggle hiển thị** (lưu trong settings):
- Furigana 3 trạng thái: luôn hiện / chỉ kanji chưa học / ẩn.
- Romaji bật cho tới khi xong kana, sau đó hỏi 1 lần "Ẩn romaji?".
- Hán-Việt mặc định bật với locale vi, tắt với en.
- Bật/tắt không làm nhảy layout (giữ chỗ ruby, đổi `visibility`).

**Ràng buộc dữ liệu:** mỗi `Word` bắt buộc có `reading`, `romaji`, nghĩa vi + en, **≥ 1 ví dụ** có bản dịch. Build fail nếu thiếu.

**Acceptance criteria**
- [ ] Trang `/dev/word-card` (chỉ môi trường dev) hiện mọi tổ hợp layout × density.
- [ ] Mọi layout render được trên server, trừ phần tương tác.
- [ ] Đạt WCAG AA; furigana ≥ 11px trên mobile.

## F14. Backlog

| Tính năng | Ưu tiên |
|-----------|---------|
| Mock JFT-Basic | P2 |
| Từ điển tra nhanh (JMdict) + tra viết tay | P2 |
| Graded reader, tap-to-define | P2 |
| Pitch accent đồ thị | P2 |
| Luyện viết tay kanji (so nét KanjiVG) | P2 |
| Roleplay AI | P2 |
| Song engine v2 (YouTube → lyrics/timeline tự động) | v2 |
| Nhắc học qua Zalo | LATER |
| League, quest, badge | LATER |
| oEmbed endpoint | LATER |
| Friend streak, lớp học cho giáo viên | P3 |

**Đã bỏ:** Admin CMS nội dung – sửa nội dung qua PR vào `content/` ([ADR 0008](./adr/0008-git-only-content.md)).
