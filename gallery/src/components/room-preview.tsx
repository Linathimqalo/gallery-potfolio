import { useEffect, useRef, useState } from "react";

type PreviewProps = {
  name: string;
  previewUrl: string;
  fallbackImage: string;
  fallbackReady: boolean;
};

export function RoomPreview({ name, previewUrl, fallbackImage, fallbackReady }: PreviewProps) {
  const [frameFailed, setFrameFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string>("about:blank");
  const containerRef = useRef<HTMLDivElement>(null);
  const showFrame = Boolean(previewUrl) && !frameFailed;
  const showImage = !showFrame && fallbackReady && !imageFailed;

  useEffect(() => {
    if (!showFrame || !containerRef.current) return;

    const container = containerRef.current;
    let observer: IntersectionObserver | undefined;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIframeSrc(previewUrl);
        } else {
          setIframeSrc("about:blank");
        }
      });
    };

    observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
      rootMargin: "50px",
    });

    observer.observe(container);

    return () => {
      observer?.disconnect();
      setIframeSrc("about:blank");
    };
  }, [previewUrl, showFrame]);

  return (
    <div className="preview-frame" aria-hidden="true" ref={containerRef}>
      <span className="reading-bracket bracket-top" />
      {showFrame ? (
        <iframe
          src={iframeSrc}
          title={`${name} portfolio preview`}
          tabIndex={-1}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          style={{ pointerEvents: 'none' }}
          onError={() => setFrameFailed(true)}
        />
      ) : showImage ? (
        <img src={fallbackImage} alt="" loading="lazy" onError={() => setImageFailed(true)} />
      ) : <span className="preview-name">{name}</span>}
      <span className="reading-bracket bracket-bottom" />
    </div>
  );
}