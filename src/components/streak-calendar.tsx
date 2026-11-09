import { getTranslations } from 'next-intl/server';
import type { StreakInfo } from '@/lib/progress';
import { addDays } from '@/lib/streak';

/** 12-week heatmap of study days (server component). */
export async function StreakCalendar({ streak, today }: { streak: StreakInfo; today: string }) {
  const t = await getTranslations('Streak');
  const byDate = new Map(streak.history.map((d) => [d.date, d]));
  const days = Array.from({ length: 84 }, (_, i) => addDays(today, i - 83));
  const level = (xp: number, kept: boolean) => (!kept && xp === 0 ? 'bg-surface-2' : !kept ? 'bg-warning/30' : xp >= streak.goalXp * 2 ? 'bg-success' : 'bg-success/60');

  return (
    <figure>
      <div className="grid grid-flow-col grid-rows-7 gap-1" role="img" aria-label={t('calendar')}>
        {days.map((d) => {
          const row = byDate.get(d);
          return <span key={d} title={`${d}: ${row?.xp ?? 0} XP`} className={`size-3 rounded-sm ${level(row?.xp ?? 0, row?.kept ?? false)}`} />;
        })}
      </div>
      <figcaption className="mt-2 text-xs text-muted">{t('calendarHint')}</figcaption>
    </figure>
  );
}
