
const MAX_SIDE = 1024; // longest edge after downscaling, in pixels
const QUALITY = 0.8;
 
// Shrinks a photo in the browser and returns a JPEG data URL
export async function downscaleFile(file: File): Promise<string> {
  let source: CanvasImageSource;
  let w: number;
  let h: number;
  let cleanup = () => {};
 
  try {
    const bmp = await createImageBitmap(file);
    source = bmp;
    w = bmp.width;
    h = bmp.height;
    cleanup = () => bmp.close();
  } catch {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    source = img;
    w = img.naturalWidth;
    h = img.naturalHeight;
    cleanup = () => URL.revokeObjectURL(url);
  }
 
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext("2d")!.drawImage(source, 0, 0, canvas.width, canvas.height);
  cleanup();
  return canvas.toDataURL("image/jpeg", QUALITY);
}