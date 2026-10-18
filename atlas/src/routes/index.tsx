import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { portfolio } from '@/data/portfolio';
import { adjacentPage, journalPages, pageCounter } from '@/lib/journal-navigation';

const pages = journalPages;
const pageIds = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'ATLAS — Linathi Mqalo | Cloud Security Engineer' },
    { name: 'description', content: 'The practice, technical index and selected work of Linathi Mqalo. Building and securing cloud infrastructure across AWS and Azure.' },
    { property: 'og:title', content: 'ATLAS — Linathi Mqalo' },
    { property: 'og:description', content: 'A six-page technical journal of cloud, infrastructure, security and systems.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Atlas,
});

function PageHeader({ number, label, title }: { number: string; label: string; title: string }) {
  return <header className="page-header"><p className="mono section-number">[ {number} — {label} ]</p><h2>{title}</h2><hr className="rule" /></header>;
}

function Atlas() {
  const track = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);
  const activeRef = useRef(0);

  const goToPage = (index: number) => {
    const container = track.current;
    const target = container?.children.item(index);
    if (!(target instanceof HTMLElement) || !container) return;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    if (window.matchMedia('(max-width: 768px)').matches) target.scrollIntoView({ behavior, block: 'start' });
    else container.scrollTo({ left: index * container.clientWidth, behavior });
  };

  useEffect(() => {
    const saved = localStorage.getItem('atlas-theme') === 'dark';
    setDark(saved);
    document.documentElement.classList.toggle('dark', saved);
    window.scrollTo(0, 0);
    const container = track.current;
    if (!container) return;
    const update = () => {
      let index = 0;
      if (window.matchMedia('(max-width: 768px)').matches) {
        Array.from(container.children).forEach((child, i) => {
          if (child.getBoundingClientRect().top <= window.innerHeight * .4) index = i;
        });
      } else index = Math.round(container.scrollLeft / container.clientWidth);
      activeRef.current = index;
      setActive(index);
    };
    const wheel = (event: WheelEvent) => {
      if (window.matchMedia('(max-width: 768px)').matches || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const page = container.children.item(activeRef.current);
      if (!(page instanceof HTMLElement)) return;
      const canScroll = event.deltaY > 0 ? page.scrollTop + page.clientHeight < page.scrollHeight - 2 : page.scrollTop > 2;
      if (canScroll) return;
      event.preventDefault();
      container.scrollLeft += event.deltaY;
    };
    const key = (event: KeyboardEvent) => {
      if (window.matchMedia('(max-width: 768px)').matches || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof HTMLElement && (event.target.matches('input,textarea,select') || event.target.isContentEditable)) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPage(adjacentPage(activeRef.current, event.key === 'ArrowRight' ? 1 : -1));
      }
    };
    container.addEventListener('scroll', update, { passive: true });
    container.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('keydown', key);
    return () => {
      container.removeEventListener('scroll', update);
      container.removeEventListener('wheel', wheel);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('keydown', key);
      document.documentElement.classList.remove('dark');
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 768px), (pointer: coarse)').matches) return;
    let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    let lastTime = 0;
    const animate = (time: number) => {
      const fraction = Math.min(1, (time - lastTime) / 120);
      lastTime = time;
      x += (targetX - x) * fraction;
      y += (targetY - y) * fraction;
      if (cursor.current) cursor.current.style.transform = `translate(${x + 8}px, ${y + 8}px)`;
      frame = requestAnimationFrame(animate);
    };
    const move = (event: PointerEvent) => {
      targetX = event.clientX; targetY = event.clientY;
      if (cursor.current) cursor.current.style.opacity = '1';
      clearTimeout(timer);
      timer = setTimeout(() => { if (cursor.current) cursor.current.style.opacity = '0'; }, 2000);
    };
    frame = requestAnimationFrame(animate);
    window.addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); window.removeEventListener('pointermove', move); };
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('atlas-theme', next ? 'dark' : 'light');
  };

  return <>
    <aside className="spine" aria-label="Reading position"><span className="mono spine-label">ATLAS · VOL. 01</span><div className="spine-rule" /><span className="mono page-counter">{pageCounter(active)}</span></aside>
    <div className="fixed-tools"><Button variant="journal" asChild><a href="https://the-gallery-home.vercel.app">← GALLERY</a></Button><Button variant="journal" className="theme-control" onClick={toggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} title={dark ? 'Light theme' : 'Dark theme'}><span className="theme-glyph" aria-hidden="true" /></Button></div>
    <nav className="page-navigation" aria-label="Journal pages">{pages.map((page, index) => <Button key={page} variant="dot" onClick={() => goToPage(index)} aria-label={`Go to ${page}`} aria-current={active === index ? 'page' : undefined}><span className="dot-name mono">{page}</span><span className="nav-dot" /></Button>)}</nav>
    <Button variant="journal" className="nav-arrow nav-arrow-left" onClick={() => goToPage(adjacentPage(active, -1))} aria-label="Previous page" disabled={active === 0}>←</Button>
    <Button variant="journal" className="nav-arrow nav-arrow-right" onClick={() => goToPage(adjacentPage(active, 1))} aria-label="Next page" disabled={active === pages.length - 1}>→</Button>
    <div ref={cursor} className="reading-cursor" aria-hidden="true" />
    <main ref={track} className="atlas-track" aria-label="ATLAS portfolio">
      <section className="journal-page cover-page" id={pageIds[0]} aria-label="Cover"><div className="page-content">
        <div className="cover-masthead"><span className="atlas-wordmark">ATLAS</span><span className="mono meta">VOL. 01 · MMXXVI</span></div>
        <div className="cover-spread"><h1 className="cover-name">Linathi<br />Mqalo</h1><div className="cover-details"><p className="mono">[ PORTFOLIO · 2026 ]</p><hr className="rule" /><p className="mono cover-role">Cloud · Infrastructure ·<br /> Security · Systems</p><p className="cover-tagline">Building and securing cloud infrastructure across AWS and Azure.</p><p className="mono meta">Johannesburg, South Africa</p></div></div>
        <hr className="rule" /><div className="cover-stats"><div><p className="stat-number">100+</p><p className="mono meta">Websites managed</p></div><div><p className="stat-number">5+</p><p className="mono meta">Years experience</p></div></div>
        <div className="cover-bottom"><span className="mono meta">Cloud Security Engineer</span><Button variant="journal" onClick={() => goToPage(1)} className="editorial-link">THE PRACTICE →</Button></div>
      </div></section>
      <section className="journal-page" id="about" aria-label="About"><div className="page-content"><PageHeader number="01" label="About" title="The Practice" /><div className="about-spread"><div className="pillars">{portfolio.pillars.map(pillar => <div className="pillar" key={pillar.name}><h3 className="mono">{pillar.name}</h3><p>{pillar.description}</p></div>)}</div><p className="bio">{portfolio.bio}</p></div></div></section>
      <section className="journal-page" id="skills" aria-label="Skills"><div className="page-content"><PageHeader number="02" label="Skills" title="The Index" /><div className="skill-grid">{portfolio.skills.map(group => <div className="skill-group" key={group.name}><h3>{group.name}</h3><p className="mono">{group.skills}</p></div>)}</div></div></section>
      <section className="journal-page" id="experience" aria-label="Experience"><div className="page-content"><PageHeader number="03" label="Experience" title="The Record" /><div>{portfolio.experience.map(role => <article className="experience-role" key={role.title}><p className="mono meta role-dates">{role.dates}</p><div className="role-heading"><h3>{role.title}</h3><p className="mono meta">{role.company}<br />{role.location}</p></div><ul className="role-bullets">{role.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></article>)}</div></div></section>
      <section className="journal-page" id="projects" aria-label="Projects"><div className="page-content"><PageHeader number="04" label="Projects" title="Selected Work" />{portfolio.projects.slice(0,2).map(project => <article className="featured-project" key={project.title}><div className="project-meta"><p className="mono featured-label">Featured</p><p className="mono meta">{project.category}</p><p className="mono meta">{project.tags}</p></div><div className="featured-body"><h3><a className="project-title-link" href={project.url ?? undefined} target="_blank" rel="noreferrer">{project.title}</a></h3><p className="project-description">{project.description}</p></div><div className="project-actions">{project.url && <a className="mono editorial-link project-view" href={project.url} target="_blank" rel="noreferrer" aria-label={`View ${project.title}`}>VIEW →</a>}{project.caseStudy && <a className="mono editorial-link case-study-link" href={project.caseStudy} target="_blank" rel="noreferrer">READ FULL CASE STUDY →</a>}</div></article>)}<div className="secondary-grid">{portfolio.projects.slice(2,4).map(project => <article className="secondary-project" key={project.title}><h3><a className="project-title-link" href={project.url ?? undefined} target="_blank" rel="noreferrer">{project.title}</a></h3><p className="project-description">{project.description}</p><p className="mono meta">{project.tags}</p>{project.url && <a className="mono editorial-link project-view" href={project.url} target="_blank" rel="noreferrer">VIEW →</a>}{project.caseStudy && <a className="mono editorial-link case-study-link" href={project.caseStudy} target="_blank" rel="noreferrer">READ FULL CASE STUDY →</a>}</article>)}</div><div className="compact-grid">{portfolio.projects.slice(4).map(project => <article className="compact-project" key={project.title}><h3><span className="project-title-link" style={{ opacity: (project.caseStudy || project.url) ? 1 : 0.5, cursor: (project.caseStudy || project.url) ? 'pointer' : 'default' }}>{project.title}</span></h3><p className="mono meta" style={{ opacity: (project.caseStudy || project.url) ? 1 : 0.5 }}>{project.caseStudy ? <a href={project.caseStudy} target="_blank" rel="noreferrer">{project.tags}</a> : project.url ? <a href={project.url} target="_blank" rel="noreferrer">{project.tags}</a> : project.tags + (project.tags ? ' · ' : '') + 'COMING SOON'}</p></article>)}</div></div></section>
      <section className="journal-page" id="contact" aria-label="Contact"><div className="page-content"><PageHeader number="05" label="Contact" title="Colophon" /><h3 className="contact-invitation">Let's build something.</h3><div className="contact-grid">
        <ContactItem label="Email"><a className="editorial-link" href="mailto:mqalolinathi@gmail.com">mqalolinathi@gmail.com</a></ContactItem>
        <ContactItem label="Phone"><a className="project-title-link" href="tel:+27847963615">(+27) 084 796 3615</a></ContactItem>
        <ContactItem label="LinkedIn"><a className="project-title-link" href="https://linkedin.com/in/linathi-mqalo-8ab653194" target="_blank" rel="noreferrer">linathi-mqalo →</a></ContactItem>
        <ContactItem label="GitHub"><a className="project-title-link" href="https://github.com/Linathimqalo" target="_blank" rel="noreferrer">Linathimqalo →</a></ContactItem>
        <ContactItem label="Location">Johannesburg, South Africa (Remote work available globally)</ContactItem>
        <ContactItem label="Response time">I typically respond to messages within 24 hours during business days.</ContactItem>
      </div><footer className="mono meta colophon">END · LINATHI MQALO · MMXXVI · SET IN FRAUNCES &amp; INTER</footer></div></section>
    </main>
  </>;
}

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="contact-item"><span className="mono meta">{label}</span><div className="contact-value">{children}</div></div>;
}
