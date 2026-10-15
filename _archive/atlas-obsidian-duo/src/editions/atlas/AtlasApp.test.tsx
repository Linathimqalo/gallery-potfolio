import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { content } from "@/content/content";
import { EditionProvider } from "@/shared/useEdition";
import { AtlasApp } from "./AtlasApp";

vi.mock("./AtlasMotion", () => ({
  Reveal: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
  SectionLabel: ({ number, label }: { number: string; label: string }) => <h2>{number} — {label}</h2>,
}));

describe("Atlas portfolio content", () => {
  it("renders all shared sections, skills, experience and projects without changing copy", () => {
    vi.stubGlobal("IntersectionObserver", class {
      observe() {} disconnect() {}
    });
    HTMLDialogElement.prototype.close = vi.fn();
    HTMLDialogElement.prototype.showModal = vi.fn();
    render(<EditionProvider><AtlasApp content={content} /></EditionProvider>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(content.person.name);
    expect(screen.getByText(content.about.bio)).toBeInTheDocument();
    expect(document.querySelectorAll("main section")).toHaveLength(6);
    expect(document.querySelectorAll(".atlas-skill-row")).toHaveLength(9);
    expect(document.querySelectorAll(".atlas-experience-entry")).toHaveLength(5);
    expect(document.querySelectorAll(".atlas-featured")).toHaveLength(2);
    expect(document.querySelectorAll(".atlas-secondary-project")).toHaveLength(4);
    expect(screen.getByRole("link", { name: new RegExp(content.contact.email) })).toHaveAttribute("href", `mailto:${content.contact.email}`);
    expect(screen.getAllByRole("button", { name: "Obsidian" })[0]).toBeEnabled();
    vi.unstubAllGlobals();
  });
});