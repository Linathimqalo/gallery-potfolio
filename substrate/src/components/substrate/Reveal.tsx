import { useEffect, useRef, useState, type ElementType } from 'react';

export function Reveal({ children, as: Tag = 'p', className = '', single = false }: { children: React.ReactNode; as?: ElementType; className?: string; single?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  if (typeof children !== 'string') {
    return <Tag ref={ref} className={`reveal ${single ? 'reveal-single' : ''} ${visible ? 'is-visible' : ''} ${className}`}>{children}</Tag>;
  }
  const words = children.split(' ');
  return <Tag ref={ref} className={`reveal ${single ? 'reveal-single' : ''} ${visible ? 'is-visible' : ''} ${className}`} aria-label={children}>{single ? children : words.map((word, i) => <span aria-hidden="true" className="reveal-word" key={i} style={{ '--word-index': Math.min(i, 11) } as React.CSSProperties}>{word}{i < words.length - 1 ? '\u00a0' : ''}</span>)}</Tag>;
}
