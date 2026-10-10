"use client";
 
import { useEffect, useRef, useState } from "react";
import ShutterButton from "./PhotoButton";
 
type Props = {
  // Called with a downscaled JPEG data URL each time the shutter is pressed
  onCapture: (dataUrl: string) => void;
};
 
export default function CameraFeed({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const attempt = useRef(0); // lets us ignore camera requests that finish after unmount or a retry
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
 
  async function startCamera() {
    const mine = ++attempt.current;
    setError("");
 
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("This browser can't open the camera here. Camera access needs HTTPS (or localhost).");
      return;
    }
 
    try {
      // Back camera on phones; falls back to the webcam on laptops and desktops
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
 
      // Unmounted (or a newer attempt started) while the permission prompt was open
      if (mine !== attempt.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
 
      // If the camera gets unplugged or taken by another app, mark the feed inactive
      stream.getVideoTracks()[0]?.addEventListener("ended", () => setActive(false));
 
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setActive(true);
    } catch {
      if (mine === attempt.current) {
        setError("Couldn't access the camera. Allow camera permission in your browser, then try again.");
      }
    }
  }
 
  // Open the camera on mount, release it on unmount
  useEffect(() => {
    startCamera();
    return () => {
      attempt.current++;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  return (
    <div
      style={{
        maxWidth: 480,
        background: "#000",
        color: "#fff",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* playsInline + muted are required for inline playback on iOS Safari */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{ width: "100%", display: active ? "block" : "none" }}
      />
 
      {!active && (
        <p role={error ? "alert" : undefined} style={{ padding: 16, margin: 0 }}>
          {error || "Starting camera…"}
        </p>
      )}
 
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "16px 20px",
        }}
      >
        {error ? (
          <button
            type="button"
            onClick={startCamera}
            style={{
              justifySelf: "start",
              background: "transparent",
              border: "none",
              color: "#fff",
              font: "inherit",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Try again
          </button>
        ) : (
          <span />
        )}
 
        <ShutterButton videoRef={videoRef} active={active} onCapture={onCapture} />
 
        <span />
      </div>
    </div>
  );
}
 