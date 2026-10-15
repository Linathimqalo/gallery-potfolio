import { createFileRoute } from '@tanstack/react-router';
import { useLayoutEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LivingField } from '@/components/substrate/LivingField';
import { Reveal } from '@/components/substrate/Reveal';
import { AmbientMotion } from '@/components/substrate/AmbientMotion';
import { portfolio } from '@/data/portfolio';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'SUBSTRATE — Linathi Mqalo | Cloud Security Engineer' },
    { name: 'description', content: 'Linathi Mqalo — Cloud, Infrastructure, Security, Systems. Explore cloud engineering projects, security research, and 5+ years of infrastructure experience.' },
    { property: 'og:title', content: 'SUBSTRATE — Linathi Mqalo' },
    { property: 'og:description', content: 'Building and securing cloud infrastructure across AWS and Azure. Selected work and experience by Linathi Mqalo.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const [dark, setDark] = useState(false);
  useLayoutEffect(() => { document.documentElement.classList.toggle('dark', dark); return () => document.documentElement.classList.remove('dark'); }, [dark]);
  return <>
    <LivingField dark={dark}/>
    <AmbientMotion/>
    <main className="portfolio">
      <a className="site-name" href="#hero" aria-label="SUBSTRATE home">SUBSTRATE</a>
      <nav className="minimal-nav" aria-label="Portfolio navigation">
        <a href="https://the-gallery-home.vercel.app" title="Back to gallery">← GALLERY</a>
        <Button variant="field" size="icon" className="theme-control" onClick={() => setDark(!dark)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} title={dark ? 'Light theme' : 'Dark theme'}>{dark ? '☼' : '☾'}</Button>
      </nav>
      <section id="hero" className="hero" aria-label="Linathi Mqalo portfolio">
        <div className="hero-inner">
          <Reveal className="meta eyebrow">[ PORTFOLIO · 2026 ]</Reveal>
          <Reveal as="h1" single>Linathi Mqalo</Reveal>
          <Reveal className="disciplines">Cloud · Infrastructure · Security · Systems</Reveal>
          <Reveal className="tagline">Building and securing cloud infrastructure across AWS and Azure.</Reveal>
          <div className="hero-links"><a className="text-link" href="#projects">View Work</a><a className="text-link" href="#contact">Get in Touch</a></div>
        </div>
        <a className="hero-bottom" href="#about" aria-label="About Linathi">↓</a>
      </section>
      <section id="about" className="section about-section">
        <Reveal as="h2" className="meta section-label">01 / About Me</Reveal>
        <div className="about-layout">
          <Reveal className="bio">{portfolio.bio}</Reveal>
          <div className="stats">
            <div className="stat"><Reveal className="stat-number">100+</Reveal><Reveal className="meta">Websites Managed</Reveal></div>
            <div className="stat"><Reveal className="stat-number">5+</Reveal><Reveal className="meta">Years Experience</Reveal></div>
          </div>
        </div>
        <div className="pillars">{portfolio.pillars.map(p => <div className="pillar" key={p.name}><Reveal as="h3">{p.name}</Reveal><Reveal>{p.description}</Reveal></div>)}</div>
      </section>
      <section id="skills" className="section skills-section">
        <Reveal as="h2" className="meta section-label">02 / Technical Skills</Reveal>
        {portfolio.skills.map(s => <div className="skills-group" key={s.name}><Reveal as="h3">{s.name}</Reveal>{' — '}<Reveal>{s.items}</Reveal></div>)}
      </section>
      <section id="experience" className="section experience-section">
        <Reveal as="h2" className="meta section-label">03 / Professional Experience</Reveal>
        {portfolio.roles.map(r => <article className="role" key={r.title}>
          <span className="ghost-year" aria-hidden="true">{r.year}</span>
          <Reveal as="h3">{r.title}</Reveal>
          <Reveal className="meta role-meta">{`${r.company} · ${r.dates} · ${r.location}`}</Reveal>
          <ul>{r.bullets.map(b => <li key={b}><span className="bullet" aria-hidden="true">·</span><Reveal>{b}</Reveal></li>)}</ul>
        </article>)}
      </section>
      <section id="projects" className="section projects-section">
        <Reveal className="meta section-label">04 / Projects</Reveal>
        <Reveal as="h2">Selected Work</Reveal>
        {portfolio.projects.map((p,i) => <article className={`project ${i < 2 ? 'featured' : i < 6 ? 'secondary' : 'compact'}`} key={p.title}>
          {i < 6 && <Reveal className="meta project-category">{p.category}</Reveal>}
          <h3><a className="project-title" href={p.url} target="_blank" rel="noopener noreferrer"><Reveal as="span">{p.title}</Reveal><span className="project-arrow" aria-hidden="true">→</span></a></h3>
          {i < 6 && <Reveal className="project-description">{p.description}</Reveal>}
          <Reveal className="project-tags">{p.tags}</Reveal>
        </article>)}
      </section>
      <section id="contact" className="section contact-section">
        <Reveal className="meta section-label">05 / Get In Touch</Reveal>
        <Reveal as="h2">Let's build something.</Reveal>
        <Reveal className="contact-intro">Ready to discuss your next project or explore collaboration opportunities? I'd love to hear from you.</Reveal>
        <div className="contact-items">
          {([['Email','mqalolinathi@gmail.com','mailto:mqalolinathi@gmail.com'],['Phone','(+27) 084 796 3615','tel:+27847963615'],['LinkedIn','linathi-mqalo','https://linkedin.com/in/linathi-mqalo-8ab653194'],['GitHub','Linathimqalo','https://github.com/Linathimqalo']] satisfies [string, string, string][]).map(([label,value,url]) => <div className="contact-item" key={label}><Reveal className="meta">{label}</Reveal><a href={url} target={url.startsWith('https') ? '_blank' : undefined} rel={url.startsWith('https') ? 'noopener noreferrer' : undefined}><Reveal as="span">{value}</Reveal></a></div>)}
        </div>
        <div className="contact-details"><div><Reveal className="meta">Response Time</Reveal><Reveal>I typically respond to messages within 24 hours during business days.</Reveal></div><div><Reveal className="meta">Location</Reveal><Reveal>Johannesburg, South Africa (Remote work available globally)</Reveal></div></div>
        <div className="contact-cta"><a href="mailto:mqalolinathi@gmail.com" className="text-link">Get in Touch →</a></div>
      </section>
      <footer className="closing"><Reveal>END · LINATHI MQALO · MMXXVI · SET IN NEWSREADER &amp; INTER</Reveal></footer>
    </main>
  </>;
}
