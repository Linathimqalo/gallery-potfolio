import { Button } from "@/components/ui/button";
import { content } from "@/content/content";
import { useEdition } from "./useEdition";

export function EditionSwitch() {
  const { edition, chooseEdition, ready } = useEdition();
  return (
    <div className="edition-switch" role="group" aria-label="Portfolio edition">
      {(["atlas", "obsidian"] as const).map((value) => (
        <Button key={value} variant="edition" disabled={!ready} aria-pressed={edition === value}
          title={content.editions[value].subtitle}
          onClick={() => chooseEdition(value)}>
          {content.editions[value].name}
        </Button>
      ))}
    </div>
  );
}