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
    closeCamera();
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <section
      style={{
        width: "100%",
        maxWidth: 480,
        overflow: "hidden",
        borderRadius: 16,
        background: "#111827",
        color: "white",
      }}
    >
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
          <p style={{ marginTop: 0 }}>
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
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
          }}
        >
          <button
            type="button"
            onClick={closeCamera}
            style={{
              border: "none",
              background: "transparent",
              color: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <ShutterButton
            videoRef={videoRef}
            active={cameraOpen}
            onCapture={handleCapture}
          />

          <span style={{ width: 48 }} />
        </div>
      )}
    </section>
  );
}