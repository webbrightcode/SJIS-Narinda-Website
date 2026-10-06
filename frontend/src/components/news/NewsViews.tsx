'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { incrementNewsView } from '@/lib/api';

/** Counts one read per page visit and shows the live total. */
export function NewsViews({ id, initial }: { id: number; initial: number }) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    incrementNewsView(id).then((c) => {
      if (!cancelled && typeof c === 'number') setCount(c);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <span className="inline-flex items-center gap-1.5">
      <Eye className="w-3.5 h-3.5" /> {count.toLocaleString()} reads
    </span>
  );
}
