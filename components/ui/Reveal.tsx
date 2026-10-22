'use client';
import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/** Scroll-in reveal. Content is visible without JS (the hidden state only applies under html.js). */
export function Reveal({ as: Tag = 'div', className = '', children }: { as?: ElementType; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`rv ${className}`}>{children}</Tag>;
}
