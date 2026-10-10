
"use client";
 
import { useState } from "react";
 
const MAX_SIDE = 1024; // longest edge after downscaling, in pixels
const QUALITY = 0.8; // JPEG quality (0 to 1)
 
type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>; // the live camera <video> to grab a frame from
  active: boolean; // true while the camera feed is running
  onCapture: (dataUrl: string) => void; // receives a downscaled JPEG data URL
};
 
export default function ShutterButton({ videoRef, active, onCapture }: Props) {
  const [pressed, setPressed] = useState(false);
 
  function capture() {
    const video = videoRef.current;
    // Guard against a feed that has stopped or hasn't produced a frame yet
    if (!active || !video || video.videoWidth === 0) return;
 
    const scale = Math.min(1, MAX_SIDE / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL("image/jpeg", QUALITY));
  }
 
  return (
    <button
      type="button"
      aria-label="Capture photo"
      onClick={capture}
      disabled={!active}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: 72,
        height: 72,
        padding: 4,
        borderRadius: "50%",
        border: "4px solid #fff",
        background: "transparent",
        cursor: active ? "pointer" : "not-allowed",
        opacity: active ? 1 : 0.4,
      }}
    >
      <span
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "#fff",
          transform: pressed && active ? "scale(0.85)" : "scale(1)",
          transition: "transform 80ms",
        }}
      />
    </button>
  );
}