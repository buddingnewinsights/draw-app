"use client";

import { useDraw } from "@/hooks/useDraw";
import { useState } from "react";
import { ChromePicker } from "react-color";

export default function Home() {
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="flex flex-col gap-3 p-4">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          className="p-2 border border-black rounded-md"
          type="button"
          onClick={clear}
        >
          Reset Canvas
        </button>
      </div>
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className="border rounded-lg border-slate-800"
      />
    </div>
  );
}
