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
      </Routes>
    </>
  );
}

export default App;
