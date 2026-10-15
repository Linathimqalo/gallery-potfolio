import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { content } from "@/content/content";
import { EditionProvider } from "@/shared/useEdition";
import { ObsidianApp } from "./ObsidianApp";
vi.mock("./FractalSubstrate",()=>({FractalSubstrate:()=> <canvas aria-hidden="true"/>}));
vi.mock("./ObsidianMotion",()=>({SpatialEffects:()=>null,SpatialPanel:({children,className}:{children:React.ReactNode;className?:string})=><div className={className}>{children}</div>}));
describe("Obsidian shared content",()=>{
 it("preserves every section, skill, role, project and domain with dark default",()=>{
   vi.stubGlobal("IntersectionObserver",class{observe(){}unobserve(){}disconnect(){}});
   HTMLDialogElement.prototype.close=vi.fn();HTMLDialogElement.prototype.showModal=vi.fn();
   const {container}=render(<EditionProvider><ObsidianApp content={content}/></EditionProvider>);
   expect(container.querySelector(".obsidian")).toHaveAttribute("data-mode","dark");
   expect(screen.getByRole("heading",{level:1})).toHaveTextContent(content.person.name);
   expect(Array.from(container.querySelectorAll("main section")).map(s=>s.id)).toEqual(["hero",...content.sections.map(s=>s.id)]);
   expect(screen.getByText(content.about.bio)).toBeInTheDocument();
   for(const domain of content.about.domains)expect(screen.getByText(domain.description)).toBeInTheDocument();
   expect(container.querySelectorAll(".obs-skill-panel")).toHaveLength(9);
   expect(container.querySelectorAll(".obs-role")).toHaveLength(5);
   expect(container.querySelectorAll(".obs-project-tile")).toHaveLength(9);
   for(const p of [...content.projects.featured,...content.projects.secondary,...content.projects.index])expect(screen.getByRole("heading",{name:p.title})).toBeInTheDocument();
   expect(screen.getByRole("link",{name:content.contact.email})).toHaveAttribute("href",`mailto:${content.contact.email}`);
   expect(screen.getByRole("link",{name:"View Work"})).toHaveAttribute("href","#projects");
   vi.unstubAllGlobals();
 });
});
