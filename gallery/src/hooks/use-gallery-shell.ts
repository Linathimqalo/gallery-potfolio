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
    // Keep the spatial light's origin at the room rather than at the pointer.
    if (id === "obsidian") {
      const bounds = event.currentTarget.getBoundingClientRect();
      root.style.setProperty("--shell-source-x", `${(bounds.left + bounds.width / 2) / window.innerWidth * 100}%`);
    }
    root.dataset['shellRoom'] = id;
  }

  function deactivateRoom() {
    const root = document.documentElement;
    // Clear only when leaving the room group, never while crossing a divider.
    if (root.dataset['shellMode'] === "hover") delete root.dataset['shellRoom'];
  }

  return { roomList, activateRoom, deactivateRoom };
}