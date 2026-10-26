# 04 – Data model

> Cập nhật 2026-10-26 theo [review panel](./REVIEW-2026-10-26.md).

## 1. Postgres (Drizzle)

Quy ước: `id` uuid/text, `created_at`/`updated_at` timestamptz UTC. Mọi query dữ liệu người dùng lọc theo `user_id` của session.

### Người dùng, cài đặt, consent
| Bảng | Cột chính | Ghi chú |
|------|-----------|---------|
| `users`, `sessions`, `accounts`, `verifications`, `two_factors` | theo Better Auth (+ anonymous, 2FA plugin) | `role`: `user` / `admin`; `is_anonymous`; `birth_year` (cổng tuổi 16+) |
| `user_settings` | `user_id` PK, `locale`, `timezone` (IANA), `timezone_changed_at`, `theme`, `ui_mode`, `sound_enabled`, `furigana_mode` (always/unlearned/never), `show_romaji`, `show_han_viet`, `daily_goal_xp`, `weekly_goal_days`, `tts_voice_id` (FK allowlist), `tts_rate`, `goal` (jlpt/tokutei/it), `sector` | |
| `consents` | `user_id`, `purpose` (account, analytics, ai_processing, speech_processing, email_reminders), `granted` bool, `policy_version`, `at`, `ip_hash` | Một dòng mỗi lần thay đổi; PDPL yêu cầu consent theo từng mục đích |
| `embed_profiles` | `user_id`, `public_id` (ngẫu nhiên, đổi được), `streak_enabled` bool | Mặc định tắt |

### Streak & XP
| Bảng | Cột chính | Ghi chú |
|------|-----------|---------|
| `study_days` | `user_id`, `local_date` date, `xp`, `goal_met` bool, `freeze_used` bool | **unique(user_id, local_date)**; upsert `xp = study_days.xp + excluded.xp` |
| `streak_freezes` | `user_id` PK, `available`, `last_granted_week` | Tặng 1/tuần, tối đa 2 |
| `xp_events` | `user_id`, `source`, `amount`, `ref_id`, `at` | Audit XP |

Streak **không lưu sẵn**: tính khi đọc bằng pure function `src/lib/streak` từ `study_days` + `streak_freezes`.

### Học & SRS
| Bảng | Cột chính | Ghi chú |
|------|-----------|---------|
| `lesson_progress` | `user_id`, `lesson_id`, `status` (locked/in_progress/done/skipped), `step`, `score`, `completed_at` | unique(user_id, lesson_id); `step` để tiếp tục giữa bài |
| `srs_cards` | `user_id`, `item_type` (kana/word/kanji/grammar/listening), `item_id`, `direction`, trường FSRS (`due`, `stability`, `difficulty`, `elapsed_days`, `scheduled_days`, `reps`, `lapses`, `state`, `last_review`), `suspended` | unique(user_id, item_type, item_id, direction); index (user_id, due). Ban đầu chỉ tạo `direction = recognition` |
| `review_logs` | `card_id`, `rating`, `state`, `reviewed_at`, `elapsed_ms` | Cân nhắc partition theo tháng khi lớn |
| `placement_results` | `user_id`, `level_estimate`, `skipped_lessons` text[], `at` | |

### Kiểm tra & AI
| Bảng | Cột chính | Ghi chú |
|------|-----------|---------|
| `test_attempts` | `user_id`, `kind` (lesson/mixed/mock_jlpt/ai/placement), `scope` jsonb, `score`, `started_at`, `finished_at` | |
| `test_answers` | `attempt_id`, `question_id`, `question_snapshot` jsonb, `answer`, `correct`, `skill_tags` text[] | Nguồn cho adaptive |
| `ai_generated_items` | `kind`, `input_hash`, `payload` jsonb, `provider`, `model`, `status` (pending/approved/rejected), `created_by` | Chỉ `approved` được dùng lại cho người khác |
| `ai_usage` | `user_id`, `local_date`, `mode`, `requests`, `tokens_in`, `tokens_out`, `cost_usd` | Quota theo user + tổng chi phí cho kill-switch |
| `chat_threads` / `chat_messages` | `user_id`, `mode`, `title` / `thread_id`, `role`, `content`, `provider`, `tokens_in`, `tokens_out` | |
| `pronunciation_attempts` | `user_id`, `target_text`, `target_kana`, `recognized_kana`, `score`, `mora_diff` jsonb, `provider` | Không lưu audio |

