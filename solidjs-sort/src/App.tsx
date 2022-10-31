import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
} from "solid-js";

const unsortedArray = Array.from({ length: 100 }, () =>
  Math.floor(Math.random() * 100)
);

function sumRecursively(num: number): number {
  if (num === 0) return 0;

  return num + sumRecursively(num - 1);
}

const App: Component = () => {
  const [values, setValues] = createSignal(unsortedArray);
  const [cursor, setCursor] = createSignal(1);
  const [end, setEnd] = createSignal(unsortedArray.length - 1);
  const startTime = Date.now();
  const totalStepsneeded = sumRecursively(unsortedArray.length - 1);

  const sortStep = () => {
    const cursorR = cursor();
    const vals = values();
    const endRef = end();

    if (cursorR > endRef) {
      if (endRef === 0) return;
      setCursor(1);
      setEnd(endRef - 1);
      requestAnimationFrame(sortStep);
      return;
    }

    if (vals[cursorR] < vals[cursorR - 1]) {
      const temp = vals[cursorR];
      vals[cursorR] = vals[cursorR - 1];
      vals[cursorR - 1] = temp;
      setValues([...vals]);
    }
    setCursor(cursorR + 1);
    requestAnimationFrame(sortStep);
  };

  const fps = createMemo(() => {
    const completedSteps = Math.max(
      1,
      totalStepsneeded - sumRecursively(end())
    );
    return (
      Math.round(100000 / ((Date.now() - startTime) / completedSteps)) / 100
    );
  });

  requestAnimationFrame(sortStep);

  return (
    <div class="h-screen w-screen bg-black grid grid-cols-1 grid-rows-6 p-8">
      <div class="col-span-1 row-span-1 flex items-center">
        <h2 class="text-8xl text-slate-100 mx-auto border-b-orange-500 border-b-4 pb-2">
          SolidJS sorting demo
        </h2>
        {/* <button class="bg-orange-600 rounded p-4 text-white" onClick={sortStep}>
          Sort step
        </button> */}
      </div>
      <h4
        class="text-4xl row-span-1 mx-auto my-8"
        style={{ color: "rgba(256,256,256,0.75)" }}
      >
        {Number.POSITIVE_INFINITY === fps() ? "..." : fps()} steps/s
      </h4>
      <div class="col-span-1 row-span-4 pt-8 flex flex-row items-end">
        <For each={values()}>
          {(value, i) => (
            <div
              class={`flex-1 ${
                cursor() === i() || cursor() - 1 === i()
                  ? "bg-orange-900"
                  : "bg-orange-500"
              } ${end() === i() ? "border-b-2 border-blue-300" : ""}`}
              style={{ height: `${value + 1}%` }}
            ></div>
          )}
        </For>
      </div>
    </div>
  );
};

export default App;
