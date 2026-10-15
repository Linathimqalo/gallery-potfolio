import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditionProvider, EDITION_STORAGE_KEY, resolveEdition, useEdition } from "./useEdition";

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

describe("edition selection", () => {
  it("prioritizes a valid URL override", () => {
    expect(resolveEdition("?edition=obsidian", "atlas")).toEqual({ edition: "obsidian", needsChooser: false });
  });
  it("uses stored preferences and ignores invalid overrides", () => {
    expect(resolveEdition("?edition=invalid", "obsidian")).toEqual({ edition: "obsidian", needsChooser: false });
  });
  it("defaults to Atlas and flags first visits for the future chooser", () => {
    expect(resolveEdition("", null)).toEqual({ edition: "atlas", needsChooser: true });
  });
  it("hydrates the stored edition and persists explicit changes", async () => {
    localStorage.setItem(EDITION_STORAGE_KEY, "obsidian");
    const { result } = renderHook(() => useEdition(), { wrapper: EditionProvider });
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.edition).toBe("obsidian");
    expect(result.current.needsChooser).toBe(false);
    act(() => result.current.chooseEdition("atlas"));
    expect(localStorage.getItem(EDITION_STORAGE_KEY)).toBe("atlas");
  });
  it("updates URL overrides when switching and restores the viewport", async () => {
    window.history.replaceState({}, "", "/?edition=obsidian#work");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 450 });
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => { cb(0); return 1; });
    const { result } = renderHook(() => useEdition(), { wrapper: EditionProvider });
    act(() => result.current.chooseEdition("atlas"));
    expect(window.location.search).toBe("?edition=atlas");
    expect(window.location.hash).toBe("#work");
    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 450, behavior: "instant" });
  });
  it("works when browser storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const { result } = renderHook(() => useEdition(), { wrapper: EditionProvider });
    await waitFor(() => expect(result.current.ready).toBe(true));
    act(() => result.current.chooseEdition("obsidian"));
    expect(result.current.edition).toBe("obsidian");
  });
});
