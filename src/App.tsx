import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/header";
import { Banner } from "./components/layout/banner";
import { Footer } from "./components/layout/footer";
import { LoginPage, VenuesGrid, VenueDetail, CreateVenuePage } from "./pages";
import { AuthProvider } from "./context/AuthProvider";
import ProfilePage from "./pages/profile";

function AppLayout() {
  const location = useLocation();
  const hideGlobalBanner =
    location.pathname.startsWith("/venue/") ||
    location.pathname === "/profile" ||
    location.pathname === "/create-venue" ||
    location.pathname === "/login";
  const showBanner = !hideGlobalBanner;

  return (
    <>
      <Header />
      {showBanner && <Banner />}
      <Routes>
        <Route path="/" element={<VenuesGrid />} />
        <Route path="/venue/:id" element={<VenueDetail />} />
        <Route path="/create-venue" element={<CreateVenuePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
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
