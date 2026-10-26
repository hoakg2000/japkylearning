# 05 – AI & Speech

## 1. AI provider abstraction

### Yêu cầu
- Đổi được giữa **Gemini, ChatGPT (OpenAI), Claude, MotAPI, GitHub Copilot**.
- Đổi qua **admin dashboard** (runtime) hoặc **env lúc build** (mặc định).
- Mỗi chế độ (`tutor`, `quiz-gen`, `grading`, `adaptive`) chọn provider/model riêng.
- **Hiện tại dùng mock.** Tương lai nối **universal AI gateway** do chủ dự án tự phát triển (SDK hoặc REST).

### Thiết kế

```
src/lib/ai/
  types.ts          # AiProvider, ChatInput, ObjectInput, AiMode
  registry.ts       # getProvider(mode): app_settings → env → 'mock'
  adapters/
    mock.ts         # P0: fixtures deterministic, stream giả từng token, dùng cho dev/test/CI
    gateway.ts      # P0 stub: gọi REST gateway tự làm (GATEWAY_URL, GATEWAY_API_KEY) – hoàn thiện khi gateway có spec
    openai-compatible.ts  # P2: phủ ChatGPT, MotAPI (https://motapis.com/v1), endpoint OpenAI-compatible khác
    gemini.ts       # P2
    claude.ts       # P2
  prompts/          # system prompt theo mode, có version
  guard.ts          # quota, rate limit, sanitize, validate output
```

- **GitHub Copilot**: không có API công khai chính thức cho bên thứ ba dùng làm LLM backend. Đề xuất đi qua gateway tự làm (gateway quyết định cách nối). Ghi chú để xác minh khi làm.
- Nếu gateway của chủ dự án nói chuẩn OpenAI-compatible thì `gateway` có thể chỉ là cấu hình của `openai-compatible`. Chốt khi gateway có spec.
- Tham chiếu code đã có: `C:\project\secretary\server\src\llm\motapi.client.ts` (env `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`), SSE helper `C:\project\secretary\server\src\llm\sse.ts`.

### Env

```
AI_PROVIDER=mock                 # mock | gateway | openai-compatible | gemini | claude
AI_MODEL=
GATEWAY_URL=  GATEWAY_API_KEY=
LLM_BASE_URL= LLM_API_KEY=       # openai-compatible (OpenAI, MotAPI…)
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
AI_DAILY_TOKEN_QUOTA=50000
```

### Admin dashboard (`/[locale]/admin/ai`)
- Bảng: mode → provider → model → bật/tắt. Lưu vào `app_settings`.
- Nút "Test" gửi prompt mẫu, hiện latency + output.
- Thống kê dùng token theo ngày/mode/provider (từ `ai_usage`, `chat_messages`).
- Review `ai_generated_items` (duyệt/loại câu hỏi AI sinh ra).
- Chỉ `role = admin`; kiểm tra quyền trong mọi server action.

### An toàn & chi phí
- Nội dung người dùng, lyrics, văn bản ngoài đặt trong delimiter rõ ràng, coi là **data, không phải lệnh**.
- AI không có tool ghi. Tool đọc (nếu có) chỉ lấy dữ liệu của chính user, server validate.
- Output có cấu trúc → validate zod; sai → retry 1 lần → fallback nội dung tĩnh.
- Không render HTML từ model; render markdown đã sanitize.
- Quota token/ngày/user + rate limit theo user và IP (Upstash).
- Cache: câu hỏi sinh ra lưu theo `input_hash` và tái dùng; prompt hệ thống ổn định để tận dụng prompt caching của provider.
- Giới hạn `maxOutputTokens` theo mode.

### Prompt theo mode (tóm tắt)
| Mode | Input | Output |
|------|-------|--------|
| `quiz-gen` | Danh sách item đã học (id, surface, reading, meaning), loại câu, số câu, locale | JSON câu hỏi theo schema |
| `grading` | Câu hỏi, đáp án chuẩn, câu trả lời user, locale | `{ correct, score, corrections, explanation }` |
| `adaptive` | Tóm tắt rule-based (điểm yếu theo skill, thẻ đến hạn, bài kế) | Lời khuyên + bài ôn cá nhân hóa |
| `tutor` | Lịch sử chat, cấp độ user, scenario roleplay | Văn bản stream; câu tiếng Nhật kèm furigana markup đơn giản |

