// Chat tutor threads kept in sessionStorage only (P5 decision D4: no server tables in the beta).
// Kept behind this module so a later move to server storage changes one file.
export type ChatTurn = { role: 'user' | 'assistant'; content: string };
export type ChatThread = { id: string; title: string; turns: ChatTurn[] };
export type ChatStore = { threads: ChatThread[]; currentId: string | null };

const KEY = 'japky.chat.v1';
const MAX_THREADS = 10;

export function loadThreads(): ChatStore {
  try {
    const raw = sessionStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatStore) : null;
    if (parsed && Array.isArray(parsed.threads)) return parsed;
  } catch {
    // storage blocked or corrupt: start empty
  }
  return { threads: [], currentId: null };
}

export function saveThreads(store: ChatStore) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...store, threads: store.threads.slice(0, MAX_THREADS) }));
  } catch {
    // quota or private mode: history stays in memory only
  }
}

export function newThread(): ChatThread {
  return { id: crypto.randomUUID(), title: '', turns: [] };
}
