# ADR 0012 – Nguồn bài hát và song engine

- **Trạng thái:** Accepted (2026-10-26). Thay [ADR 0006](./0006-song-content-policy.md)

## Bối cảnh
Chủ dự án muốn học qua bài hát Nhật thật. Lyrics và timeline lấy từ nguồn public API / open-source; v1 tạm chưa xử lý bản quyền. v2 cho người dùng chọn video YouTube rồi hệ thống tự tìm hoặc tự tạo lyrics + timeline. Cả v1 và v2 dùng AI đọc lyrics để chọn keyword cần học.

## Quyết định

**v1 – bài do curator chọn**
- Lyrics + timeline: **LRCLIB** (`/api/get`, `/api/search`; miễn phí, không key, trả LRC theo dòng).
- Phát nhạc: **YouTube IFrame Player API**; lyrics bên cạnh/dưới player.
- Xử lý **lúc ingest** (`scripts/ingest/build-songs.ts`), kết quả lưu `content/songs/*.json` → trang SSG, không phụ thuộc LRCLIB lúc runtime.

**v2 – người dùng chọn video**
- YouTube Data API v3 lấy metadata → nhận diện nhạc (category Music, kênh "- Topic", mẫu tiêu đề, LLM `song-metadata` khi không chắc).
- Tìm lyrics: cache `song_tracks` → LRCLIB get → LRCLIB search (nhiều biến thể tên).
- Không có timeline → **song engine** (worker Python, GPU): Demucs tách vocal → forced alignment lyrics có sẵn (stable-ts) hoặc ASR word-level (Whisper large-v3 / kotoba-whisper qua WhisperX / stable-ts) → Enhanced LRC + độ tin cậy.
- Hàng đợi bằng bảng `song_jobs` trong Postgres; worker gọi về bằng webhook HMAC; kết quả dùng chung trong `song_tracks`.

**Chung v1 + v2**
- AI mode `lyrics-keywords` trích keyword (schema `LyricKeyword`), map sang JMdict, loại keyword không khớp vị trí trong lyrics; mock = rule-based theo danh sách JLPT.
- AI mode `lyrics-translate` dịch từng dòng.
- Cá nhân hóa (từ đã học, cấp độ) làm phía client.

## Hệ quả
- (+) Học với bài người dùng thích; v1 ít code (1 script ingest + 1 trang); v2 tận dụng toàn bộ phần hiển thị của v1.
- (+) Engine dùng chung kết quả → chi phí GPU giảm khi thư viện lớn dần.
- (−) Rủi ro bản quyền lyrics được chấp nhận tạm thời; cần cơ chế takedown.
- (−) v2 tải audio từ YouTube trái YouTube ToS → phải quyết định lại nguồn audio trước khi build v2.
- (−) ASR trên giọng hát kém chính xác hơn giọng nói → nhãn độ tin cậy + người dùng báo lỗi.
