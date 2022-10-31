import { useMemo, useState } from "react";

const unsortedArray = Array.from({ length: 50 }, () =>
  Math.floor(Math.random() * 100)
);

function sumRecursively(num: number): number {
  if (num === 0) return 0;

  return num + sumRecursively(num - 1);
}

const startTime = Date.now();

const App = () => {
  const [values, setValues] = useState(unsortedArray);
  const [cursor, setCursor] = useState(1);
  const [end, setEnd] = useState(unsortedArray.length - 1);

  const totalStepsneeded = sumRecursively(unsortedArray.length - 1);

  const fps = useMemo(() => {
    const completedSteps = totalStepsneeded - sumRecursively(end);
    console.log(
      Math.round(100000 / ((Date.now() - startTime) / completedSteps)) / 100
    );
    return (
      Math.round(100000 / ((Date.now() - startTime) / completedSteps)) / 100
    );
  }, [end]);

  const sortStep = () => {
    const cursorR = cursor;
    const vals = values;
    const endRef = end;

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
    setCursor(cursor + 1);
    // setCursor((cursor) => cursor + 1);
    requestAnimationFrame(sortStep);
  };

  requestAnimationFrame(sortStep);

  return (
    <div className="h-screen w-screen bg-black grid grid-cols-1 grid-rows-6 p-8">
      <div className="col-span-1 row-span-1 flex items-center">
        <h2 className="text-8xl text-slate-100 mx-auto border-b-orange-500 border-b-4 pb-2">
          React sorting demo
        </h2>
        {/* <button class="bg-orange-600 rounded p-4 text-white" onClick={sortStep}>
          Sort step
        </button> */}
      </div>
      <h4
        className="text-4xl row-span-1 mx-auto my-8"
        style={{ color: "rgba(256,256,256,0.75)" }}
      >
        {Number.POSITIVE_INFINITY === fps ? "..." : fps} steps/s
      </h4>
      <div className="col-span-1 row-span-4 pt-8 flex flex-row items-end">
        {values.map((value, i) => (
          <div
            key={i}
            className={`flex-1 ${
              cursor === i || cursor - 1 === i
                ? "bg-orange-900"
                : "bg-orange-500"
            } ${end === i ? "border-b-2 border-blue-300" : ""}`}
            style={{ height: `${value + 1}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App;
