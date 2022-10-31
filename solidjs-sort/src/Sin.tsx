import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
} from "solid-js";

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

const Sin: Component = () => {
  const [offset, setOffset] = createSignal(0);
  const [frameInterval, setFrameInterval] = createSignal(0);
  let previousCall = Date.now();
  let isUnmounted = false;

  const values = createMemo(() => {
    return Array.from({ length: ITEM_COUNT }, (_, i) =>
      Math.floor((Math.sin(offset() + i * BAR_SIZE) + 1) * 50)
    );
  });

  const step = () => {
    setOffset(offset() + STEP_SIZE);
    setFrameInterval(Date.now() - previousCall);
    previousCall = Date.now();
    if (isUnmounted) return;
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);

  onCleanup(() => {
    isUnmounted = true;
  });

  const fps = createMemo(() => {
    return averageFps(Math.round(10000 / frameInterval()) / 10);
  });

  return (
    <div class="h-screen w-screen bg-black grid grid-cols-1 grid-rows-6 p-8">
      <div class="col-span-1 row-span-1 flex items-center">
        <h2 class="text-8xl sm:text-6xl text-slate-100 mx-auto border-b-orange-500 border-b-4 pb-2">
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
