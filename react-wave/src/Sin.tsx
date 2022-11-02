import { useEffect, useMemo, useState } from "react";

const ITEM_COUNT = 3000;
const STEP_SIZE = 0.1;
const BAR_SIZE = 0.01;
const FPS_COUNT_BUFFER_SIZE = 100;
const FPS_COUNT_INTERVAL = 100;

let previousFps: number[] = [];

const getAverageFps: () => number = () => {
  return previousFps.reduce((p, c) => {
    if (isNaN(p)) return c;
    return (p + c) / 2;
  }, NaN);
};

let previousCall = Date.now();

const Sin = () => {
  const [offset, setOffset] = useState(0);
  const [fps, setFps] = useState(NaN);

  const values = useMemo(() => {
    return Array.from({ length: ITEM_COUNT }, (_, i) =>
      Math.floor((Math.sin(offset + i * BAR_SIZE) + 1) * 50)
    );
  }, [offset]);

  useEffect(() => {
    let animationFrameGetter: number;

    const step = () => {
      setOffset((offset) => offset + STEP_SIZE);
      const currentTime = Date.now();
      previousFps.unshift(1000 / (currentTime - previousCall));
      previousFps = previousFps.slice(0, FPS_COUNT_BUFFER_SIZE);
      previousCall = Date.now();
      animationFrameGetter = requestAnimationFrame(step);
    };
    const handleDOMLoad = () => {
      animationFrameGetter = requestAnimationFrame(step);
    };

    const fpsSetter = setInterval(() => {
      setFps(Math.round(getAverageFps()));
    }, FPS_COUNT_INTERVAL);

    if (document.readyState !== "loading") {
      handleDOMLoad();
    } else {
      document.addEventListener("DOMContentLoaded", handleDOMLoad);
    }

    return () => {
      document.removeEventListener("DOMContentLoaded", handleDOMLoad);
      cancelAnimationFrame(animationFrameGetter);
      clearInterval(fpsSetter);
    };
  }, []);

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
        {isNaN(fps) ? "..." : fps} FPS
      </h4>
      <div className="col-span-1 row-span-4 pt-8 flex flex-row items-end">
        {values.map((value) => {
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
