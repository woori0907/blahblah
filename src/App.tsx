import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import Join from "./routes/join";
import Loading from "./components/loading";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protectedroute";
import Resetpassword from "./routes/resetpassword";
import Users from "./routes/users";
import Search from "./routes/search";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/:id",
        element: <Users />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  {
    path: "/join",
    element: <Join />,
  },
  {
    path: "/resetpassword",
    element: <Resetpassword />,
  },
]);

function App() {
  const [isLoading, setLoading] = useState(true);

  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <section className="flex flex-row h-screen w-screen p-8 bg-gray-100">
      {isLoading ? <Loading /> : <RouterProvider router={router} />}
    </section>
  );
}

export default App;
