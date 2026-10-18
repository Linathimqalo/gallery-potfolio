import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { projects, displayDate } from '@/content/archive';
export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'The Work — The Archive · Linathi Mqalo' },
    { name: 'description', content: 'The technical work of Linathi Mqalo. Every project, its case study, and the reasoning behind it. Nothing hidden.' },
    { property: 'og:title', content: 'The Work — The Archive' },
    { property: 'og:description', content: 'A documentary index of Linathi Mqalo’s technical work.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: Index,
});
const filters = ['All', 'Cloud', 'Security', 'Network', 'Research'];
function Index() {
  const [filter, setFilter] = useState('All');
  const visible = projects.filter(project => filter === 'All' || project.category.toLowerCase().includes(filter.toLowerCase()));
  return <main id="main" className="index-page page-enter">
    <header className="index-header"><div className="index-eyebrow"><span className="mono">[ Index ]</span><span className="mono archive-wordmark">The Archive / 001—003</span></div><h1>The Work</h1><p className="index-description">Every project, its case study, and the reasoning behind it. Nothing hidden.</p><div className="index-byline"><span className="mono">Linathi Mqalo</span><span className="mono">Technical work · Selected projects</span></div><a className="mono gallery-back" href="https://the-gallery-home.vercel.app">← GALLERY</a></header>
    <div className="filter-bar"><div className="filters" role="group" aria-label="Filter projects">{filters.map(item => <Button key={item} variant="archive" className={`filter-button ${filter === item ? 'selected' : ''}`} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</Button>)}</div><span className="mono project-count">{String(visible.length).padStart(2, '0')} projects</span></div>
    <section aria-label="Projects" className="project-list">{visible.map(project => <Link className="project-row" key={project.slug} to="/projects/$slug" params={{ slug: project.slug }}>
      <div className="project-meta"><span className="mono">{project.category}</span><span className="mono project-date">{displayDate(project.date)}</span><span className="mono featured-label">Featured</span></div>
      <div className="project-info"><h2><span>{project.title}</span></h2><p>{project.summary}</p><span className="mono project-tools">{project.tools.slice(0, 3).join(' / ')}</span></div>
      <span className="mono read-link">Read <span aria-hidden="true">→</span></span>
    </Link>)}</section>
    <div className="index-end mono"><span>10 records · An ongoing body of work</span><span>Placeholder edition</span></div>
  </main>;
}
