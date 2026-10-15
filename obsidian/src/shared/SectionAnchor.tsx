import type { ComponentPropsWithoutRef } from "react";

type SectionAnchorProps = ComponentPropsWithoutRef<"section"> & { id: string };

export function SectionAnchor({ id, className = "", ...props }: SectionAnchorProps) {
  return <section id={id} className={`section-anchor ${className}`} {...props} />;
}