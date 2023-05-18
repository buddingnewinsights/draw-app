"use client";

import { FC, useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { io } from "socket.io-client";

import { useDraw } from "@/hooks/useDraw";
import { drawLine } from "@/utils/drawLine";

type pageProps = {};

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

const socket = io("http://localhost:3001");

const Home: FC<pageProps> = ({}) => {
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      socket.emit("canvas-state", canvasRef.current?.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("I received state from server");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, color }: DrawLineProps) => {
        if (!ctx) return;
        drawLine({ prevPoint, currentPoint, ctx, color });
      }
    );

    socket.on("clear", clear);

    return () => {
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("draw-line");
      socket.off("clear");
    };
  }, [canvasRef, clear]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, color });
    drawLine({ prevPoint, currentPoint, ctx, color });
  }

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="flex flex-col gap-3 p-4">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          className="p-2 border border-black rounded-md"
          type="button"
          onClick={() => socket.emit("clear")}
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
};

export default Home;
