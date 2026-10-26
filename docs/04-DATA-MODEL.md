# 04 – Data model

## 1. Postgres (Drizzle)

Quy ước: `id` uuid/text, `created_at`/`updated_at` timestamptz UTC. Mọi query dữ liệu người dùng phải lọc theo `user_id` của session.

### Người dùng & cài đặt
| Bảng | Cột chính | Ghi chú |
|------|-----------|---------|
| `users`, `sessions`, `accounts`, `verifications` | theo Better Auth | `role`: `user` / `admin` |
| `user_settings` | `user_id` PK, `locale`, `timezone` (IANA), `timezone_changed_at`, `theme`, `ui_mode` (`full`/`minimal`), `sound_enabled`, `show_furigana`, `show_romaji`, `show_han_viet`, `daily_goal_xp`, `tts_voice_id` nullable, `tts_rate` | |

### Streak & XP
| Bảng | Cột chính | Ghi chú |
|------|-----------|---------|
| `study_days` | `user_id`, `local_date` date, `xp`, `goal_met` bool, `freeze_used` bool | **unique(user_id, local_date)** |
| `streaks` | `user_id` PK, `current`, `longest`, `last_local_date`, `freezes_available` | Tính lại được từ `study_days` |
| `xp_events` | `user_id`, `source` (lesson/review/test/song/chat), `amount`, `ref_id`, `at` | Audit XP |

### Học & SRS
| Bảng | Cột chính | Ghi chú |
|------|-----------|---------|
| `lesson_progress` | `user_id`, `lesson_id`, `status` (locked/in_progress/done), `score`, `completed_at` | unique(user_id, lesson_id) |
| `srs_cards` | `user_id`, `item_type` (kana/word/kanji/grammar), `item_id`, `direction`, các trường FSRS (`due`, `stability`, `difficulty`, `elapsed_days`, `scheduled_days`, `reps`, `lapses`, `state`, `last_review`) | unique(user_id, item_type, item_id, direction); index (user_id, due) |
| `review_logs` | `card_id`, `rating`, `state`, `reviewed_at`, `elapsed_ms` | Phục vụ tối ưu FSRS sau này |

### Kiểm tra
| Bảng | Cột chính | Ghi chú |
|------|-----------|---------|
| `test_attempts` | `user_id`, `kind` (lesson/mixed/mock_jlpt/ai), `scope` jsonb, `score`, `started_at`, `finished_at` | |
| `test_answers` | `attempt_id`, `question_id`, `question_snapshot` jsonb, `answer`, `correct`, `skill_tags` text[] | Nguồn dữ liệu cho adaptive (F7) |
| `ai_generated_items` | `kind` (question/explanation/lesson), `input_hash`, `payload` jsonb, `provider`, `model`, `status` (pending/approved/rejected), `created_by` | Cache + review ở admin |

### AI chat & phát âm
| Bảng | Cột chính |
|------|-----------|
| `chat_threads` | `user_id`, `mode` (qa/roleplay), `scenario`, `title` |
| `chat_messages` | `thread_id`, `role`, `content`, `provider`, `tokens_in`, `tokens_out` |
| `ai_usage` | `user_id`, `local_date`, `mode`, `requests`, `tokens` (quota) |
| `pronunciation_attempts` | `user_id`, `target_text`, `target_kana`, `recognized_kana`, `score`, `mora_diff` jsonb, `provider` |

### Hệ thống
| Bảng | Cột chính |
|------|-----------|
| `app_settings` | `key` PK, `value` jsonb, `updated_by`, `updated_at` – ví dụ `ai.providers = { tutor: {provider, model}, quiz-gen: {...} }` |
| `audio_cache` | `hash` PK (sha256 text+voice+model), `storage_url`, `bytes`, `created_at` |

## 2. Content schema

Nội dung học là file trong `content/`, validate bằng zod lúc build (`scripts/validate-content.ts`). Phác thảo:

```ts
const Bilingual = z.object({ vi: z.string().min(1), en: z.string().min(1) });
const Segment = z.object({ surface: z.string(), reading: z.string().optional() }); // reading chỉ có khi surface chứa kanji

const Kana = z.object({
  char: z.string(), romaji: z.string(), script: z.enum(['hiragana', 'katakana']),
  group: z.enum(['basic', 'dakuten', 'handakuten', 'yoon', 'small', 'extended']),
  row: z.string(),                                  // 'a', 'ka', ...
});

const Kanji = z.object({
  char: z.string().length(1),
  on: z.array(z.string()), kun: z.array(z.string()),
  hanViet: z.array(z.string()).min(1),              // bắt buộc với kanji đã review
  meanings: Bilingual, strokes: z.number().int(), radicals: z.array(z.string()),
  jlpt: z.enum(['n5', 'n4', 'n3', 'n2', 'n1']).nullable(),
  sectors: z.array(z.string()),
  kanjivgId: z.string(),
});

const Example = z.object({ ja: z.string(), segments: z.array(Segment), romaji: z.string(), translation: Bilingual });

const Word = z.object({
  id: z.string(),                                   // ổn định, ví dụ 'jmdict-1358280'
  surface: z.string(), reading: z.string(), romaji: z.string(),
  segments: z.array(Segment),                       // cho <ruby>
  hanViet: z.string().optional(),                   // ghép từ Hán-Việt từng kanji
  pos: z.array(z.string()),
  meanings: Bilingual,
  pitch: z.array(z.number().int()).optional(),      // Kanjium
  examples: z.array(Example).min(1),                // bắt buộc ≥ 1 ví dụ
  jlpt: z.enum(['n5', 'n4', 'n3', 'n2', 'n1']).nullable(),
  tags: z.array(z.string()),                        // sector, chủ đề
  audio: z.string().optional(),
});

const GrammarPoint = z.object({ id: z.string(), pattern: z.string(), explanation: Bilingual, examples: z.array(Example).min(2), jlpt: z.string() });

const Lesson = z.object({
  id: z.string(), level: z.string(), order: z.number().int(),
  title: Bilingual, goals: z.array(Bilingual),
  wordIds: z.array(z.string()), kanji: z.array(z.string()), grammarIds: z.array(z.string()),
  dialogue: z.array(z.object({ speaker: z.string(), line: Example })).optional(),
  exercises: z.array(z.unknown()),                  // union các loại câu hỏi, định nghĩa ở features/tests
});

const Song = z.object({
  slug: z.string(), title: z.string(), artist: z.string(),
  youtubeId: z.string(), lrcFile: z.string(),
  highlights: z.array(z.object({ wordId: z.string(), lineIndex: z.number().int() })),
  translation: z.array(Bilingual).optional(),
  license: z.object({ type: z.enum(['public-domain', 'cc-by', 'cc-by-sa', 'licensed']), source: z.string(), notes: z.string().optional() }),
});
```

## 3. Guest → user sync

- Guest lưu `{ settings, studyDays[], lessonProgress[], srsCards[] }` trong localStorage (có `schemaVersion`).
- Khi đăng nhập: gửi 1 lần lên server action `mergeGuestData` (zod validate, giới hạn kích thước), server merge:
  - `study_days`: hợp các ngày.
  - `lesson_progress`: lấy trạng thái cao hơn.
  - `srs_cards`: lấy bản có `last_review` mới hơn.
- Merge xong xóa localStorage.
