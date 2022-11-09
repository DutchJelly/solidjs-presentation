import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const VictoryScreen = lazy(() => import("./pages/VictoryScreen"));
const HigherLower = lazy(() => import("./pages/HigherLower"));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<h1>Loading</h1>}>
              <HigherLower />
            </Suspense>
          }
        />
        <Route
          path="/victory"
          element={
            <Suspense fallback={<h1>Loading</h1>}>
              <VictoryScreen />
            </Suspense>
          }
        />
        <Route path="*" element={<h1>404 not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
