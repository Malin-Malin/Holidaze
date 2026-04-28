import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/header";
import { Banner } from "./components/layout/banner";
import { Footer } from "./components/layout/footer";
import { LoginPage, VenuesGrid, VenueDetail, CreateVenuePage } from "./pages";
import { AuthProvider } from "./context/AuthProvider";

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
        <Route path="/create-venue" element={<CreateVenuePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
