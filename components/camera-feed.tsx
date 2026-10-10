"use client";
 
import { useEffect, useRef, useState } from "react";
 
type Props = {
  // Called with a JPEG data URL each time the user takes a photo
  onCapture?: (dataUrl: string) => void;
};
 
export default function CameraFeed({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mounted = useRef(true);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
 
  async function start() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }, // back camera on phones
        audio: false,
      });
 
      // If the component unmounted while waiting for permission, release the camera
      if (!mounted.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
 
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setActive(true);
    } catch {
      setError("Couldn't access the camera. Allow camera permission and make sure the page is on HTTPS.");
    }
  }
 
  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  }
 
  function capture() {
    const video = videoRef.current;
    if (!video || !active) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    onCapture?.(canvas.toDataURL("image/jpeg", 0.85));
  }
 
  // Try to open the camera as soon as the component mounts
  useEffect(() => {
    mounted.current = true;
    start();
    return () => {
      mounted.current = false;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  return (
    <div>
      {/* playsInline + muted are required for inline playback on iOS Safari */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{ width: "100%", background: "#000", display: active ? "block" : "none" }}
      />
 
      {active ? (
        <div>
          <button onClick={capture}>Take photo</button>
          <button onClick={stop}>Close camera</button>
        </div>
      ) : (
        // Shown while waiting for permission, after closing, or if access was denied
        <button onClick={start}>Open camera</button>
      )}
 
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
 