## 2. TTS

```
src/lib/speech/tts/
  types.ts     # TtsProvider { speak(text, opts) }
  browser.ts   # client: speechSynthesis, voice lang 'ja-JP', rate
  fish.ts      # server-only: proxy fish.audio
```

**Luồng chọn voice**
1. `user_settings.tts_voice_id` (hoặc voice mặc định admin đặt) có giá trị → dùng `fish`.
2. Không có → `browser`. Không có voice `ja-JP` trên thiết bị → báo cho người dùng.

**fish.audio** (theo `C:\project\secretary\server\src\ai-agent\services\tts\tts.service.ts` và docs fish.audio):
- `POST https://api.fish.audio/v1/tts`
- Header: `Authorization: Bearer ${FISH_AUDIO_API_KEY}`, `Content-Type: application/json`, `model: s2.1-pro-free` (model khác: `s1`, `s2-pro`, `s2.1-pro`).
- Body: `{ text, reference_id: voiceId, format: 'mp3', latency: 'normal' }`, `prosody.speed` cho tốc độ.
- Trả về stream (chunked) → pipe về client; timeout 60 s.
- Route `/api/tts`: auth (hoặc guest có rate limit chặt), zod (text ≤ 300 ký tự), kiểm tra `audio_cache` trước khi gọi.
- **Chi phí:** tính theo byte UTF-8 → tiếng Nhật (3 byte/ký tự) đắt ~3x so với chữ Latin. Bắt buộc cache. Có thể pre-generate audio cho toàn bộ từ vựng N5 lúc build.

## 3. STT & chấm phát âm

```
src/lib/speech/stt/
  types.ts     # SttProvider { transcribe(audio, { lang: 'ja-JP', referenceText? }) → { text, kana?, confidence?, phonemeScores? } }
  mock.ts      # P0
  webspeech.ts # client, Chrome/Edge/Safari
  azure.ts     # P2: Pronunciation Assessment ja-JP (accuracy, fluency, completeness)
  fish-asr.ts  # P2: fish.audio ASR (endpoint cần xác minh)
  whisper.ts   # P2: OpenAI transcribe hoặc qua gateway
src/lib/japanese/mora.ts   # toHiragana, splitMora, moraDiff, score
```

**Pipeline chấm điểm (tầng cơ bản, mọi provider):**
1. Câu mẫu → `target_kana` (đã precompute).
2. Audio → STT → text → hiragana (wanakana + bảng reading cho kanji; hoặc API analyze).
3. Tách mora: gộp ゃゅょ với kana trước, っ và ー là 1 mora riêng.
4. Levenshtein theo mora → danh sách thao tác (đúng / thay / thiếu / thừa).
5. Điểm = `round(100 * (1 - editDistance / targetMoraCount))`, kẹp 0–100.
6. UI highlight mora sai, cho nghe lại mẫu và bản ghi.

Lưu ý: STT tự sửa phát âm về từ đúng, nên tầng này đo **"có nghe hiểu được không"**, chưa phải chấm âm vị. Tầng cao cấp dùng Azure Pronunciation Assessment để có điểm theo âm vị.

**Quyền riêng tư:** chỉ ghi âm khi người dùng bấm; không lưu audio trừ khi người dùng bật; header `Permissions-Policy: microphone=(self)`.

## 4. Mục cần xác minh ở Phase 0/4

- Vercel AI SDK major version hiện tại (nếu dùng làm lớp adapter bên trong).
- Endpoint fish.audio ASR.
- GitHub Copilot có cách gọi hợp lệ cho bên thứ ba hay chỉ qua gateway.
- Hỗ trợ `SpeechRecognition` của Firefox.
