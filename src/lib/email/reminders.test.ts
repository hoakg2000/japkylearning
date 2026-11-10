import { describe, expect, it } from 'vitest';
import { localHour, reminderEmail, shouldRemind, unsubscribeToken, verifyUnsubscribe, type Candidate } from './reminders';
import { ConsoleTransport, maskEmail, transportFromEnv } from './transport';

// 2026-11-10 12:30 UTC = 19:30 in Ho Chi Minh City, 21:30 in Tokyo.
const now = new Date('2026-11-10T12:30:00Z');
const base: Candidate = { reminderHour: 19, timezone: 'Asia/Ho_Chi_Minh', lastRemindedOn: null, consent: true, goalMetToday: false };

describe('reminders', () => {
  it('uses the learner time zone for the hour', () => {
    expect(localHour(now, 'Asia/Ho_Chi_Minh')).toBe(19);
    expect(localHour(now, 'Asia/Tokyo')).toBe(21);
  });

  it('sends only with consent, in the chosen hour, once per day, before the goal is met', () => {
    expect(shouldRemind(base, now)).toBe(true);
    expect(shouldRemind({ ...base, consent: false }, now)).toBe(false);
    expect(shouldRemind({ ...base, reminderHour: 20 }, now)).toBe(false);
    expect(shouldRemind({ ...base, lastRemindedOn: '2026-11-10' }, now)).toBe(false);
    expect(shouldRemind({ ...base, lastRemindedOn: '2026-11-09' }, now)).toBe(true);
    expect(shouldRemind({ ...base, goalMetToday: true }, now)).toBe(false);
  });

  it('signs unsubscribe links per user', () => {
    const t = unsubscribeToken('u1', 's');
    expect(verifyUnsubscribe('u1', t, 's')).toBe(true);
    expect(verifyUnsubscribe('u2', t, 's')).toBe(false);
    expect(verifyUnsubscribe('u1', t, 'other')).toBe(false);
    expect(verifyUnsubscribe('u1', 'short', 's')).toBe(false);
  });

  it('every email carries the unsubscribe link and header', () => {
    const m = reminderEmail('a@b.c', 'https://x/unsub', 'https://x');
    expect(m.text).toContain('https://x/unsub');
    expect(m.headers?.['List-Unsubscribe']).toBe('<https://x/unsub>');
  });

  it('console transport logs a masked address only; unknown transports fail closed', async () => {
    const lines: string[] = [];
    await new ConsoleTransport((l) => lines.push(l)).send({ to: 'learner@example.com', subject: 's', text: 'body' });
    expect(lines[0]).toContain('l***@example.com');
    expect(lines[0]).not.toContain('body');
    expect(maskEmail('x@y.z')).toBe('x***@y.z');
    expect(() => transportFromEnv({ EMAIL_TRANSPORT: 'resend' })).toThrow('NOT_CONFIGURED');
  });
});
