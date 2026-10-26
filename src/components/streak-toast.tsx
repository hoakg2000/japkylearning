'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import type { StreakInfo } from '@/lib/progress';
import { isMilestone } from '@/lib/streak';
import { playSound } from '@/lib/sound';

/** Inline streak feedback after an activity; celebrates milestones (F2). */
export function StreakToast({ streak }: { streak: StreakInfo }) {
  const t = useTranslations('Streak');
  const milestone = streak.goalMetToday && isMilestone(streak.current);

  useEffect(() => {
    if (streak.goalMetToday) playSound('streak');
  }, [streak.goalMetToday]);

  return (
    <div role="status" className="mx-auto max-w-sm rounded-card border border-warning/50 bg-warning/10 p-3 text-sm">
      <p className="font-medium">
        <span aria-hidden>🔥</span> {t('days', { count: streak.current })}
        {milestone && <span className="ml-2">🎉 {t('milestone', { count: streak.current })}</span>}
      </p>
      <p className="text-muted">{t('todayXp', { xp: streak.todayXp, goal: streak.goalXp })}</p>
    </div>
  );
}
