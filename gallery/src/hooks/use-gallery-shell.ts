import { useEffect, useRef, type PointerEvent } from "react";

type DeviceHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

// Shell state lives on the root; room tokens and room interaction state stay independent.
export function useGalleryShell() {
  const roomList = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const mobile = window.matchMedia("(max-width: 767px), (hover: none)");
    let observer: IntersectionObserver | undefined;
    const clear = () => { delete root.dataset['shellRoom']; };
    const configure = () => {
      observer?.disconnect();
      clear();
      root.dataset['shellMode'] = mobile.matches ? "scroll" : "hover";
      if (!mobile.matches || !roomList.current) return;
      const hints = navigator as DeviceHints;
      // Conservatively omit mobile lighting on resource-constrained devices.
      if ((hints.deviceMemory !== undefined && hints.deviceMemory <= 2) ||
          (hints.hardwareConcurrency > 0 && hints.hardwareConcurrency <= 2) ||
          hints.connection?.saveData || !("IntersectionObserver" in window)) return;
      const visibility = new Map<Element, number>();
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry.intersectionRatio));
        let active: HTMLElement | undefined;
        let highest = 0;
        visibility.forEach((ratio, element) => {
          if (ratio >= .5 && ratio > highest && element instanceof HTMLElement) {
            highest = ratio;
            active = element;
          }
        });
        if (active?.dataset['room']) root.dataset['shellRoom'] = active.dataset['room'];
        else clear();
      }, { threshold: [0, .5, 1] });
      roomList.current.querySelectorAll<HTMLElement>("[data-room]").forEach((room) => observer?.observe(room));
    };
    configure();
    mobile.addEventListener("change", configure);
    return () => {
      observer?.disconnect();
      mobile.removeEventListener("change", configure);
      clear();
      delete root.dataset['shellMode'];
    };
  }, []);

  function activateRoom(event: PointerEvent<HTMLAnchorElement>, id: string) {
    if (event.pointerType !== "mouse" || document.documentElement.dataset['shellMode'] !== "hover") return;
    const root = document.documentElement;
    const bounds = event.currentTarget.getBoundingClientRect();
    // Keep the spatial light's origin at the room rather than at the pointer.
    root.style.setProperty("--shell-source-x", `${(bounds.left + bounds.width / 2) / window.innerWidth * 100}%`);
    
    // Set shell palette based on room
    const palettes: Record<string, { bg: string; text: string; meta: string; hairline: string; accent: string }> = {
      atlas: { bg: "#3D2B1F", text: "#F5E6D3", meta: "#C4B5A0", hairline: "rgba(244,181,160,0.10)", accent: "#8B4513" },
      obsidian: { bg: "#0A1220", text: "#F4F1EA", meta: "#7A8CA6", hairline: "rgba(122,140,166,0.15)", accent: "#A38560" },
      substrate: { bg: "#0A2F2F", text: "#F5E6D3", meta: "#8FB8C8", hairline: "rgba(143,184,200,0.15)", accent: "#4ECDC4" },
      archive: { bg: "#1A0A0A", text: "#F4F1EA", meta: "#8A8A8F", hairline: "rgba(138,138,143,0.08)", accent: "#800020" },
    };
    
    const palette = palettes[id];
    if (palette) {
      root.style.setProperty("--shell-bg", palette.bg);
      root.style.setProperty("--shell-text", palette.text);
      root.style.setProperty("--shell-meta", palette.meta);
      root.style.setProperty("--shell-hairline", palette.hairline);
      root.style.setProperty("--shell-accent", palette.accent);
    }
    
    root.dataset['shellRoom'] = id;
  }

  function deactivateRoom() {
    const root = document.documentElement;
    // Clear only when leaving the room group, never while crossing a divider.
    if (root.dataset['shellMode'] === "hover") {
      delete root.dataset['shellRoom'];
      // Reset to default neutral dark
      root.style.removeProperty("--shell-bg");
      root.style.removeProperty("--shell-text");
      root.style.removeProperty("--shell-meta");
      root.style.removeProperty("--shell-hairline");
      root.style.removeProperty("--shell-accent");
    }
  }

  return { roomList, activateRoom, deactivateRoom };
}