import "./style.css";
let urlIndex = 0;
const urls = [
  `http://localhost:3001?${Math.random()}`,
  `http://localhost:3002?${Math.random()}`,
  `http://localhost:3003?${Math.random()}`,
  `http://localhost:3004?${Math.random()}`,
];

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div style="width: 100vw; height: 100vh; display: grid; grid-template-rows: 1fr 50px; grid-template-columns: 1fr 1fr;">
    <iframe id="showcase" src="${urls[urlIndex]}"></iframe>

    <button id="backButton">Back</button>
    <button id="nextButton">Next</button>
  </div>
`;

const iframe = document.getElementById("showcase");

const changeUrlIndex = (delta: number) => () => {
  urlIndex = (urlIndex + delta) % urls.length;
  if (urlIndex < 0) urlIndex = urls.length + urlIndex;
  urlIndex %= urls.length;
  iframe?.setAttribute("src", urls[urlIndex]);
};

document
  .getElementById("nextButton")
  ?.addEventListener("click", changeUrlIndex(1));
document
  .getElementById("backButton")
  ?.addEventListener("click", changeUrlIndex(-1));

let fpsCountBuffer: number[] = [];

let previousTime = Date.now();

const step = () => {
  const currentTime = Date.now();
  fpsCountBuffer.push(1000 / (currentTime - previousTime));
  fpsCountBuffer = fpsCountBuffer.slice(0, 10);
  previousTime = currentTime;
  requestAnimationFrame(step);
};

requestAnimationFrame(step);

setInterval(() => {
  console.log(
    fpsCountBuffer.reduce((p, c) => p + c, 0) / fpsCountBuffer.length
  );
}, 1000);
