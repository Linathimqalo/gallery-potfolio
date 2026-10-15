import { createFileRoute } from '@tanstack/react-router';
import { profile, portfolios } from '@/content/archive';
export const Route = createFileRoute('/about')({ head: () => ({ meta: [
  { title: 'Why this exists — The Archive · Linathi Mqalo' },
  { name: 'description', content: 'The source material behind Atlas, Obsidian and Substrate. Learn why The Archive exists.' },
  { property: 'og:title', content: 'Why this exists — The Archive' },
  { property: 'og:description', content: 'The actual work, behind three portfolio interpretations.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: About });
function About() {
  return <main id="main" className="about-page page-enter"><header><span className="mono">[ About the archive ]</span><h1>Why this exists</h1></header><div className="about-copy"><p>{profile.bio}</p><p>Different presentations can offer different perspectives. The work itself should remain readable, navigable, and shareable — without an interface standing between you and the details.</p><p>This is a technical record, not another interpretation.</p></div><section className="interpretations" aria-labelledby="interpretations-title"><div className="interpretations-heading"><h2 id="interpretations-title" className="mono">Three interpretations. One body of work.</h2><span className="mono">01—03</span></div>{portfolios.map((portfolio, index) => <div className="portfolio-row" key={portfolio.name}><span className="mono">0{index + 1}</span><h3>{portfolio.name}</h3><span className="mono">{portfolio.label}</span>{portfolio.url ? <a className="mono" href={portfolio.url}>Visit →</a> : <span className="mono awaiting-link">URL forthcoming</span>}</div>)}</section><div className="about-signoff"><span className="mono">Maintained by {profile.name}</span><span className="mono">The Archive · MMXXVI</span></div></main>;
}
