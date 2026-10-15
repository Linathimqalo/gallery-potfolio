import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PortfolioContent } from "@/content/content";
import { SectionAnchor } from "@/shared/SectionAnchor";
import { FractalSubstrate } from "./FractalSubstrate";
import { SpatialEffects, SpatialPanel } from "./ObsidianMotion";

type Project = PortfolioContent["projects"]["featured"][number] | PortfolioContent["projects"]["secondary"][number] | PortfolioContent["projects"]["index"][number];

function ProjectTile({ project, content, featured=false, index=0 }: { project:Project; content:PortfolioContent; featured?:boolean;index?:number }) {
  const reduced=useReducedMotion();
  function react(e:PointerEvent<HTMLDivElement>){if(reduced)return;const rect=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty("--pointer-x",`${e.clientX-rect.left}px`);e.currentTarget.style.setProperty("--pointer-y",`${e.clientY-rect.top}px`);}
  return <SpatialPanel className={featured?"obs-featured":"obs-project"} depth={.15+index*.05} index={index}>
    <article className="obs-glass obs-project-tile" onPointerMove={react}>
      <div className="obs-project-text text-zone"><div className="obs-project-meta obs-mono">{featured && <span className="obs-featured-badge">{content.projects.featuredLabel}</span>}<span>{"category" in project?project.category:""}{"year" in project?` · ${project.year}`:""}</span></div>
      <h3>{project.href?<a className="obs-underline" href={project.href} target="_blank" rel="noreferrer">{project.title}</a>:project.title}</h3><p>{project.description}</p><p className="obs-tags obs-mono">{project.tags.join(", ")}</p>
      {project.href && <a className="obs-view obs-mono obs-underline" href={project.href} target="_blank" rel="noreferrer" aria-label={`${content.projects.viewLabel} ${project.title}`}>{content.projects.viewLabel} <span aria-hidden="true">→</span></a>}</div>
    </article>
  </SpatialPanel>;
}

