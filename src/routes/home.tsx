import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };
  console.log(auth.currentUser);
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
