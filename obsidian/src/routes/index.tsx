import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { content } from "@/content/content";
import { ObsidianApp } from "@/editions/obsidian/ObsidianApp";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Linathi Mqalo — Cloud Security Engineer" },
      { name: "description", content: "Linathi Mqalo, Cloud Security Engineer based in Johannesburg." },
      { property: "og:title", content: "Linathi Mqalo — Cloud Security Engineer" },
      { property: "og:description", content: "Cloud security engineering, Johannesburg." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return <MotionConfig reducedMotion="user"><ObsidianApp content={content} /></MotionConfig>;
}
