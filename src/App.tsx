import { Route, Routes } from "react-router-dom";
import { BirdMap } from "./BirdMap";
import { Home } from "./Home";
import { Chirped } from "./chirped/Chirped";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/birds_eye" element={<BirdMap />} />
        <Route path="/chirped" element={<Chirped />} />
        {/* 404 */}
        <Route path="*" element={<h1>🐦 Not Found 🐦</h1>} />
      </Routes>
    </>
  );
}

export default App;
