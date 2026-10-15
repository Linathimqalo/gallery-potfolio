import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { useGalleryShell } from "@/hooks/use-gallery-shell";
import { RoomPreview } from "@/components/room-preview";
import { isPlainNavigation, ROOM_NAVIGATION_DELAY_MS } from "@/lib/gallery-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Three Portfolios, One Story · Linathi Mqalo" },
      { name: "description", content: "Atlas, Obsidian, Substrate, and The Archive: three interpretations and the source material behind cloud security engineer Linathi Mqalo’s work." },
      { property: "og:title", content: "Three Portfolios, One Story · Linathi Mqalo" },
      { property: "og:description", content: "Four rooms. One story. A portfolio gallery by Linathi Mqalo, including The Archive’s source material." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gallery,
});

// Destinations belong to the portfolios, not this standalone chooser.
// Supply preview URLs and screenshot assets here when the portfolios are ready.
const rooms = [
  { id: "atlas", number: "01", name: "ATLAS", subtitle: "The Editorial Edition", description: "Set in Fraunces & Inter.\nPrinted on paper.", href: "https://the-atlas-portfolio.vercel.app", previewUrl: "https://the-atlas-portfolio.vercel.app", fallbackImage: "/images/atlas-preview.jpg", medium: "PAPER & INK", urlExternal: true },
  { id: "obsidian", number: "02", name: "OBSIDIAN", subtitle: "The Spatial Edition", description: "Set in Instrument Serif & Inter.\nRendered in real time.", href: "https://the-obsidian-portfolio.vercel.app", previewUrl: "https://the-obsidian-portfolio.vercel.app", fallbackImage: "/images/obsidian-preview.jpg", medium: "LIGHT & SPACE", urlExternal: true },
  { id: "substrate", number: "03", name: "SUBSTRATE", subtitle: "The Organic Edition", description: "Grown in real time.", href: "https://the-substrate-portfolio.vercel.app", previewUrl: "https://the-substrate-portfolio.vercel.app", fallbackImage: "/images/substrate-preview.jpg", medium: "FORM & LIFE", urlExternal: true },
  { id: "archive", number: "04", name: "THE ARCHIVE", subtitle: "The Source Material", description: "The work itself, in full. Case studies, technical write-ups, and the reasoning behind every decision.", href: "https://the-archive-portfolio.vercel.app", previewUrl: "https://the-archive-portfolio.vercel.app", fallbackImage: "/images/archive-preview.jpg", medium: "WORK & REASONING", urlExternal: true },
];

function Gallery() {
  const { activateRoom, deactivateRoom, roomList } = useGalleryShell();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const masthead = useRef<HTMLElement>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const header = masthead.current;
    if (!header) return;
    const updateScroll = () => {
      const availableScroll = document.documentElement.scrollHeight - window.innerHeight;
      const threshold = Math.min(header.offsetHeight, Math.max(20, availableScroll - 1));
      setShowBackToTop(window.scrollY >= threshold);
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener("scroll", updateScroll);
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
    };
  }, []);

  function navigateRoom(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!isPlainNavigation(event)) return;
    event.preventDefault();
    if (navigationTimer.current) return;
    const destination = event.currentTarget.href;
    setSelectedRoom(id);
    navigationTimer.current = setTimeout(() => window.location.assign(destination), ROOM_NAVIGATION_DELAY_MS);
  }

  function moveAtmosphere(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const room = event.currentTarget;
    const bounds = room.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    room.style.setProperty("--cursor-x", `${x}px`);
    room.style.setProperty("--cursor-y", `${y}px`);
    room.querySelectorAll<HTMLElement>(".particle-field i").forEach((particle) => {
      particle.style.setProperty("--pull-x", `${(x - particle.offsetLeft) * .12}px`);
      particle.style.setProperty("--pull-y", `${(y - particle.offsetTop) * .12}px`);
    });
  }

  function resetAtmosphere(event: PointerEvent<HTMLAnchorElement>) {
    event.currentTarget.querySelectorAll<HTMLElement>(".particle-field i").forEach((particle) => {
      particle.style.setProperty("--pull-x", "0px");
      particle.style.setProperty("--pull-y", "0px");
    });
  }

  function backToTop() {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <main className={`gallery${selectedRoom ? " gallery-selecting" : ""}`}>
      <div className="shell-atmospheres" aria-hidden="true">
        <div className="shell-atmosphere shell-paper" />
        <div className="shell-atmosphere shell-spatial" />
        <div className="shell-atmosphere shell-amber" />
        <div className="shell-atmosphere shell-teal" />
      </div>
      <header className="gallery-masthead" ref={masthead}>
        <p className="gallery-owner">LINATHI MQALO</p>
        <p className="gallery-title">FOUR PORTFOLIOS <span>·</span> ONE STORY</p>
        <h1>Pick the room that speaks to you.</h1>
        <p className="gallery-hint">HOVER TO PEEK <span>·</span> CLICK TO ENTER</p>
      </header>

      <section className="gallery-rooms" aria-label="Choose a portfolio" ref={roomList} onPointerLeave={deactivateRoom}>
        {rooms.map((room) => (
          <Button key={room.id} asChild variant="room" size="room">
            <a href={room.href} className={`room-${room.id}${selectedRoom === room.id ? " room-selected" : ""}`} aria-label={`${room.name} — ${room.subtitle}`} onClick={(event) => navigateRoom(event, room.id)} data-room={room.id} onPointerEnter={(event) => activateRoom(event, room.id)} onPointerMove={moveAtmosphere} onPointerLeave={resetAtmosphere}>
              <div className="room-atmosphere" aria-hidden="true">
                {room.id === "obsidian" && <><div className="aurora"><svg viewBox="0 0 400 800" preserveAspectRatio="none">{Array.from({ length: 18 }, (_, i) => <path key={i} d={`M ${-160 + i * 15} -40 C ${380 + i * 7} 150, ${-180 + i * 12} 320, ${210 + i * 14} 490 S ${70 + i * 10} 730, ${390 + i * 10} 850`} />)}</svg></div><div className="cursor-light" /></>}
                {room.id === "substrate" && <div className="particle-field">{Array.from({ length: 36 }, (_, i) => <i key={i} />)}</div>}
              </div>
              <div className="room-topline"><span>ROOM {room.number}</span><span className="room-top-mark" aria-hidden="true">[ {room.id[0]} ]</span></div>
              <div className="room-content">
                <div className="room-heading">
                  <h2 className="room-wordmark">{room.name}</h2>
                  <p className="room-subtitle">{room.subtitle}</p>
                  <p className="room-description">{room.description}</p>
                </div>
                <RoomPreview name={room.name} previewUrl={room.previewUrl} fallbackImage={room.fallbackImage} fallbackReady={false} />
                <div className="preview-caption"><span>{room.medium}</span><span aria-hidden="true">{room.number} / 04</span></div>
              </div>
              <div className="room-bottomline"><span>LINATHI MQALO <span className="room-bottom-dot">·</span> {room.number}</span><span className="room-entry" aria-hidden="true">ENTER →</span><ArrowUpRight className="room-arrow" aria-hidden="true" /></div>
            </a>
          </Button>
        ))}
      </section>

      <footer className="gallery-footer"><p>© 2026 <span>·</span> LINATHI MQALO <span>·</span> MMXXVI</p><p>SET IN FOUR VOICES</p><Button variant="link" className="gallery-return" onClick={backToTop}>← GALLERY</Button></footer>
      {showBackToTop && <Button variant="ghost" size="icon" className="gallery-up" onClick={backToTop} aria-label="Back to top" title="Back to top">↑</Button>}
    </main>
  );
}
