'use client';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Renders `children` while the event is still on, `over` afterwards.
 * The server passes a build-time guess; the browser corrects it from the real clock, so a static event page
 * stops offering tickets after the night without needing a redeploy.
 */
export function UpcomingOnly({ endsAt, initiallyOver, over, children }: { endsAt: string; initiallyOver: boolean; over: ReactNode; children: ReactNode }) {
  const [done, setDone] = useState(initiallyOver);
  useEffect(() => { setDone(Date.now() > new Date(endsAt).getTime()); }, [endsAt]);
  return <>{done ? over : children}</>;
}
