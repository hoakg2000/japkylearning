// App tables (docs/04-DATA-MODEL.md). Auth tables come from Better Auth in ./auth-schema.ts.
import { boolean, date, index, integer, jsonb, pgTable, primaryKey, real, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export * from './auth-schema';

const userId = () => text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' });
const createdAt = () => timestamp('created_at', { withTimezone: true }).defaultNow().notNull();

export const userSettings = pgTable('user_settings', {
  userId: userId().primaryKey(),
  timezone: text('timezone').notNull().default('Asia/Ho_Chi_Minh'),
  timezoneChangedOn: date('timezone_changed_on'),
  dailyGoalXp: integer('daily_goal_xp').notNull().default(20),
  goal: text('goal'), // jlpt | tokutei | it
  sector: text('sector'),
  knownLevel: text('known_level'), // none | kana | some-n5
  furiganaMode: text('furigana_mode').notNull().default('always'), // always | unlearned | never
  showRomaji: boolean('show_romaji').notNull().default(true),
  showHanViet: boolean('show_han_viet').notNull().default(true),
  onboardedAt: timestamp('onboarded_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/** One row per consent change (PDPL: consent per purpose, ADR 0011). */
export const consents = pgTable(
  'consents',
  {
    id: serial('id').primaryKey(),
    userId: userId(),
    purpose: text('purpose').notNull(), // account | analytics | ai_processing | speech_processing | email_reminders
    granted: boolean('granted').notNull(),
    policyVersion: text('policy_version').notNull(),
    at: createdAt(),
  },
  (t) => [index('consents_user_idx').on(t.userId, t.purpose)],
);

export const studyDays = pgTable(
  'study_days',
  {
    userId: userId(),
    localDate: date('local_date').notNull(),
    xp: integer('xp').notNull().default(0),
    goalMet: boolean('goal_met').notNull().default(false),
    freezeUsed: boolean('freeze_used').notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.userId, t.localDate] })],
);

export const streakFreezes = pgTable('streak_freezes', {
  userId: userId().primaryKey(),
  available: integer('available').notNull().default(0),
  lastGrantedWeek: text('last_granted_week'),
});

export const xpEvents = pgTable(
  'xp_events',
  {
    id: serial('id').primaryKey(),
    userId: userId(),
    source: text('source').notNull(), // kana | lesson | review | test | placement
    amount: integer('amount').notNull(),
    refId: text('ref_id'),
    at: createdAt(),
  },
  (t) => [index('xp_events_user_idx').on(t.userId, t.at)],
);

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    userId: userId(),
    lessonId: text('lesson_id').notNull(),
    status: text('status').notNull(), // in_progress | done | skipped
    step: integer('step').notNull().default(0),
    score: real('score'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);

export const srsCards = pgTable(
  'srs_cards',
  {
    id: serial('id').primaryKey(),
    userId: userId(),
    itemType: text('item_type').notNull(), // kana | word | kanji | grammar | listening
    itemId: text('item_id').notNull(),
    direction: text('direction').notNull().default('recognition'),
    due: timestamp('due', { withTimezone: true }).notNull(),
    stability: real('stability').notNull(),
    difficulty: real('difficulty').notNull(),
    elapsedDays: integer('elapsed_days').notNull(),
    scheduledDays: integer('scheduled_days').notNull(),
    learningSteps: integer('learning_steps').notNull().default(0),
    reps: integer('reps').notNull(),
    lapses: integer('lapses').notNull(),
    state: integer('state').notNull(),
    lastReview: timestamp('last_review', { withTimezone: true }),
    suspended: boolean('suspended').notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('srs_cards_item_uq').on(t.userId, t.itemType, t.itemId, t.direction),
    index('srs_cards_due_idx').on(t.userId, t.due),
  ],
);

export const reviewLogs = pgTable(
  'review_logs',
  {
    id: serial('id').primaryKey(),
    cardId: integer('card_id').notNull().references(() => srsCards.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    state: integer('state').notNull(),
    elapsedMs: integer('elapsed_ms'),
    reviewedAt: createdAt(),
  },
  (t) => [index('review_logs_card_idx').on(t.cardId)],
);

export const testAttempts = pgTable(
  'test_attempts',
  {
    id: serial('id').primaryKey(),
    userId: userId(),
    kind: text('kind').notNull(), // kana | lesson | placement | mixed
    scope: jsonb('scope').$type<Record<string, unknown>>(),
    score: real('score').notNull(),
    total: integer('total').notNull(),
    correct: integer('correct').notNull(),
    finishedAt: createdAt(),
  },
  (t) => [index('test_attempts_user_idx').on(t.userId, t.finishedAt)],
);

export const testAnswers = pgTable(
  'test_answers',
  {
    id: serial('id').primaryKey(),
    attemptId: integer('attempt_id').notNull().references(() => testAttempts.id, { onDelete: 'cascade' }),
    questionId: text('question_id').notNull(),
    answer: text('answer'),
    correct: boolean('correct').notNull(),
    skillTags: text('skill_tags').array().notNull(),
  },
  (t) => [index('test_answers_attempt_idx').on(t.attemptId)],
);
