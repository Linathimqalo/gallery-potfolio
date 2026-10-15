import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

type Mode = 'light' | 'dark';
const ModeContext = createContext<{ mode: Mode; toggle: () => void }>({ mode: 'dark', toggle: () => {} });
export function ArchiveShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const defaultMode = pathname === '/' ? 'dark' : 'light';
  const [choice, setChoice] = useState<Mode | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const mode = choice ?? defaultMode;
  useEffect(() => {
    try { const stored = localStorage.getItem('archive-mode'); if (stored === 'light' || stored === 'dark') setChoice(stored); } catch { /* Reading remains available without storage. */ }
  }, []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => { document.documentElement.style.colorScheme = mode; }, [mode]);
  useEffect(() => {
    if (!menuOpen) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prior; document.removeEventListener('keydown', onKey); };
  }, [menuOpen]);
  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark'; setChoice(next);
    setAnnouncement(`${next === 'light' ? 'Reading' : 'Browsing'} mode enabled`);
    try { localStorage.setItem('archive-mode', next); } catch { /* Mode still works for this session. */ }
  };
  return <ModeContext.Provider value={{ mode, toggle }}>
    <div className={`archive-site ${mode === 'dark' ? 'dark' : 'light'}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <a href="https://the-gallery-home.vercel.app" className="gallery-link mono">← Gallery</a>
        <nav className="desktop-nav" aria-label="Primary navigation"><ArchiveNav /></nav>
        <Button variant="archive" className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}><span className={`hamburger ${menuOpen ? 'is-open' : ''}`}><span /><span /></span></Button>
        <Button variant="archive" className="mode-toggle" onClick={toggle} aria-label={`Switch to ${mode === 'dark' ? 'reading (light)' : 'browsing (dark)'} mode`} title={`Switch to ${mode === 'dark' ? 'reading' : 'browsing'} mode`}><span className={`mode-glyph ${mode}`} aria-hidden="true"><span className="sun">☼</span><span className="moon">☾</span></span></Button>
      </header>
      {menuOpen && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation"><ArchiveNav /><span className="mono menu-signature">The Archive · Linathi Mqalo</span></nav>}
      <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      {children}
      <footer className="site-footer"><span>Archive · Linathi Mqalo · MMXXVI</span><span>Set in IBM Plex Sans & JetBrains Mono</span></footer>
    </div>
  </ModeContext.Provider>;
}
function ArchiveNav() {
  return <><Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'active' }}>Index</Link><span className="nav-dot" aria-hidden="true">·</span><Link to="/about" activeProps={{ className: 'active' }}>About</Link></>;
}
export function useArchiveMode() { return useContext(ModeContext); }
