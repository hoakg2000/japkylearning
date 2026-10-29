import { describe, expect, it } from 'vitest';
import { gradeAnswer } from './grade-answer';
import { getLesson, getWord } from './content/n5';

describe('gradeAnswer', () => {
  const lesson = getLesson('n5-01')!;
  const word = getWord(lesson.wordIds.find((id) => getWord(id)!.surface === '学生')!)!;

  it('grades by question type', () => {
    expect(gradeAnswer('n5-01', `meaning:${word.id}`, word.id)).toEqual({ correct: true, skill: 'vocab' });
    expect(gradeAnswer('n5-01', `reading:${word.id}`, 'がくせい')).toEqual({ correct: true, skill: 'kanji' });
    expect(gradeAnswer('n5-01', `reading:${word.id}`, 'せんせい')?.correct).toBe(false);
    expect(gradeAnswer('n5-01', 'cloze:n5-ka', 'か')).toEqual({ correct: true, skill: 'grammar' });
  });

  it('rejects items that are not in the lesson', () => {
    expect(gradeAnswer('n5-02', `meaning:${word.id}`, word.id)).toBeNull();
    expect(gradeAnswer('n5-01', 'cloze:n5-no', 'の')).toBeNull();
    expect(gradeAnswer('nope', 'meaning:x', 'x')).toBeNull();
  });

  it('grades any N5 item for the mock exam (no lesson)', () => {
    expect(gradeAnswer(null, `meaning:${word.id}`, word.id)).toEqual({ correct: true, skill: 'vocab' });
    expect(gradeAnswer(null, 'cloze:n5-no', 'の')?.correct).toBe(true);
    expect(gradeAnswer(null, 'meaning:unknown', '')).toBeNull();
  });
});
