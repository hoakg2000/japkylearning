import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getDb } from '@/lib/db';
import { userSettings } from '@/lib/db/schema';
import { getStreak } from '@/lib/progress';

// Opt-in public streak widget (F12, P7 decision G5). Shows the streak numbers only: no name, no session, no cookies.
// Unknown, rotated and switched-off ids all look the same (not found). Cache-Control: no-store is set in next.config.ts.
export default function StreakEmbed({ params }: { params: Promise<{ publicId: string }> }) {
  return (
    <Suspense fallback={<div className="h-24 animate-pulse rounded-card bg-surface-2" />}>
      <StreakCard params={params} />
    </Suspense>
  );
}

async function StreakCard({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  if (!/^[A-Za-z0-9_-]{22}$/.test(publicId)) notFound();
  const db = await getDb();
  const [row] = await db.select({ userId: userSettings.userId }).from(userSettings).where(eq(userSettings.streakPublicId, publicId));
  if (!row) notFound();
  const streak = await getStreak(row.userId);
  return (
    <figure className="flex items-center gap-4 rounded-card border border-line bg-surface p-4">
      <span aria-hidden className="text-5xl">🔥</span>
      <figcaption>
        <p className="text-3xl font-bold">
          {streak.current} <span className="l-vi text-base font-normal">ngày liên tiếp</span>
          <span className="l-en text-base font-normal">day streak</span>
        </p>
        <p className="text-sm text-muted">
          <span className="l-vi">Dài nhất: {streak.longest} ngày · học tiếng Nhật với Japky</span>
          <span className="l-en">Longest: {streak.longest} days · learning Japanese with Japky</span>
        </p>
      </figcaption>
    </figure>
  );
}
