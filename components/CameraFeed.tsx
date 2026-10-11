"use client";

import { useEffect, useRef, useState } from "react";
import ShutterButton from "./PhotoButton";

type Props = {
  onCapture: (dataUrl: string) => void;
};

export default function CameraFeed({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState("");

  async function openCamera() {
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraOpen(true);
    } catch {
      setError(
        "Could not access the camera. Allow camera permission, then try again."
      );
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  }

  function handleCapture(image: string) {
    onCapture(image);
    //closeCamera();
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
<section
  style={{
    position: "relative",
    width: "100%",
    maxWidth: 480,
    overflow: "hidden",
    borderRadius: 16,
    background: "#111827",
    color: "white",
  }}
>
  {cameraOpen && (
    <button
    type="button"
    onClick={closeCamera}
    aria-label="Close camera"
    style={{
      position: "absolute",
      top: 12,
      right: 12,
      zIndex: 999,

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      width: 36,
      height: 36,
      padding: 0,
      border: "1px solid rgba(255,255,255,0.5)",
      borderRadius: "50%",

      background: "rgba(0,0,0,0.6)",
      color: "white",
      fontSize: 22,
      fontWeight: 400,
      lineHeight: 1,
      cursor: "pointer",
    }}
  >
    ×
  </button>
  )}

  <video
    ref={videoRef}
    playsInline
    muted
    style={{
      display: cameraOpen ? "block" : "none",
      width: "100%",
    }}
  />

  {!cameraOpen && (
    <div style={{ padding: 24, textAlign: "center" }}>
      <p style={{ marginTop: 0, marginBottom: 15 }}>
        Take a photo of the ingredients in your fridge or pantry.
      </p>

      <button
        type="button"
        onClick={openCamera}
        style={{
          border: "none",
          borderRadius: 999,
          padding: "12px 18px",
          background: "#22c55e",
          color: "#052e16",
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Take a Photo
      </button>

      {error && (
        <p role="alert" style={{ marginBottom: 0, color: "#fecaca" }}>
          {error}
        </p>
      )}
    </div>
  )}

  {cameraOpen && (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 40px",
      }}
    >
      <ShutterButton
        videoRef={videoRef}
        active={cameraOpen}
        onCapture={handleCapture}
      />
    </div>
  )}
</section>
  );
}