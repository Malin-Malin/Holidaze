import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/header";
import { Banner } from "./components/layout/banner";
import { Footer } from "./components/layout/footer";
import { Breadcrumb } from "./components/layout/breadcrumb";
import {
  LoginPage,
  RegisterPage,
  VenuesGrid,
  VenueDetail,
  CreateVenuePage,
} from "./pages";
import { AuthProvider } from "./context/AuthProvider";
import ProfilePage from "./pages/profile";

function AppLayout() {
  const location = useLocation();
  const hideGlobalBanner =
    location.pathname.startsWith("/venue/") ||
    location.pathname === "/profile" ||
    location.pathname.startsWith("/create-venue") ||
    location.pathname === "/login" ||
    location.pathname === "/register";
  const showBreadcrumb =
    location.pathname !== "/" && location.pathname !== "/login";
  const showBanner = !hideGlobalBanner;

  return (
    <>
      <Header />
      {showBanner && <Banner />}
      {showBreadcrumb && <Breadcrumb />}
      <Routes>
        <Route path="/" element={<VenuesGrid />} />
        <Route path="/venue/:id" element={<VenueDetail />} />
        <Route path="/create-venue" element={<CreateVenuePage />} />
        <Route path="/create-venue/:id/edit" element={<CreateVenuePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
