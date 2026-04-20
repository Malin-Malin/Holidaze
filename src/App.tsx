import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/header";
import { Banner } from "./components/layout/banner";
import VenuesGrid from "./pages/venueGrid";
import VenueDetail from "./pages/venueDetail";
import { Footer } from "./components/layout/footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Banner />
      <Routes>
        <Route path="/" element={<VenuesGrid />} />
        <Route path="/venue/:id" element={<VenueDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
