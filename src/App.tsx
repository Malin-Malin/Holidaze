import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/header";
import { Banner } from "./components/layout/banner";
import { Footer } from "./components/layout/footer";
import { Breadcrumb } from "./components/layout/breadcrumb";
import cityViewBanner from "./assets/city_view_banner.jpg";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  VenuesGrid,
  VenueDetail,
  CreateVenuePage,
} from "./pages";
import { AuthProvider } from "./context/AuthProvider";
import ProfilePage from "./pages/profile";
import EditProfilePage from "./pages/editProfile";

function AppLayout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const hideGlobalBanner =
    location.pathname.startsWith("/venue/") ||
    location.pathname === "/profile" ||
    location.pathname === "/profile/edit" ||
    location.pathname.startsWith("/create-venue") ||
    isAuthPage;
  const showBreadcrumb =
    location.pathname !== "/" &&
    !isAuthPage &&
    location.pathname !== "/profile";
  const showBanner = !hideGlobalBanner;

  return (
    <>
      {isAuthPage && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${cityViewBanner})` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 bg-black/50"
          />
        </>
      )}

      <div
        className={`${isAuthPage ? "relative z-10 " : ""}flex min-h-[100svh] flex-col`}
      >
        <Header />
        {showBanner ? (
          <>
            <Banner />
            {showBreadcrumb && <Breadcrumb />}
          </>
        ) : (
          showBreadcrumb && <Breadcrumb />
        )}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/venues" element={<VenuesGrid />} />
            <Route path="/venue/:id" element={<VenueDetail />} />
            <Route path="/create-venue" element={<CreateVenuePage />} />
            <Route
              path="/create-venue/:id/edit"
              element={<CreateVenuePage />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
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
