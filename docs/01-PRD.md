# 01 – Product Requirements (PRD)

> Cập nhật 2026-10-26 theo [review panel](./REVIEW-2026-10-26.md).

## 1. Tầm nhìn

Một website học tiếng Nhật **trực quan, vui, có AI**, viết cho người Việt (và người dùng tiếng Anh), đưa người mới bắt đầu từ bảng chữ cái tới JLPT N5 / JFT-Basic rồi xa hơn. Mỗi ngày học ngắn, có streak giữ động lực, nội dung luôn có phiên âm + ví dụ, và hệ thống biết người học đang ở đâu để gợi ý bài tiếp theo.

## 2. Persona

### Persona chính

| Persona | Mô tả | Mục tiêu thi | Nhu cầu chính |
|---------|-------|--------------|---------------|
| **Lan – lao động Tokutei Ginou / thực tập sinh** | 25 tuổi, chuẩn bị sang Nhật làm kaigo / nhà hàng / nhà máy | **JFT-Basic (A2) hoặc N4** (kaigo cần thêm bài thi tiếng Nhật điều dưỡng). N5 là cột mốc giữa đường | Từ vựng + kanji theo ngành, biển báo an toàn, học trên điện thoại, giải thích tiếng Việt |
| **Minh – sinh viên học JLPT** | 20 tuổi, học N5 để đi du học/làm thêm | JLPT N5 → N4 | Lộ trình rõ ràng, giải thích tiếng Việt, gamification |

### Persona phụ (không thiết kế riêng ở v1)
- **Tuấn – kỹ sư IT:** nhu cầu (keigo, 設計/実装) vượt N5 → pack IT ở phase sau.
- **Alex – người dùng tiếng Anh:** giao diện English có sẵn; nghĩa tiếng Anh lấy từ JMdict; giải thích ngữ pháp tiếng Anh làm sau.

## 3. Điểm khác biệt

1. **Âm Hán-Việt trên mọi kanji.** WaniKani, Bunpro, Anki không có. Chưa có dataset mở → tự build từ Unihan + review tay ([07](./07-CONTENT-LICENSING.md)).
2. **Giải thích ngữ pháp bằng tiếng Việt.**
3. **Kanji / từ vựng theo ngành nghề**, bắt đầu với kaigo.
4. **Học thích ứng**: màn hình "Hôm nay" đề xuất việc cần làm dựa trên tiến độ (rule-based), AI bổ sung lời giải thích.
5. **Học qua bài hát Nhật thật** (J-pop, anime) với lyrics chạy theo nhạc và keyword do AI chọn theo trình độ; v2 cho người dùng tự chọn bài trên YouTube.
6. **AI tutor, test AI, chấm phát âm, widget nhúng** – làm dạng thin slice có giới hạn, sau public beta.

Table stakes (bắt buộc để cạnh tranh với Mazii / Migii): kana, kanji, SRS, list theo cấp, audio, toggle furigana, stroke order, streak, mock test, dark mode.

## 4. Phạm vi

### Public beta (~tuần 13)
- First-run quiz + onboarding, kana, bài N5 1–10, từ vựng/kanji N5 kèm Hán-Việt, WordCard, SRS (từ vựng + ngữ pháp), test cuối bài, streak, audio pre-generate, màn hình Today, song ngữ vi/en, sáng/tối, Full/Minimal, âm thanh action.
- Showcase: AI test + adaptive qua mock và 1 adapter OpenAI-compatible, chuyển provider trong admin, embed thẻ kanji.

### Sau beta (trong v1)
- Pack kaigo, bài N5 11–30, AI chat beta, chấm phát âm beta, pack nhà hàng + IT, PWA.
- **Làm sau cùng:** học qua video nhạc v1 (lyrics từ LRCLIB + YouTube, AI trích keyword).

### v2
- Song engine: người dùng chọn video YouTube → nhận diện nhạc → tìm lyrics + timeline → không có thì engine tự phân tích ([ADR 0012](./adr/0012-song-source-and-engine.md)).

### Ngoài phạm vi v1
- N4 → N1 và nội dung JFT-Basic đầy đủ (cấu trúc dữ liệu đã sẵn sàng).
- App mobile native (PWA là đủ).
- Thanh toán / gói premium.
- Xử lý bản quyền lyrics/bài hát (chủ dự án tạm chưa xét ở v1; rủi ro ghi ở [07 §4](./07-CONTENT-LICENSING.md#4-bài-hát)).
- Người dùng dưới 16 tuổi đăng ký tài khoản.

## 5. Chính sách người dùng & kinh doanh

- **Tuổi:** chỉ người **từ 16 tuổi** được tạo tài khoản và dùng AI/STT. Khách (anonymous) vẫn học được nội dung tĩnh. Lý do: PDPL yêu cầu consent phụ huynh cho trẻ dưới 16 ([ADR 0011](./adr/0011-pdpl-compliance.md)).
- **Kinh doanh:** miễn phí trong beta. Trước launch công khai chuyển hạ tầng và dịch vụ sang gói cho phép thương mại (Vercel Pro, fish.audio commercial).

## 6. User stories chính

- Là người mới, tôi muốn **làm thử vài câu ngay mà không cần đăng ký**, và được xếp đúng trình độ.
- Là người mới, tôi muốn **học và luyện hiragana/katakana** có âm thanh để đọc được chữ trong 1 tuần.
- Là người học, tôi muốn **mở web là biết hôm nay cần làm gì**.
- Là người học, tôi muốn **check-in mỗi ngày và thấy streak** để giữ thói quen.
- Là người học, tôi muốn **mỗi từ vựng có kanji, furigana, romaji, Hán-Việt, nghĩa, ví dụ và audio**.
- Là người học, tôi muốn **ôn từ vựng và mẫu ngữ pháp** đúng lúc sắp quên.
- Là người học, tôi muốn **làm bài test theo bài đã học** và **thi thử**.
- Là người học, tôi muốn **AI giải thích lỗi và gợi ý bài tiếp theo**.
- Là người học, tôi muốn **chat với AI** về ngữ pháp và **được chấm phát âm**.
- Là người học, tôi muốn **nghe bài hát Nhật với lyrics chạy theo nhạc**, bấm vào từ để học.
- Là thợ kaigo tương lai, tôi muốn **học kanji/từ theo ngành của mình**.
- Là blogger / giáo viên, tôi muốn **nhúng thẻ kanji vào website của tôi**.
- Là admin, tôi muốn **đổi AI provider theo từng chế độ** mà không cần deploy lại.

## 7. KPI

Mọi KPI đo bằng event analytics định nghĩa ở [08-NFR §7](./08-NFR.md#7-analytics).

| KPI | Mục tiêu 3 tháng sau public beta | Event nguồn |
|-----|----------------------------------|-------------|
| D1 / D7 / D30 retention | 25–30% / 12% / 6% | `session_start` |
| % hoàn thành first-run quiz | ≥ 60% khách mới | `first_run_completed` |
| % người dùng hoàn thành kana | ≥ 40% | `kana_completed` |
| % hoàn thành 10 bài N5 đầu | ≥ 15% | `lesson_completed` |
| Streak trung vị của người dùng active | ≥ 4 ngày | `study_day_recorded` |
| **Retention khi ôn SRS** (tỉ lệ nhớ đúng) | 85–90% | `review_answered` |
| **Điểm thi thử N5 trung bình** sau bài 30 | ≥ 70% | `test_finished` |
| Chi phí AI / MAU / tháng | ≤ $0.10 | `ai_usage` |
| Lighthouse SEO / Performance / A11y | ≥ 95 / ≥ 90 / ≥ 95 | CI |
