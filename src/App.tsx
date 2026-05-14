import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import { ScrollManager } from "./components/layout/scrollManager";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  VenuesGrid,
  VenueDetail,
  CreateVenuePage,
  EditVenuePage,
  ProfilePage,
  EditProfilePage,
} from "./pages";
import { AuthProvider } from "./context/AuthProvider";

function AppLayout() {
  return (
    <>
      <ScrollManager />
      <div className={`flex min-h-[100svh] flex-col`}>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/venues" element={<VenuesGrid />} />
            <Route path="/venue/:id" element={<VenueDetail />} />
            <Route path="venue/new" element={<CreateVenuePage />} />
            <Route path="/venue/:id/edit" element={<EditVenuePage />} />
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
