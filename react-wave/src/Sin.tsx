import { useEffect, useMemo, useState } from "react";

const ITEM_COUNT = 2000;
const STEP_SIZE = 0.1;
const BAR_SIZE = 0.01;

let previousFps: number[] = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const averageFps = (fps: number) => {
  previousFps.push(fps);
  previousFps = previousFps.slice(1);
  return Math.round(
    previousFps.reduce((p, c) => {
      if (p === 0) return c;
      return (p + c) / 2;
    }, 0)
  );
};

let previousCall = Date.now();

const Sin = () => {
  const [offset, setOffset] = useState(0);
  const [frameInterval, setFrameInterval] = useState(0);

  const values = useMemo(() => {
    return Array.from({ length: ITEM_COUNT }, (_, i) =>
      Math.floor((Math.sin(offset + i * BAR_SIZE) + 1) * 50)
    );
  }, [offset]);

  useEffect(() => {
    let isUnmounted = false;
    const step = () => {
      setOffset((offset) => offset + STEP_SIZE);
      setFrameInterval(Date.now() - previousCall);
      previousCall = Date.now();
      if (!isUnmounted) return;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    return () => {
      isUnmounted = true;
    };
  }, []);

  const fps = useMemo(() => {
    return averageFps(Math.round(10000 / frameInterval) / 10);
  }, [frameInterval]);

  return (
    <div className="h-screen w-screen bg-black grid grid-cols-1 grid-rows-6 p-8">
      <div className="col-span-1 row-span-1 flex items-center">
        <h2 className="text-6xl text-slate-100 mx-auto border-b-orange-500 border-b-4 pb-2">
          React wave demo
        </h2>
      </div>
      <h4
        className="text-4xl row-span-1 mx-auto my-8"
        style={{ color: "rgba(256,256,256,0.75)" }}
      >
        {Number.POSITIVE_INFINITY === fps ? "..." : fps} FPS
      </h4>
      <div className="col-span-1 row-span-4 pt-8 flex flex-row items-end">
        {values.map((value, i) => {
          return (
            <div
              className="flex-1 bg-orange-500"
              style={{ height: `${value + 1}%` }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Sin;
