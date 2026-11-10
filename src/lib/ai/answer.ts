// Chat tutor (F8) limits and answer parsing shared with the client. No zod here: keeps it out of the client bundle.

/** Turns sent to the model per request (client keeps the thread, P5 decision D4). */
export const MAX_TURNS = 8;
export const MAX_CHARS = 600;

export type AnswerPart = { text: string } | { surface: string; reading: string };

/** Splits an answer into plain text and `{base|reading}` furigana parts. Data only, never HTML. */
export function answerParts(answer: string): AnswerPart[] {
  const parts: AnswerPart[] = [];
  let last = 0;
  for (const m of answer.matchAll(/\{([^|{}\n]{1,20})\|([\p{Script=Hiragana}\p{Script=Katakana}ー]{1,30})\}/gu)) {
    if (m.index > last) parts.push({ text: answer.slice(last, m.index) });
    parts.push({ surface: m[1], reading: m[2] });
    last = m.index + m[0].length;
  }
  if (last < answer.length) parts.push({ text: answer.slice(last) });
  return parts;
}
