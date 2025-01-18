import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import CountryPage from "./pages/CountryPage";
import FlagGame from "./pages/FlagGame";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:name" element={<CountryPage />} />
        <Route path="/flag-game" element={<FlagGame />} />
      </Routes>
    </Router>
  );
}

export default App;
