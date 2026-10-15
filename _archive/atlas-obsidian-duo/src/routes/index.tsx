import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { content } from "@/content/content";
import { AtlasApp } from "@/editions/atlas/AtlasApp";
import { ObsidianApp } from "@/editions/obsidian/ObsidianApp";
import { EditionProvider, useEdition } from "@/shared/useEdition";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Linathi Mqalo — Cloud Security Engineer" },
      { name: "description", content: "Linathi Mqalo, Cloud Security Engineer based in Johannesburg. An editorial and spatial portfolio." },
      { property: "og:title", content: "Linathi Mqalo — Cloud Security Engineer" },
      { property: "og:description", content: "A dual-edition portfolio for Linathi Mqalo, based in Johannesburg." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return <MotionConfig reducedMotion="user"><EditionProvider><PortfolioFoundation /></EditionProvider></MotionConfig>;
}

function PortfolioFoundation() {
  const { edition } = useEdition();
  return <div key={edition} className="edition-fade">{edition === "atlas" ? <AtlasApp content={content} /> : <ObsidianApp content={content} />}</div>;
}
