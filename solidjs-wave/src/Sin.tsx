import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
} from "solid-js";

const ITEM_COUNT = 3000;
const STEP_SIZE = 0.1;
const BAR_SIZE = 0.01;
const FPS_COUNT_BUFFER_SIZE = 100;
const FPS_COUNT_INTERVAL = 100;

let previousFps: number[] = [];

const getAverageFps: () => number = () => {
  return (
    previousFps.reduce((p, c) => {
      return p + c;
    }, 0) / previousFps.length
  );
};

const Sin: Component = () => {
  const [offset, setOffset] = createSignal(0);
  const [fps, setFps] = createSignal(NaN);
  let previousCall = Date.now();
  let isUnmounted = false;
  let animationFrameRequestor: number;

  const values = createMemo(() => {
    return Array.from({ length: ITEM_COUNT }, (_, i) =>
      Math.floor((Math.sin(offset() + i * BAR_SIZE) + 1) * 50)
    );
  });

  const step = () => {
    setOffset(offset() + STEP_SIZE);
    const currentTime = Date.now();
    previousFps.unshift(1000 / (currentTime - previousCall));
    previousFps = previousFps.slice(0, FPS_COUNT_BUFFER_SIZE);
    previousCall = currentTime;
    if (isUnmounted) return;
    animationFrameRequestor = requestAnimationFrame(step);
  };

  const fpsCalculateInterval = setInterval(() => {
    setFps(Math.round(getAverageFps()));
  }, FPS_COUNT_INTERVAL);

  const DOMLoadHandler = () => {
    animationFrameRequestor = requestAnimationFrame(step);
  };

  onMount(() => {
    if (document.readyState !== "loading") {
      DOMLoadHandler();
    } else {
      document.addEventListener("DOMContentLoaded", DOMLoadHandler);
    }
  });

  onCleanup(() => {
    document.removeEventListener("DOMContentLoaded", DOMLoadHandler);
    clearInterval(fpsCalculateInterval);
    cancelAnimationFrame(animationFrameRequestor);
  });

  return (
    <div class="h-screen w-screen bg-black grid grid-cols-1 grid-rows-6 p-8">
      <div class="col-span-1 row-span-1 flex items-center">
        <h2 class="text-6xl text-slate-100 mx-auto border-b-orange-500 border-b-4 pb-2">
          SolidJS wave demo
        </h2>
      </div>
      <h4
        class="text-4xl row-span-1 mx-auto my-8"
        style={{ color: "rgba(256,256,256,0.75)" }}
      >
        {Number.POSITIVE_INFINITY === fps() ? "..." : fps()} FPS
      </h4>
      <div class="col-span-1 row-span-4 pt-8 flex flex-row items-end">
        <For each={values()}>
          {(value, i) => (
            <div
              class="flex-1 bg-orange-500"
              style={{ height: `${value + 1}%` }}
            ></div>
          )}
        </For>
      </div>
    </div>
  );
};

export default Sin;
