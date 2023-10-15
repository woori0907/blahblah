import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import Join from "./routes/join";

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
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
