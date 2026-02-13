import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ImageCropper = ({
  file,
  onCancel,
  onComplete,
  outputSize = 512,
  title = "Profile Picture Adjust",
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, x: 0, y: 0 });

  const [imageUrl, setImageUrl] = useState("");
  const [zoom, setZoom] = useState(1.2);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setReady(false);
    setZoom(1.2);
    setOffset({ x: 0, y: 0 });
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const naturalSize = useMemo(() => {
    const img = imageRef.current;
    if (!img) return { width: 0, height: 0 };
    return { width: img.naturalWidth, height: img.naturalHeight };
  }, [ready]);

  const getCropMetrics = (nextZoom = zoom, nextOffset = offset) => {
    const container = containerRef.current;
    if (!container) return null;
    const cropSize = container.clientWidth;
    const { width: imgW, height: imgH } = naturalSize;
    if (!imgW || !imgH) return null;

    const baseScale = Math.max(cropSize / imgW, cropSize / imgH);
    const totalScale = baseScale * nextZoom;
    const displayW = imgW * totalScale;
    const displayH = imgH * totalScale;

    const maxX = Math.max(0, (displayW - cropSize) / 2);
    const maxY = Math.max(0, (displayH - cropSize) / 2);

    return {
      cropSize,
      totalScale,
      displayW,
      displayH,
      offset: {
        x: clamp(nextOffset.x, -maxX, maxX),
        y: clamp(nextOffset.y, -maxY, maxY),
      },
    };
  };

  const handlePointerDown = (e) => {
    if (!ready) return;
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, x: offset.x, y: offset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return;
    const nextOffset = {
      x: dragRef.current.x + (e.clientX - dragRef.current.startX),
      y: dragRef.current.y + (e.clientY - dragRef.current.startY),
    };
    const metrics = getCropMetrics(zoom, nextOffset);
    if (metrics) setOffset(metrics.offset);
  };

  const handleSave = async () => {
    const metrics = getCropMetrics(zoom, offset);
    const img = imageRef.current;
    if (!metrics || !img) return;

    const { cropSize, totalScale, offset: finalOffset, displayW, displayH } = metrics;
    const imgLeft = (cropSize - displayW) / 2 + finalOffset.x;
    const imgTop = (cropSize - displayH) / 2 + finalOffset.y;

    const sx = (0 - imgLeft) / totalScale;
    const sy = (0 - imgTop) / totalScale;
    const sSize = cropSize / totalScale;

    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");

    // Circular Clipping for the output file
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize);

    canvas.toBlob((blob) => {
      if (blob) onComplete(new File([blob], "profile.png", { type: "image/png" }));
    }, "image/png");
  };

  if (!file) return null;

  const currentMetrics = getCropMetrics();
  const scale = currentMetrics?.totalScale || 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Cropping Area */}
        <div className="p-6">
          <div
            ref={containerRef}
            className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-200 cursor-move"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => { dragRef.current.active = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
            style={{ touchAction: "none" }}
          >
            {imageUrl && (
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop preview"
                onLoad={() => setReady(true)}
                className="absolute left-1/2 top-1/2 max-w-none"
                style={{
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
                  transition: dragRef.current.active ? "none" : "transform 0.1s ease-out",
                  pointerEvents: "none",
                }}
              />
            )}
            
            {/* Circular Overlay Mask */}
            <div className="absolute inset-0 pointer-events-none ring-[100px] ring-black/50 rounded-full shadow-[0_0_0_2000px_rgba(0,0,0,0.5)]" />
            
            {/* White Circle Border */}
            <div className="absolute inset-0 pointer-events-none border-2 border-white/80 rounded-full" />
          </div>

          {/* Controls */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4">
              <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" /></svg>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" /></svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave}>
            Save Photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;