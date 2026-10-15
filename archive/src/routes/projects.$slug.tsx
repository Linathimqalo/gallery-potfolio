import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { projects, displayDate } from '@/content/archive';
import { Block } from '@/components/archive/blocks';
export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => { const project = projects.find(item => item.slug === params.slug); if (!project) throw notFound(); return { project, next: projects[(projects.indexOf(project) + 1) % projects.length] }; },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.project.title ?? 'Project unavailable'} — The Archive` },
    { name: 'description', content: loaderData?.project.summary ?? 'The Archive technical case studies.' },
    { property: 'og:title', content: `${loaderData?.project.title ?? 'Project unavailable'} — The Archive` },
    { property: 'og:description', content: loaderData?.project.summary ?? 'The Archive technical case studies.' },
    { property: 'og:type', content: 'article' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: ProjectPage,
});
function ProjectPage() {
  const { project, next } = Route.useLoaderData();
  const [active, setActive] = useState(project.sections[0]?.id ?? '');
  useEffect(() => {
    setActive(project.sections[0]?.id ?? '');
    const updateActive = () => {
      let current = project.sections[0]?.id ?? '';
      for (const section of project.sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 180) current = section.id;
      }
      setActive(current);
    };
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, [project]);
  const opening = project.executiveSummary.indexOf('.');
  return <main id="main" className="case-page page-enter" key={project.slug}>
    <nav className="reading-rail" aria-label="Case study sections"><span className="mono rail-label">In this study</span>{project.sections.map((section, index) => <a key={section.id} href={`#${section.id}`} className={active === section.id ? 'active' : ''} aria-current={active === section.id ? 'location' : undefined}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a>)}</nav>
    <article className="case-article">
      <header className="case-header"><nav className="mono breadcrumb" aria-label="Breadcrumb"><Link to="/">Index</Link><span>/</span><span>{project.category}</span><span>/</span><span>{project.title}</span></nav><span className="mono edition-label">Case study · Placeholder edition</span><h1>{project.title}</h1><p className="case-subtitle">{project.summary}</p><div className="mono case-meta"><time dateTime={project.date}>{displayDate(project.date)}</time><span>{project.category}</span><span>{project.tools.join(', ')}</span></div><div className="tags">{project.tags.map(tag => <span className="mono tag" key={tag}>{tag}</span>)}</div></header>
      <div className="executive-summary"><span className="mono block-label">Executive summary</span><p><em>{project.executiveSummary.slice(0, opening + 1)}</em>{project.executiveSummary.slice(opening + 1)}</p></div>
      {project.sections.map((section, index) => <section id={section.id} className="case-section" key={section.id}><h2><a className="section-anchor mono" href={`#${section.id}`} aria-label={`Link to ${section.title}`}>{String(index + 1).padStart(2, '0')} —</a>{section.title}</h2>{section.blocks.map((block, i) => <Block key={`${section.id}-${i}`} block={block} />)}</section>)}
      <nav className="case-bottom mono" aria-label="Project navigation"><Link to="/">← Back to index</Link>{next && <Link to="/projects/$slug" params={{ slug: next.slug }}><span>Next project →</span><span className="next-title">{next.title}</span></Link>}</nav>
    </article>
  </main>;
}
