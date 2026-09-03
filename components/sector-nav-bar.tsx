'use client';

import React, { useRef, useState, useEffect } from 'react';

interface SectorItem {
  id: string;
  code: string;
  name: string;
  slug: string;
}

export default function SectorNavBar({ sectors }: { sectors: SectorItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 1.5, behavior: 'smooth' });
      }
    };

    el.addEventListener('scroll', checkScroll, { passive: true });
    el.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      el.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="sector-scroll-wrapper">
      <button
        type="button"
        className={`scroll-arrow scroll-left ${canScrollLeft ? 'visible' : ''}`}
        onClick={() => scroll('left')}
        aria-label="Scroll left to see more sectors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="nav-grid" ref={scrollRef}>
        {sectors.map((s) => (
          <a href={`#${s.slug}`} className="nav-item" key={s.id}>
            <span className="code-badge">{s.code}</span>
            <span>{s.name}</span>
          </a>
        ))}
      </div>

      <button
        type="button"
        className={`scroll-arrow scroll-right ${canScrollRight ? 'visible' : ''}`}
        onClick={() => scroll('right')}
        aria-label="Scroll right to see more sectors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
