# 05 – AI & Speech

> Cập nhật 2026-10-26 theo [review panel](./REVIEW-2026-10-26.md).

## 1. AI provider abstraction

### Yêu cầu của chủ dự án
- Đổi được giữa nhiều provider: **OpenAI (ChatGPT), Gemini, Claude, MotAPI, GitHub Models** (thay cho GitHub Copilot, xem dưới).
- Đổi qua **admin dashboard** (runtime) hoặc **env lúc build** (mặc định).
- Mỗi chế độ (`tutor`, `quiz-gen`, `grading`, `adaptive`, `lyrics-keywords`, `lyrics-translate`, `song-metadata`) chọn provider/model riêng.
- **Hiện tại dùng mock.** Tương lai nối **universal AI gateway** do chủ dự án tự phát triển (SDK hoặc REST).

### Adapter ([ADR 0010](./adr/0010-ai-provider-strategy.md))

```
src/lib/ai/
  types.ts
  registry.ts                 # getProvider(mode): app_settings → env → 'mock'
  adapters/
    mock.ts                   # fixtures deterministic, stream giả; dùng cho dev, test, CI, preview
    openai-compatible.ts      # 1 adapter, nhiều preset (bảng dưới)
    gateway.ts                # stub; hoàn thiện khi gateway có spec (nếu gateway nói chuẩn OpenAI thì chỉ là 1 preset)
  prompts/                    # system prompt theo mode, có version
  guard.ts                    # quota, kill-switch, validate output
```

| Preset | Base URL | Env key | Ghi chú |
|--------|----------|---------|---------|
| `openai` | `https://api.openai.com/v1` | `OPENAI_API_KEY` | |
| `gemini` | `https://generativelanguage.googleapis.com/v1beta/openai/` | `GEMINI_API_KEY` | Endpoint OpenAI-compatible chính thức |
| `claude` | endpoint OpenAI-compatible của Anthropic, hoặc qua gateway | `ANTHROPIC_API_KEY` | Thêm adapter riêng chỉ khi cần tính năng riêng |
| `motapi` | `https://motapis.com/v1` | `MOTAPI_API_KEY` | **Processor chưa kiểm chứng: không gửi PII**, chỉ gửi nội dung học đã ẩn danh |
| `github-models` | `https://models.github.ai/inference` | `GITHUB_MODELS_TOKEN` (PAT `models:read`) | Thay cho Copilot. Free tier dành cho prototype → dùng cho dev |

- **Vì sao bỏ GitHub Copilot:** Copilot không có API được phép cho ứng dụng bên thứ ba. Các proxy dùng token Copilot là reverse-engineer, có rủi ro vi phạm ToS/AUP và bị khóa tài khoản. GitHub Models là lựa chọn hợp lệ, cùng hệ sinh thái.
- Tham chiếu code: `C:\project\secretary\server\src\llm\motapi.client.ts`, SSE helper `C:\project\secretary\server\src\llm\sse.ts`.

### Env

```
AI_PROVIDER=mock                 # mock | openai-compatible | gateway
AI_PRESET=                       # openai | gemini | claude | motapi | github-models
AI_MODEL=
OPENAI_API_KEY= GEMINI_API_KEY= ANTHROPIC_API_KEY= MOTAPI_API_KEY= GITHUB_MODELS_TOKEN=
GATEWAY_URL= GATEWAY_API_KEY=
AI_DAILY_BUDGET_USD=5
```

Key chỉ nằm trong env (Vercel sensitive env). **Preview deploy không có key thật** → luôn chạy `mock`.

### Admin dashboard (`/[locale]/admin/ai`)
- Bảng: mode → adapter → preset → model → bật/tắt. Chỉ chọn trong preset **đã có key trong env**; `app_settings` **không lưu URL hay key** (tránh SSRF và lộ key qua nút "Test").
- Nút "Test" gửi prompt mẫu cố định, hiện latency + output.
- **Kill-switch** toàn cục + ngân sách/ngày (`AI_DAILY_BUDGET_USD`): vượt ngân sách → tự chuyển về `mock`/nội dung tĩnh.
- Thống kê token & chi phí theo ngày/mode/provider (`ai_usage`).
- Review `ai_generated_items` (duyệt/loại).
- Quyền admin cấp tay trong DB, **bắt buộc 2FA**, mọi thay đổi ghi `audit_log`.
- Đặt hạn mức chi tiêu trong console của từng provider.

### An toàn
- Nội dung người dùng, văn bản ngoài đặt trong delimiter, coi là **data, không phải lệnh**.
- AI không có tool ghi. Tool đọc chỉ lấy dữ liệu của chính user, server validate.
- Output có cấu trúc → validate zod; sai → retry 1 lần → fallback nội dung tĩnh.
- Không render HTML từ model. Furigana dùng markup `{漢字|かんじ}` parse bằng code của app.
- Câu hỏi AI sinh ra chỉ dùng lại cho người khác khi đã `approved`.
- Chỉ người dùng đăng nhập 16+ đã consent `ai_processing` mới dùng AI.
- Chat streaming qua **Route Handler (SSE)** với `maxDuration`; Server Action chỉ dùng cho mutation.

### Quota & chi phí
| Mode | Giới hạn beta |
|------|---------------|
| `quiz-gen` | 5 lượt/ngày/user |
| `tutor` | 20 tin/ngày/user, `maxOutputTokens` thấp |
| `grading` | Theo số câu tự luận trong test |
| `adaptive` | 1 lần/ngày/user, cache |
| `lyrics-keywords`, `lyrics-translate` | v1: chỉ chạy lúc ingest. v2: 1 lần cho mỗi bài (kết quả dùng chung trong `song_tracks`) |
| `song-metadata` | v2: chỉ khi rule tách artist/title không chắc |

