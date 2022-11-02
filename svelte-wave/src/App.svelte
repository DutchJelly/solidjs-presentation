<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  const ITEM_COUNT = 4000;
  const STEP_SIZE = 0.1;
  const BAR_SIZE = 0.005;
  const FPS_COUNT_BUFFER_SIZE = 10;
  const FPS_COUNT_INTERVAL = 100;

  let offset = 0;
  let previousFrameTime = Date.now();
  let fps = NaN;
  let fpsBuffer = [];
  let animationFrameWaiter;

  const getValues = () => {
    return Array.from({ length: ITEM_COUNT }, (_, i) =>
      Math.floor((Math.sin(offset + i * BAR_SIZE) + 1) * 50)
    );
  };

  const fpsCalculatorInterval = setInterval(() => {
    fps = Math.round(
      fpsBuffer.reduce((previousFrameTime, currentFrameTime) => {
        if ((previousFrameTime = -1)) return currentFrameTime;
        return (previousFrameTime + currentFrameTime) / 2;
      }, -1)
    );
  }, FPS_COUNT_INTERVAL);

  let values = getValues();

  const step = () => {
    offset += STEP_SIZE;
    values = getValues();
    const currentFrameTime = Date.now();
    fpsBuffer.unshift(1000 / (currentFrameTime - previousFrameTime));
    previousFrameTime = currentFrameTime;
    fpsBuffer = fpsBuffer.slice(0, FPS_COUNT_BUFFER_SIZE);
    animationFrameWaiter = requestAnimationFrame(step);
  };

  const DOMLoadHandler = () => {
    animationFrameWaiter = requestAnimationFrame(step);
  };

  onMount(() => {
    if (document.readyState !== "loading") {
      DOMLoadHandler();
    } else {
      document.addEventListener("DOMContentLoaded", DOMLoadHandler);
    }
  });

  onDestroy(() => {
    document.removeEventListener("DOMContentLoaded", DOMLoadHandler);
    clearInterval(fpsCalculatorInterval);
    cancelAnimationFrame(animationFrameWaiter);
  });
</script>

<main>
  <div class="h-screen w-screen bg-black grid grid-cols-1 grid-rows-6 p-8">
    <div class="col-span-1 row-span-1 flex items-center">
      <h2
        class="text-6xl text-slate-100 mx-auto border-b-orange-500 border-b-4 pb-2"
      >
        Svelte wave demo
      </h2>
    </div>
    <h4
      class="text-4xl row-span-1 mx-auto my-8"
      style="color: rgba(256,256,256,0.75)"
    >
      {fps} FPS
    </h4>
    <div class="col-span-1 row-span-4 pt-8 flex flex-row items-end">
      {#each values as value}
        <div class="flex-1 bg-orange-500" style="height: {value + 1}%;" />
      {/each}
    </div>
  </div>
</main>
