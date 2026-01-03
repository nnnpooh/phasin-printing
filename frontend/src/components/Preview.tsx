import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import {
  curPatternAtom,
  drawingDataAtom,
  isModalOpenAtom,
} from "../utils/atoms";
import PayPrintModal from "./PayPrintModal";
function Preview() {
  const [curPattern] = useAtom(curPatternAtom);
  const [canvasData] = useAtom(drawingDataAtom);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const [_, setIsModalOpen] = useAtom(isModalOpenAtom);

  const getPatternImage = async (): Promise<HTMLImageElement | null> => {
    if (!curPattern) return null;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = curPattern.imageUrl || curPattern.thumbnailUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load pattern image"));
    });

    return img;
  };

  const getDrawingImage = async (): Promise<HTMLImageElement | null> => {
    if (!canvasData) return null;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = canvasData;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load drawing image"));
    });
    return img;
  };

  const drawCombinedImage = async () => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawRoundedRect = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius = 12
    ) => {
      context.beginPath();
      context.moveTo(x + radius, y);
      context.lineTo(x + width - radius, y);
      context.quadraticCurveTo(x + width, y, x + width, y + radius);
      context.lineTo(x + width, y + height - radius);
      context.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      context.lineTo(x + radius, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - radius);
      context.lineTo(x, y + radius);
      context.quadraticCurveTo(x, y, x + radius, y);
      context.closePath();
    };

    // Left: pattern image
    try {
      const pattern = await getPatternImage();
      if (pattern) {
        ctx.drawImage(
          pattern,
          0,
          0,
          pattern.width,
          pattern.height,
          0,
          0,
          canvas.width / 2,
          canvas.height
        );
      }
    } catch (e) {
      // ignore pattern error for now
    }

    // Right: user drawing copied from draw canvas
    try {
      const pattern = await getPatternImage();
      if (pattern) {
        ctx.drawImage(
          pattern,
          0,
          0,
          pattern.width,
          pattern.height,
          canvas.width / 2,
          0,
          canvas.width / 2,
          canvas.height
        );
      }

      // Overlay user drawing and rotate 90 degrees with white background and rounded corerners box.
      const drawing = await getDrawingImage();
      if (drawing) {
        const inset = 64;
        const boxX = canvas.width / 2 + inset;
        const boxY = inset;
        const boxW = canvas.width / 2 - inset * 2;
        const boxH = canvas.height - inset * 2;

        // White backing to boost contrast for the drawing overlay.
        ctx.save();
        drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 14);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fill();
        ctx.restore();

        ctx.drawImage(
          drawing,
          0,
          0,
          drawing.width,
          drawing.height,
          boxX,
          boxY,
          boxW,
          boxH
        );
      }
    } catch (e) {
      // ignore drawing error for now
    }
  };

  useEffect(() => {
    drawCombinedImage();
  }, [curPattern, canvasData]);

  return (
    <div className="mx-auto max-w-4xl">
      <canvas
        ref={previewRef}
        className="mb-6 w-full rounded-2xl shadow-2xl"
        style={{
          height: 250,
          display: "block",
          backgroundColor: "#ffffffff",
        }}
      />
      <button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 text-white rounded-full shadow-lg hover:scale-105 active:scale-100 transition-transform font-bold"
        onClick={() => setIsModalOpen(true)}
      >
        Pay & Print
      </button>
      <PayPrintModal previewRef={previewRef} />
    </div>
  );
}

export default Preview;
