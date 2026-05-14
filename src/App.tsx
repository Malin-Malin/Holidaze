import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

import AuthProvider from "./context/AuthProvider";

import {
  HomePage,
  LoginPage,
  RegisterPage,
  VenueDetail,
  CreateVenuePage,
  EditVenuePage,
  ProfilePage,
  EditProfilePage,
  VenuesPage,
} from "./pages";

function AppLayout() {
  return (
    <>
      <ScrollRestoration />
      <div className="flex min-h-[100svh] flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/venues", element: <VenuesPage /> },
      { path: "/venues/new", element: <CreateVenuePage /> },
      { path: "/venues/:id", element: <VenueDetail /> },
      { path: "/venues/:id/edit", element: <EditVenuePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/profile/edit", element: <EditProfilePage /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
