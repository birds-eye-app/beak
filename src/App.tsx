import { Route, Routes } from "react-router-dom";
import { BirdMap } from "./BirdMap";
import { Home } from "./Home";
import { Chirped } from "./chirped/Chirped";

const NotFound = () => <h1>🐦 Not Found 🐦</h1>;

const Error = () => {
  throw new Error("Oh no! Something went wrong.");
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/birds_eye" element={<BirdMap />} />
        <Route path="/chirped" element={<Chirped />} />
        <Route path="/error" element={<Error />} />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
