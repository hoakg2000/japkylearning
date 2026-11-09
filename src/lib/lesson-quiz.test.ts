import { describe, expect, it } from 'vitest';
import { grammarPoints, lessonByOrder, lessonContent, words } from './content/n5';
import { clozeQuestion, lessonTest, meaningQuestion, mockExam, readingQuestion } from './lesson-quiz';
import { seededRng } from './quiz';

let seed = 42;
const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

describe('lesson questions', () => {
  it('meaning options are unique and contain the answer', () => {
    for (const w of words) {
      const q = meaningQuestion(w, words, 'vi', rng);
      const ids = q.options.map((o) => o.id);
      expect(new Set(q.options.map((o) => o.label)).size).toBe(q.options.length);
      expect(ids).toContain(q.answer);
      expect(q.options.length).toBe(4);
    }
  });

  it('reading questions only for words with kanji', () => {
    expect(readingQuestion(words.find((w) => w.surface === 'これ')!, words, rng)).toBeNull();
    const q = readingQuestion(words.find((w) => w.surface === '学生')!, words, rng)!;
    expect(q.options.map((o) => o.id)).toContain('がくせい');
  });

  it('cloze splits the sentence around the blank', () => {
    for (const g of grammarPoints) {
      for (let i = 0; i < g.cloze.length; i++) {
        const q = clozeQuestion(g, grammarPoints, 'en', rng, i);
        if (q.type !== 'cloze') throw new Error('type');
        expect(q.before + q.answer + q.after).toBe(g.cloze[i].ja);
        expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length);
      }
    }
  });

  it('lesson tests cover every grammar point and at most 15 questions', () => {
    for (let n = 1; n <= 10; n++) {
      const lesson = lessonByOrder(n)!;
      const content = lessonContent(lesson);
      const qs = lessonTest(content, words, grammarPoints, 'vi', rng);
      expect(qs.length).toBeLessThanOrEqual(15);
      for (const g of content.grammar) expect(qs.some((q) => q.id === `cloze:${g.id}`)).toBe(true);
      expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
    }
  });
});

describe('mock exam', () => {
  it('has 32 unique questions and is rebuilt identically from the same seed', () => {
    const a = mockExam(words, grammarPoints, 'vi', seededRng(7));
    const b = mockExam(words, grammarPoints, 'vi', seededRng(7));
    expect(a).toHaveLength(32);
    expect(new Set(a.map((q) => q.id)).size).toBe(32);
    expect(b.map((q) => q.id)).toEqual(a.map((q) => q.id));
    expect(b.map((q) => q.options.map((o) => o.id))).toEqual(a.map((q) => q.options.map((o) => o.id)));
  });
});
