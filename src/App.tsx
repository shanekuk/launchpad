import OpportunitiesPage from "./pages/OpportunitiesPage";
import MapPage from "./pages/MapPage";
import SavedPage from "./pages/SavedPage";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<OpportunitiesPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/saved" element={<SavedPage />} />
      </Routes>
    </>
  );
}

export default App;
