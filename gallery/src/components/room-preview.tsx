import { useState } from "react";

type PreviewProps = {
  name: string;
  previewUrl: string;
  fallbackImage: string;
  fallbackReady: boolean;
};

export function RoomPreview({ name, previewUrl, fallbackImage, fallbackReady }: PreviewProps) {
  const [frameFailed, setFrameFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const showFrame = Boolean(previewUrl) && !frameFailed;
  const showImage = !showFrame && fallbackReady && !imageFailed;
  return (
    <div className="preview-frame" aria-hidden="true">
      <span className="reading-bracket bracket-top" />
      {showFrame ? (
        <iframe src={previewUrl} title={`${name} portfolio preview`} tabIndex={-1} loading="lazy" sandbox="allow-scripts allow-same-origin" onError={() => setFrameFailed(true)} />
      ) : showImage ? (
        <img src={fallbackImage} alt="" loading="lazy" onError={() => setImageFailed(true)} />
      ) : <span className="preview-name">{name}</span>}
      <span className="reading-bracket bracket-bottom" />
    </div>
  );
}