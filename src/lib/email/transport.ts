// Email sending behind one interface (P5 decision D6). Only the console transport exists until an
// email provider and sending domain are set up (backlog B4); `resend` fails closed instead of guessing.
export type EmailMessage = { to: string; subject: string; text: string; headers?: Record<string, string> };

export interface EmailTransport {
  readonly id: string;
  send(message: EmailMessage): Promise<void>;
}

/** Logs a masked recipient and the subject only, never the full address or body. */
export class ConsoleTransport implements EmailTransport {
  readonly id = 'console';
  constructor(private readonly log: (line: string) => void = console.log) {}
  async send(m: EmailMessage) {
    this.log(`[email:console] to=${maskEmail(m.to)} subject="${m.subject}"`);
  }
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  return `${name.slice(0, 1)}***@${domain ?? '?'}`;
}

export function transportFromEnv(env: Record<string, string | undefined> = process.env): EmailTransport {
  const kind = env.EMAIL_TRANSPORT ?? 'console';
  if (kind === 'console') return new ConsoleTransport();
  throw new Error(`EMAIL_TRANSPORT_NOT_CONFIGURED:${kind}`); // B4: wire Resend here
}
