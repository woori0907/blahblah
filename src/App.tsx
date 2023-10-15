import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import Join from "./routes/join";
import Loading from "./components/loading";
import { auth } from "./firebase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/:id",
        element: <Profile />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  {
    path: "/join",
    element: <Join />,
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

  return <>{isLoading ? <Loading /> : <RouterProvider router={router} />}</>;
}

export default App;