### Hệ thống
| Bảng | Cột chính |
|------|-----------|
| `app_settings` | `key` PK, `value` jsonb, `updated_by`, `updated_at`. Ví dụ: `ai.modes = { tutor: { adapter, preset, model } }`, `ai.kill_switch`, `ai.daily_budget_usd`. **Không lưu URL hay API key** – chỉ chọn trong adapter/preset đã cấu hình bằng env |
| `tts_voices` | `id`, `reference_id` (fish.audio), `label`, `consent_doc_ref`, `enabled` – allowlist voice |
| `audio_cache` | `hash` PK (sha256 text+voice+model), `r2_key`, `bytes`, `created_at` |
| `audit_log` | `actor_id`, `action`, `target`, `before` jsonb, `after` jsonb, `at` – mọi thay đổi của admin |

### Anonymous user
- Tạo lười khi có lần ghi đầu tiên (không tạo khi chỉ xem trang), qua Turnstile.
- Khi đăng ký: `onLinkAccount({ anonymousUser, newUser })` chuyển `study_days`, `lesson_progress`, `srs_cards`, `review_logs`, `user_settings` sang user mới trong 1 transaction.
- Cron xóa anonymous user không hoạt động > 30 ngày.
- Anonymous user không dùng được AI, cloud TTS, STT.

## 2. Content schema

Validate bằng zod lúc build (`scripts/validate-content.ts`). Phác thảo:

```ts
const Bilingual = z.object({ vi: z.string().min(1), en: z.string().min(1) });
const Segment = z.object({ surface: z.string(), reading: z.string().optional() }); // reading chỉ có khi surface chứa kanji
const Rights = z.object({
  type: z.enum(['public-domain', 'cc-by', 'cc-by-sa', 'licensed', 'own-recording']),
  source: z.string(), notes: z.string().optional(),
});

const Kana = z.object({
  char: z.string(), romaji: z.string(), script: z.enum(['hiragana', 'katakana']),
  group: z.enum(['basic', 'dakuten', 'handakuten', 'yoon', 'small', 'extended']),
  row: z.string(), audioUrl: z.string().url(),
});

const Kanji = z.object({
  char: z.string().length(1),
  on: z.array(z.string()), kun: z.array(z.string()),
  hanViet: z.array(z.string()).min(1), hanVietReviewed: z.boolean(),
  meanings: Bilingual, strokes: z.number().int(), radicals: z.array(z.string()),
  jlpt: z.enum(['n5', 'n4', 'n3', 'n2', 'n1']).nullable(),
  lessonId: z.string().nullable(),                  // bài giới thiệu kanji này
  sectors: z.array(z.string()), kanjivgId: z.string(),
});

const Example = z.object({
  ja: z.string(), segments: z.array(Segment), romaji: z.string(),
  translation: Bilingual, audioUrl: z.string().url().optional(), source: z.string(), // ví dụ 'tatoeba:12345'
});

const Word = z.object({
  id: z.string(),                                   // 'jmdict-1358280'
  surface: z.string(), reading: z.string(), romaji: z.string(),
  segments: z.array(Segment),                       // từ JmdictFurigana
  hanViet: z.string().optional(),
  hanVietSource: z.enum(['onyomi-join', 'manual']).optional(),
  jukujikun: z.boolean().default(false),            // true → không ghép Hán-Việt tự động
  pos: z.array(z.string()),
  meanings: Bilingual, meaningsViReviewed: z.boolean(),
  pitch: z.array(z.number().int()).optional(),
  examples: z.array(Example).min(1),
  jlpt: z.enum(['n5', 'n4', 'n3', 'n2', 'n1']).nullable(),
  tags: z.array(z.string()), audioUrl: z.string().url(),
});

const GrammarPoint = z.object({
  id: z.string(), pattern: z.string(), explanation: Bilingual,
  examples: z.array(Example).min(2), clozeSentences: z.array(Example).min(2), // cho thẻ SRS ngữ pháp
  jlpt: z.string(),
});

const Lesson = z.object({
  id: z.string(), level: z.string(), order: z.number().int(),
  title: Bilingual, goals: z.array(Bilingual),
  wordIds: z.array(z.string()).max(18), kanji: z.array(z.string()), grammarIds: z.array(z.string()),
  dialogue: z.array(z.object({ speaker: z.string(), line: Example })).optional(),
  exercises: z.array(z.unknown()),                  // union loại câu hỏi ở features/tests; ≥ 1 bài nghe
});

const Song = z.object({
  slug: z.string(), title: z.string(),
  lyricist: z.object({ name: z.string(), died: z.number().int().nullable() }),
  composer: z.object({ name: z.string(), died: z.number().int().nullable() }),
  audioUrl: z.string().url(), lrcFile: z.string(),
  highlights: z.array(z.object({ wordId: z.string(), lineIndex: z.number().int() })),
  translation: z.array(Bilingual).optional(),
  license: Rights,                                  // quyền với lời + nhạc
  recordingRights: Rights,                          // quyền với bản thu
  rightsProof: z.string().min(1),                   // link/ghi chú chứng minh (năm mất, hợp đồng thu âm…)
});
```
