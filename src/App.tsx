import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/header";
import { Banner } from "./components/layout/banner";
import VenuesGrid from "./pages/venueGrid";
import VenueDetail from "./pages/venueDetail";
import { Footer } from "./components/layout/footer";

function AppLayout() {
  const location = useLocation();
  const showBanner = !location.pathname.startsWith("/venue/");

  return (
    <>
      <Header />
      {showBanner && <Banner />}
      <Routes>
        <Route path="/" element={<VenuesGrid />} />
        <Route path="/venue/:id" element={<VenueDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
