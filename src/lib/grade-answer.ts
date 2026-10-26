import { getGrammar, getLesson, getWord } from '@/lib/content/n5';

/**
 * Server-side grading of a lesson-test answer from its question id ("type:itemId"),
 * so clients cannot report their own correctness. Returns null for unknown questions.
 */
export function gradeAnswer(lessonId: string, questionId: string, answer: string): { correct: boolean; skill: string } | null {
  const lesson = getLesson(lessonId);
  const [type, itemId] = questionId.split(':', 2);
  if (!lesson || !itemId) return null;
  if (type === 'cloze') {
    const g = lesson.grammarIds.includes(itemId) ? getGrammar(itemId) : undefined;
    return g ? { correct: g.cloze.some((c) => c.blank === answer), skill: 'grammar' } : null;
  }
  const word = lesson.wordIds.includes(itemId) ? getWord(itemId) : undefined;
  if (!word) return null;
  if (type === 'meaning') return { correct: answer === word.id, skill: 'vocab' };
  if (type === 'listening') return { correct: answer === word.id, skill: 'listening' };
  if (type === 'reading') return { correct: answer === word.reading, skill: 'kanji' };
  return null;
}
