import type { PortfolioContent } from "@/content/content";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditionSwitch } from "@/shared/EditionSwitch";
import { SectionAnchor } from "@/shared/SectionAnchor";
import { Reveal, SectionLabel } from "./AtlasMotion";

export function AtlasApp({ content }: { content: PortfolioContent }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [active, setActive] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("linathi:atlas-theme");
      if (stored === "dark" || stored === "light") setMode(stored);
    } catch { /* Theme selection also works without storage. */ }
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-15% 0px -60% 0px" });
    content.sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [content]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (menuOpen) {
      dialog.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previousOverflow; dialog.close(); };
    }
    dialog.close();
    return undefined;
  }, [menuOpen]);

  function toggleTheme() {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    try { localStorage.setItem("linathi:atlas-theme", next); } catch { /* Optional storage. */ }
  }

  const nav = (mobile = false) => content.sections.map((section) => (
    <a key={section.id} className={`atlas-nav-link atlas-underline ${active === section.id ? "is-active" : ""}`}
      href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined}
      onClick={() => { setActive(section.id); if (mobile) setMenuOpen(false); }}>
      <span>{section.number}</span> {section.label}
    </a>
  ));

  return (
    <div className="atlas" data-edition="atlas" data-mode={mode}>
      <a className="atlas-skip" href="#hero">{content.controls.skip}</a>
      <header className="atlas-topbar">
        <div className="atlas-topbar-inner">
          <a href="#hero" className="atlas-wordmark">{content.person.name}</a>
          <nav className="atlas-desktop-nav" aria-label="Main navigation">{nav()}</nav>
          <div className="atlas-topbar-tools">
            <Button variant="atlasIcon" size="icon" onClick={toggleTheme}
              aria-label={mode === "light" ? content.controls.dark : content.controls.light}
              title={mode === "light" ? content.controls.dark : content.controls.light}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>
                  {mode === "light" ? <Moon size={17} /> : <Sun size={17} />}
                </motion.span>
              </AnimatePresence>
            </Button>
            <div className="atlas-desktop-editions"><EditionSwitch /></div>
            <Button variant="atlasIcon" size="icon" className="atlas-menu-button" aria-label={content.controls.openMenu}
              aria-expanded={menuOpen} aria-controls="atlas-mobile-menu" onClick={() => setMenuOpen(true)}><Menu size={20} /></Button>
          </div>
        </div>
      </header>

      <dialog ref={dialogRef} id="atlas-mobile-menu" className="atlas-mobile-menu" onCancel={() => setMenuOpen(false)} aria-label="Main navigation">
        <div className="atlas-menu-header"><a className="atlas-wordmark" href="#hero" onClick={() => setMenuOpen(false)}>{content.person.name}</a>
          <Button variant="atlasIcon" size="icon" aria-label={content.controls.closeMenu} onClick={() => setMenuOpen(false)}><X /></Button></div>
        <nav>{nav(true)}</nav>
        <EditionSwitch />
      </dialog>

      <main>
        <SectionAnchor id="hero" className="atlas-hero atlas-container">
          <Reveal className="atlas-grid">
            <div className="atlas-hero-copy">
              <p className="atlas-mono atlas-eyebrow">{content.hero.label}</p>
              <h1>{content.person.name}</h1>
              <p className="atlas-mono atlas-disciplines">{content.hero.disciplines}</p>
              <p className="atlas-hero-tagline">{content.hero.tagline}</p>
            </div>
            <div className="atlas-hero-margin" aria-hidden="true"><span className="atlas-mono">{content.person.role}</span><span className="atlas-mono">{content.person.location}</span></div>
          </Reveal>
          <div className="atlas-metrics">
            {content.hero.metrics.map((metric, i) => <Reveal className="atlas-metric" key={metric.label} index={i}><span className="atlas-metric-value">{metric.value}</span><span className="atlas-mono">{metric.label}</span></Reveal>)}
          </div>
        </SectionAnchor>

        <SectionAnchor id="about" className="atlas-section">
          <div className="atlas-container">
            <div className="atlas-grid atlas-editorial">
              <div className="atlas-label-column"><SectionLabel {...content.sections[0]} /></div>
              <Reveal className="atlas-body-column"><p className="atlas-bio">{content.about.bio}</p></Reveal>
            </div>
            <div className="atlas-domains">{content.about.domains.map((domain, i) => <Reveal key={domain.label} index={i} className="atlas-domain"><h3 className="atlas-mono">{domain.label}</h3><p>{domain.description}</p></Reveal>)}</div>
          </div>
        </SectionAnchor>

        <SectionAnchor id="skills" className="atlas-section">
          <div className="atlas-container atlas-grid atlas-editorial">
            <div className="atlas-label-column"><SectionLabel {...content.sections[1]} /></div>
            <div className="atlas-body-column atlas-skill-index">{content.skills.map((skill, i) => <Reveal key={skill.group} index={i} className="atlas-skill-row"><h3>{skill.group}</h3><p className="atlas-mono atlas-technologies">{skill.technologies.join(", ")}</p></Reveal>)}</div>
          </div>
        </SectionAnchor>

        <SectionAnchor id="experience" className="atlas-section">
          <div className="atlas-container atlas-grid atlas-editorial">
            <div className="atlas-label-column"><SectionLabel {...content.sections[2]} /></div>
            <div className="atlas-body-column">{content.experience.map((role, i) => <Reveal key={role.company} index={i} className="atlas-experience-entry"><p className="atlas-mono atlas-dates">{role.dates}</p><div><h3>{role.role}</h3><p className="atlas-mono atlas-company">{role.company} · {role.location}</p><ul>{role.wins.map((win) => <li key={win}><span className="atlas-mono" aria-hidden="true">·</span><span>{win}</span></li>)}</ul></div></Reveal>)}</div>
          </div>
        </SectionAnchor>

        <SectionAnchor id="projects" className="atlas-section">
          <div className="atlas-container">
            <Reveal className="atlas-project-opener"><SectionLabel {...content.sections[3]} /><h3>{content.projects.heading}</h3></Reveal>
            {content.projects.featured.map((project, i) => <Reveal key={project.title} index={i} className="atlas-featured atlas-grid">
              <div className="atlas-project-meta"><span className="atlas-featured-label atlas-mono">{content.projects.featuredLabel}</span><p className="atlas-mono">{project.category} · {project.year}</p><p className="atlas-mono atlas-project-tags">{project.tags.join(", ")}</p></div>
              <div className="atlas-project-body"><h4><a className="atlas-underline" href={project.href} target="_blank" rel="noreferrer">{project.title}</a></h4><p>{project.description}</p></div>
              <div className="atlas-project-action"><a className="atlas-view-link atlas-mono atlas-underline" href={project.href} target="_blank" rel="noreferrer">{content.projects.viewLabel} <span className="atlas-arrow" aria-hidden="true">→</span></a></div>
            </Reveal>)}
            <div className="atlas-secondary-projects">{content.projects.secondary.map((project, i) => <Reveal key={project.title} index={i} className="atlas-secondary-project"><p className="atlas-mono atlas-project-category">{project.category}</p><h4>{project.href ? <a className="atlas-underline" href={project.href} target="_blank" rel="noreferrer">{project.title}<span className="atlas-arrow" aria-hidden="true"> ↗</span></a> : project.title}</h4><p>{project.description}</p><p className="atlas-mono atlas-project-tags">{project.tags.join(", ")}</p></Reveal>)}</div>
            <div className="atlas-project-index">{content.projects.index.map((project, i) => <Reveal key={project.title} index={i} className="atlas-index-entry">{project.href ? <a href={project.href} className="atlas-index-link" target="_blank" rel="noreferrer"><h4 className="atlas-underline">{project.title}</h4><span className="atlas-arrow" aria-hidden="true">→</span><p className="atlas-mono">{project.tags.join(", ")}</p></a> : <details><summary><h4 className="atlas-underline">{project.title}</h4><span className="atlas-arrow" aria-hidden="true">→</span><p className="atlas-mono">{project.tags.join(", ")}</p></summary><p className="atlas-index-description">{project.description}</p></details>}</Reveal>)}</div>
          </div>
        </SectionAnchor>

        <SectionAnchor id="contact" className="atlas-section atlas-contact">
          <div className="atlas-container atlas-grid atlas-editorial">
            <div className="atlas-label-column"><SectionLabel {...content.sections[4]} /></div>
            <Reveal className="atlas-body-column"><h3>{content.contact.heading}</h3><dl className="atlas-contact-details">
              <div><dt className="atlas-mono">{content.contact.emailLabel}</dt><dd><a className="atlas-underline" href={`mailto:${content.contact.email}`}>{content.contact.email}<span className="atlas-arrow" aria-hidden="true"> ↗</span></a></dd></div>
              <div><dt className="atlas-mono">{content.contact.locationLabel}</dt><dd>{content.contact.location}</dd></div>
              <div><dt className="atlas-mono">{content.contact.responseLabel}</dt><dd>{content.contact.response}</dd></div>
            </dl><div className="atlas-socials">{content.contact.socials.map((social) => <a className="atlas-mono atlas-underline" key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label} <span className="atlas-arrow" aria-hidden="true">↗</span></a>)}</div></Reveal>
          </div>
        </SectionAnchor>
      </main>
      <footer className="atlas-footer"><div className="atlas-container"><p className="atlas-mono">{content.contact.footer}</p></div></footer>
    </div>
  );
}