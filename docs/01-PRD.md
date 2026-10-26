# 01 – Product Requirements (PRD)

## 1. Tầm nhìn

Một website học tiếng Nhật **trực quan, vui, có AI**, viết cho người Việt (và người dùng tiếng Anh), đưa người mới bắt đầu từ bảng chữ cái tới JLPT N5 rồi xa hơn. Mỗi ngày học ngắn, có streak giữ động lực, nội dung luôn có phiên âm + ví dụ, và AI biết người học đang ở đâu để gợi ý bài tiếp theo.

## 2. Persona

| Persona | Mô tả | Nhu cầu chính |
|---------|-------|---------------|
| **Minh – sinh viên mới học** | 20 tuổi, học N5 để đi du học/làm thêm | Lộ trình rõ ràng, giải thích tiếng Việt, gamification |
| **Lan – lao động Tokutei Ginou / thực tập sinh** | 25 tuổi, chuẩn bị sang Nhật làm kaigo / nhà hàng / nhà máy | Từ vựng + kanji theo ngành, biển báo an toàn, học trên điện thoại |
| **Tuấn – kỹ sư IT** | 28 tuổi, muốn làm việc với khách Nhật | Kanji IT (設計, 実装, 仕様), keigo email, học nhanh |
| **Alex – người học tiếng Anh** | Người nước ngoài dùng giao diện English | Nội dung song ngữ đầy đủ |

## 3. Điểm khác biệt

1. **Âm Hán-Việt trên mọi kanji.** Các app lớn (WaniKani, Bunpro, Anki) không có. Chưa có dataset mở kanji → Hán-Việt, nên tự build từ Unihan `kVietnamese` + review tay (xem [07](./07-CONTENT-LICENSING.md)).
2. **Giải thích ngữ pháp bằng tiếng Việt.** Phần lớn app lớn chỉ có tiếng Anh.
3. **Kanji / từ vựng theo ngành nghề** (16 lĩnh vực Tokutei Ginou + IT + văn phòng).
4. **AI tutor nói tiếng Việt**, sinh bài test từ nội dung đã học, gợi ý bài tiếp theo.
5. **Học qua bài hát** có lyrics đồng bộ + highlight từ cần học (nội dung hợp pháp).
6. **Widget nhúng** (iframe) word-of-the-day, thẻ kanji, huy hiệu streak.
7. **Chấm phát âm** bằng speech-to-text.

Table stakes (bắt buộc phải có để cạnh tranh với Mazii / Migii): kana, kanji, SRS, list theo JLPT, audio, toggle furigana, stroke order, streak, mock test, dark mode.

## 4. Phạm vi

### Trong phạm vi v1 (N5)
- Bảng chữ cái, bài học N5, từ vựng / kanji N5, flashcard SRS, kiểm tra, streak, voice, song ngữ vi/en, 2 theme sáng/tối, 2 mode UI Full/Minimal, âm thanh action.
- AI (tutor, test, adaptive) chạy qua **mock provider** trước; provider thật cắm sau.
- Pack ngành nghề: 4 ngành đầu (kaigo, nhà hàng, chế tạo, IT).

### Ngoài phạm vi v1
- N4 → N1 (cấu trúc dữ liệu đã sẵn sàng).
- App mobile native (PWA là đủ ở v1).
- Thanh toán / gói premium.
- Lyrics bài hát có bản quyền thương mại.

## 5. User stories chính

- Là người mới, tôi muốn **học và luyện hiragana/katakana** có âm thanh để đọc được chữ trong 1 tuần.
- Là người học, tôi muốn **check-in mỗi ngày và thấy streak** để giữ thói quen.
- Là người học, tôi muốn **mỗi từ vựng có kanji, furigana, romaji, Hán-Việt, nghĩa, ví dụ và audio** để hiểu đầy đủ.
- Là người học, tôi muốn **ôn bằng flashcard** đúng lúc sắp quên.
- Là người học, tôi muốn **làm bài test theo bài đã học** và **thi thử N5**.
- Là người học, tôi muốn **AI nói tôi nên học gì tiếp** dựa trên điểm yếu.
- Là người học, tôi muốn **chat với AI** để hỏi ngữ pháp và luyện hội thoại.
- Là người học, tôi muốn **đọc to và được chấm phát âm**.
- Là người học, tôi muốn **nghe bài hát Nhật với lyrics chạy theo nhạc**, bấm vào từ để học.
- Là thợ kaigo tương lai, tôi muốn **học kanji/từ theo ngành của mình**.
- Là blogger / giáo viên, tôi muốn **nhúng thẻ kanji hoặc word-of-the-day vào website của tôi**.
- Là admin, tôi muốn **đổi AI provider theo từng chế độ** mà không cần deploy lại.

## 6. KPI

| KPI | Mục tiêu 3 tháng sau launch |
|-----|-----------------------------|
| D1 / D7 / D30 retention | 40% / 20% / 10% |
| Streak trung bình người dùng active | ≥ 5 ngày |
| % người dùng hoàn thành kana | ≥ 50% |
| % hoàn thành 10 bài N5 đầu | ≥ 20% |
| Accuracy trung bình bài test | 70–85% (quá cao = quá dễ) |
| Lighthouse SEO / Performance / A11y | ≥ 95 / ≥ 90 / ≥ 95 |
| Chi phí AI / người dùng active / tháng | Đặt trần, theo dõi ở admin |
