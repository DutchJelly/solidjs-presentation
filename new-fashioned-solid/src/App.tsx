import { lazy, Suspense } from "solid-js";
import { Routes, Route, Router } from "@solidjs/router";

const VictoryScreen = lazy(() => import("./pages/VictoryScreen"));
const HigherLower = lazy(() => import("./pages/HigherLower"));

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" component={HigherLower} />
        <Route path="/victory" component={VictoryScreen} />
        <Route path="*" component={() => <h1>404 not found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