Mục tiêu: ≤ **$0.10 / MAU / tháng**. Dùng model nhỏ cho quiz-gen/grading; prompt hệ thống ổn định để tận dụng prompt caching.

### Prompt theo mode
| Mode | Input | Output |
|------|-------|--------|
| `quiz-gen` | Item đã học (id, surface, reading, meaning), loại câu, số câu, locale | JSON câu hỏi theo schema |
| `grading` | Câu hỏi, đáp án chuẩn, câu trả lời, locale | `{ correct, score, corrections, explanation }` |
| `adaptive` | Tóm tắt rule-based (không PII) | 1–2 câu nhận xét + bài ôn |
| `tutor` | Lịch sử chat, cấp độ, chủ đề | Văn bản stream có markup furigana |
| `lyrics-keywords` | Các dòng lyrics (trong delimiter, là data), cấp mục tiêu, locale | `keywords[]` theo schema `LyricKeyword` ([04](./04-DATA-MODEL.md#2-content-schema)); keyword không khớp vị trí trong dòng bị loại |
| `lyrics-translate` | Các dòng lyrics, locale đích | Bản dịch từng dòng vi/en |
| `song-metadata` | Tiêu đề, tên kênh, mô tả video | `{ isMusic, artist, title, confidence }` |

Mock của `lyrics-keywords` = rule-based (tách từ, giữ từ trong danh sách JLPT, xếp theo cấp và tần suất), nên tính năng chạy được cả khi AI tắt.

## 2. TTS

```
src/lib/speech/tts/
  types.ts     # TtsProvider { speak(text, opts) }
  browser.ts   # client: speechSynthesis 'ja-JP'
  fish.ts      # server-only: proxy fish.audio
scripts/ingest/build-audio.ts   # pre-generate audio nội dung → R2
```

**Luồng**
1. **Nội dung học** (kana, từ, ví dụ, hội thoại, bài hát không tính): file mp3 pre-generate, `audioUrl` trong content. Không gọi API lúc chạy.
2. **Text động:** mặc định `browser`. Không có voice `ja-JP` → thông báo.
3. **Cloud voice:** người dùng chọn voice trong bảng `tts_voices` (allowlist). `/api/tts` nhận **id nội dung hoặc id tin nhắn AI**, không nhận text tự do; chỉ người dùng đăng nhập; có quota; kiểm `audio_cache` trước khi gọi.

**fish.audio** (theo `C:\project\secretary\server\src\ai-agent\services\tts\tts.service.ts` + docs fish.audio)
- `POST https://api.fish.audio/v1/tts`
- Header: `Authorization: Bearer ${FISH_AUDIO_API_KEY}`, `Content-Type: application/json`, `model: <model>`.
- Body: `{ text, reference_id, format: 'mp3', latency: 'normal' }`, `prosody.speed` cho tốc độ. Trả stream, timeout 60 s.
- **Model:** `s2.1-pro-free` chỉ dùng cho dev/beta riêng tư. Trước launch công khai: **gói commercial** (cho phép dùng thương mại và phân phối file pre-generate), model trả phí.
- **Voice:** chỉ dùng voice tạo từ người nói đã **ký giấy đồng ý** (`tts_voices.consent_doc_ref`). Không cho người dùng tự nhập `reference_id`.
- **Chi phí:** tính theo byte UTF-8 → tiếng Nhật đắt ~3x. Pre-generate toàn bộ N5 (~50k ký tự) chỉ tốn 1 lần, ước tính < $20.

## 3. STT & chấm phát âm

```
src/lib/speech/stt/
  types.ts     # SttProvider { transcribe(audio, { lang: 'ja-JP', referenceText? }) → { text, kana?, confidence? } }
  mock.ts
  webspeech.ts # beta: client, Chrome/Edge/Safari
  azure.ts     # P2: Pronunciation Assessment ja-JP, region Southeast Asia
  whisper.ts   # P2: qua openai-compatible hoặc gateway
src/lib/japanese/mora.ts   # toHiragana, splitMora, moraDiff, score
```

**Pipeline (mọi provider)**
1. Câu/từ mẫu → `target_kana` (precompute).
2. Audio → STT → text → hiragana (wanakana; kanji trong kết quả map qua reading của từ mẫu).
3. Tách mora: gộp ゃゅょ với kana trước; っ và ー là 1 mora.
4. Levenshtein theo mora → thao tác (đúng / thay / thiếu / thừa).
5. Điểm = `round(100 * (1 - editDistance / targetMoraCount))`, kẹp 0–100.
6. UI highlight mora sai, nghe lại mẫu.

STT tự sửa phát âm về từ đúng → tầng này đo "nghe hiểu được không", chưa phải chấm âm vị. Chấm âm vị cần Azure (P2).

**Quyền riêng tư**
- Web Speech trên Chrome gửi audio tới **Google** → modal thông báo + consent `speech_processing` trước lần đầu.
- Chỉ ghi khi người dùng bấm; không lưu audio; `Permissions-Policy: microphone=(self)` chỉ trên route luyện nói.
- Beta chỉ chấm từ đơn, người dùng 16+.

## 4. Cần xác minh

- Endpoint OpenAI-compatible của Anthropic và cách gateway tự làm expose API.
- Endpoint fish.audio ASR (nếu dùng sau).
- Điều khoản thương mại chính thức của fish.audio.
- Giới hạn free tier GitHub Models.
- Hỗ trợ `SpeechRecognition` của Firefox.
