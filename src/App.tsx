import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import RequireAuth from "./components/auth/RequireAuth";

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
  NotFoundPage,
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
      {
        path: "/venues/new",
        element: (
          <RequireAuth requireVenueManager>
            <CreateVenuePage />
          </RequireAuth>
        ),
      },
      { path: "/venues/:id", element: <VenueDetail /> },
      {
        path: "/venues/:id/edit",
        element: (
          <RequireAuth requireVenueManager>
            <EditVenuePage />
          </RequireAuth>
        ),
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/profile",
        element: (
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        ),
      },
      {
        path: "/profile/edit",
        element: (
          <RequireAuth>
            <EditProfilePage />
          </RequireAuth>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
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
