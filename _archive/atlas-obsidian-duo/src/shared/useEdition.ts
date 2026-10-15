import { createContext, createElement, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Edition } from "@/content/content";
import { flushSync } from "react-dom";

export const EDITION_STORAGE_KEY = "linathi:edition";
export const EDITION_FADE_MS = 600;
export const CHOOSER_TIMEOUT_MS = 6000;

export function isEdition(value: unknown): value is Edition {
  return value === "atlas" || value === "obsidian";
}

export function resolveEdition(search: string, stored: string | null) {
  const param = new URLSearchParams(search).get("edition");
  if (isEdition(param)) return { edition: param, needsChooser: false };
  if (isEdition(stored)) return { edition: stored, needsChooser: false };
  return { edition: "atlas" as Edition, needsChooser: true };
}

function useEditionState() {
  const [edition, setEdition] = useState<Edition>("atlas");
  const [ready, setReady] = useState(false);
  const [needsChooser, setNeedsChooser] = useState(false);
  const [autoSelected, setAutoSelected] = useState(false);
  const restoreFrame = useRef<number | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(EDITION_STORAGE_KEY); } catch { /* Storage can be blocked. */ }
    const resolved = resolveEdition(window.location.search, stored);
    setEdition(resolved.edition);
    setNeedsChooser(resolved.needsChooser);
    setReady(true);
    return () => {
      if (restoreFrame.current !== null) window.cancelAnimationFrame(restoreFrame.current);
    };
  }, []);

  function chooseEdition(next: Edition, automatic = false) {
    if (next === edition) return;
    const position = { left: window.scrollX, top: window.scrollY };
    try { window.localStorage.setItem(EDITION_STORAGE_KEY, next); } catch { /* Keep selection usable without storage. */ }
    // Replace the override too, so refreshes respect an explicit switch.
    const url = new URL(window.location.href);
    if (url.searchParams.has("edition")) {
      url.searchParams.set("edition", next);
      window.history.replaceState(window.history.state, "", url);
    }
    const commit = () => {
      flushSync(() => { setEdition(next); setNeedsChooser(false); setAutoSelected(automatic); });
      if (restoreFrame.current !== null) window.cancelAnimationFrame(restoreFrame.current);
      restoreFrame.current = window.requestAnimationFrame(() => {
      window.scrollTo({ ...position, behavior: "instant" });
      restoreFrame.current = null;
      });
    };
    const transitionDocument = document as Document & { startViewTransition?: (update: () => void) => { finished: Promise<void> } };
    if (transitionDocument.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      transitionDocument.startViewTransition(commit).finished.catch(() => {});
    } else commit();
  }

  return { edition, ready, needsChooser, autoSelected, chooseEdition };
}

const EditionContext = createContext<ReturnType<typeof useEditionState> | null>(null);

export function EditionProvider({ children }: { children: ReactNode }) {
  const state = useEditionState();
  return createElement(EditionContext.Provider, { value: state }, children);
}

export function useEdition() {
  const context = useContext(EditionContext);
  if (!context) throw new Error("useEdition must be used inside EditionProvider");
  return context;
}