/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import Sin from "./Sin";
import App from "./App";

render(() => <Sin />, document.getElementById("root") as HTMLElement);