export function ObsidianApp({content}:{content:PortfolioContent}) {
  const [mode,setMode]=useState<"dark"|"light">("dark"),[active,setActive]=useState("hero"),[menu,setMenu]=useState(false);
  const root=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null);
  const reduced=useReducedMotion();
  const navItems=[{id:"hero",number:"00",label:content.person.name},...content.sections];
  useEffect(()=>{
    try{const saved=localStorage.getItem("linathi:obsidian-theme");if(saved==="light"||saved==="dark")setMode(saved);}catch{/* Optional storage. */}
    const previous=document.documentElement.style.scrollSnapType;document.documentElement.style.scrollSnapType="y proximity";
    let scheduled=0;
    const update=()=>{scheduled=0;let current="hero";for(const item of navItems){const el=root.current?.querySelector<HTMLElement>(`#${item.id}`);if(el && el.getBoundingClientRect().top<=window.innerHeight*.42)current=item.id;}setActive(current);};
    const scroll=()=>{if(!scheduled)scheduled=requestAnimationFrame(update);};update();window.addEventListener("scroll",scroll,{passive:true});
    return()=>{window.removeEventListener("scroll",scroll);cancelAnimationFrame(scheduled);document.documentElement.style.scrollSnapType=previous;};
  },[content]);
  useEffect(()=>{const el=dialog.current;if(!el)return undefined;if(menu){el.showModal();return()=>el.close();}el.close();return undefined;},[menu]);
  function toggle(){const next=mode==="dark"?"light":"dark";setMode(next);try{localStorage.setItem("linathi:obsidian-theme",next);}catch{/* Optional storage. */}}
  function navigate(id:string){setMenu(false);setActive(id);requestAnimationFrame(()=>{const el=root.current?.querySelector<HTMLElement>(`#${id}`);el?.scrollIntoView({behavior:reduced?"instant":"smooth",block:"start"});history.replaceState(history.state,"",`${location.pathname}${location.search}#${id}`);});}
  const label=(index:number)=>{const section=content.sections[index];return section?<h2 className="obs-section-label obs-mono text-zone"><span>{section.number}</span> — {section.label}</h2>:null;};
  return <div ref={root} className="obsidian" data-mode={mode} data-contact={active==="contact"}>
    <FractalSubstrate mode={mode}/><SpatialEffects/>
    <a href="#hero" className="obs-skip">{content.controls.skip}</a>
    <header className="obs-topbar"><a className="obs-wordmark obs-mono text-zone" href="#hero">{content.person.name}</a><div className="obs-tools text-zone"><Button variant="obsidianIcon" size="icon" aria-label={mode==="dark"?content.controls.light:content.controls.dark} title={mode==="dark"?content.controls.light:content.controls.dark} onClick={toggle}><AnimatePresence initial={false} mode="wait"><motion.span key={mode} initial={{opacity:0,rotate:reduced?0:-3}} animate={{opacity:1,rotate:0}} exit={{opacity:0,rotate:reduced?0:3}} transition={{duration:reduced?0:.2}}>{mode==="dark"?<Sun/>:<Moon/>}</motion.span></AnimatePresence></Button></div></header>
    <nav className="obs-orbit" aria-label="Section navigation">{navItems.map(item=><a key={item.id} className={`obs-orbit-link ${active===item.id?"is-active":""}`} href={`#${item.id}`} aria-label={item.label} aria-current={active===item.id?"location":undefined} onClick={e=>{e.preventDefault();navigate(item.id);}}><span className="obs-orbit-label obs-mono">{item.label}</span><span className="obs-orbit-dot"/></a>)}</nav>
    <Button variant="obsidianIcon" size="icon" className="obs-mobile-orbit" aria-label={content.controls.openMenu} aria-expanded={menu} aria-controls="obsidian-menu" onClick={()=>setMenu(true)}><span className="obs-orbit-dot"/></Button>
    <dialog ref={dialog} id="obsidian-menu" className="obs-mobile-menu" aria-label="Section navigation" onCancel={()=>setMenu(false)}><div className="obs-menu-head"><span className="obs-mono">{content.editions.obsidian.name}</span><Button variant="obsidianIcon" size="icon" aria-label={content.controls.closeMenu} onClick={()=>setMenu(false)}><X/></Button></div><nav>{navItems.map(item=><a key={item.id} href={`#${item.id}`} className="obs-mono obs-underline" onClick={e=>{e.preventDefault();navigate(item.id);}}>{item.number} — {item.label}</a>)}</nav></dialog>
    <main className="obs-main">
      <SectionAnchor id="hero" className="obs-hero"><div className="obs-container"><div className="obs-hero-copy text-zone"><p className="obs-mono obs-eyebrow">{content.hero.label}</p><h1>{content.person.name}</h1><p className="obs-mono obs-disciplines">{content.hero.disciplines}</p><p className="obs-tagline">{content.hero.tagline}</p><div className="obs-cta-row"><Button variant="obsidian" asChild><a href="#projects" onClick={e=>{e.preventDefault();navigate("projects");}}>View Work <ArrowUpRight/></a></Button><Button variant="obsidianGhost" asChild><a href="#contact" onClick={e=>{e.preventDefault();navigate("contact");}}>Get in Touch <ArrowUpRight/></a></Button></div></div><a href="#about" className="obs-scroll obs-mono text-zone" onClick={e=>{e.preventDefault();navigate("about");}}>[ scroll ] <ArrowDown size={14}/></a></div></SectionAnchor>
      <SectionAnchor id="about" className="obs-section obs-container">{label(0)}<div className="obs-metrics">{content.hero.metrics.map((metric,i)=><SpatialPanel key={metric.label} depth={.1+i*.1} index={i}><div className="obs-glass obs-metric"><div className="text-zone"><span className="obs-metric-value">{metric.value}</span><p className="obs-mono">{metric.label}</p></div></div></SpatialPanel>)}</div><SpatialPanel className="obs-bio-panel" depth={.25}><div className="obs-glass obs-bio text-zone"><p>{content.about.bio}</p></div></SpatialPanel><div className="obs-domains text-zone">{content.about.domains.map(domain=><div key={domain.label}><h3 className="obs-mono">{domain.label}</h3><p>{domain.description}</p></div>)}</div></SectionAnchor>
      <SectionAnchor id="skills" className="obs-section obs-container">{label(1)}<div className="obs-skills-grid">{content.skills.map((skill,i)=><SpatialPanel key={skill.group} depth={.1+(i%5)*.1} index={i}><div className="obs-glass obs-skill-panel"><div className="text-zone"><h3>{skill.group}</h3><div className="obs-constellation">{skill.technologies.map((tech,j)=><motion.span key={tech} className="obs-skill obs-mono" data-weight={j<2?3:j<5?2:1} initial={reduced?false:{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:reduced?0:.3,delay:reduced?0:j*.04}}>{tech}</motion.span>)}</div></div></div></SpatialPanel>)}</div></SectionAnchor>
      <SectionAnchor id="experience" className="obs-section obs-container">{label(2)}<div className="obs-experience-stack">{content.experience.map((role,i)=><SpatialPanel key={role.company} depth={.2} recede><article className="obs-glass obs-role"><div className="text-zone"><p className="obs-mono obs-dates">{role.dates}</p><h3>{role.role}</h3><p className="obs-mono obs-company">{role.company} · {role.location}</p><ul>{role.wins.map(win=><li key={win}><span aria-hidden="true">·</span>{win}</li>)}</ul></div><span className="obs-role-index obs-mono" aria-hidden="true">0{i+1}</span></article></SpatialPanel>)}</div></SectionAnchor>
      <SectionAnchor id="projects" className="obs-section obs-container">{label(3)}<h2 className="obs-work-heading text-zone">{content.projects.heading}</h2><div className="obs-bento">{content.projects.featured.map((project,i)=><ProjectTile key={project.title} project={project} content={content} featured index={i}/>)}{content.projects.secondary.slice(0,2).map((project,i)=><ProjectTile key={project.title} project={project} content={content} index={i+2}/>)}</div><div className="obs-rail-wrap"><div className="obs-project-rail" tabIndex={0} aria-label={content.projects.heading}>{[...content.projects.secondary.slice(2),...content.projects.index].map((project,i)=><ProjectTile key={project.title} project={project} content={content} index={i}/>)}</div></div></SectionAnchor>
      <SectionAnchor id="contact" className="obs-section obs-contact obs-container">{label(4)}<div className="obs-contact-copy text-zone"><h2>{content.contact.heading}</h2><dl>{[[content.contact.emailLabel,content.contact.email],[content.contact.locationLabel,content.contact.location],[content.contact.responseLabel,content.contact.response]].map(([key,value],i)=><div key={key}><dt className="obs-mono">{key}</dt><dd>{i===0?<a className="obs-underline" href={`mailto:${value}`}>{value}</a>:value}</dd></div>)}</dl><Button variant="obsidian" className="obs-contact-cta" asChild><a href={`mailto:${content.contact.email}`}>Get in Touch <ArrowUpRight/></a></Button><div className="obs-socials">{content.contact.socials.map(social=><a key={social.label} className="obs-mono obs-underline" href={social.href} target="_blank" rel="noreferrer">{social.label} ↗</a>)}</div></div></SectionAnchor>
    </main><footer className="obs-footer obs-container"><p className="obs-mono text-zone">{content.contact.footer}</p></footer>
  </div>;
}
