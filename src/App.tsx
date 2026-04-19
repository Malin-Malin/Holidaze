import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VenuesGrid from "./pages/venueGrid";
import VenueDetail from "./pages/venueDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VenuesGrid />} />
        <Route path="/venue/:id" element={<VenueDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
