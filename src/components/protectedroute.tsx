import React from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  console.log(user?.providerData[0].providerId);

  if (user?.providerData[0].providerId === "github.com") {
    return children;
  }
  if (user === null || user.emailVerified === false) {
    return <Navigate to="/login" />;
  }
  return children;
}
