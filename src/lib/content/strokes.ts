import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Strokes } from './schemas';

const hex = (c: string) => c.codePointAt(0)!.toString(16).padStart(5, '0');

/** KanjiVG stroke paths for one character, or null when not available. */
export async function getStrokes(char: string): Promise<string[] | null> {
  'use cache';
  try {
    const file = path.join(process.cwd(), 'public', 'strokes', `${hex(char)}.json`);
    return (JSON.parse(await readFile(file, 'utf8')) as Strokes).strokes;
  } catch {
    return null;
  }
}
