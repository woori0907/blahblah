import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Tweetform from "../components/tweetform";
import Timeline from "../components/timeline";

export default function Home() {
  return (
    <div className="w-full basis-3/5 bg-white rounded-xl p-5 shadow-lg overflow-y-hidden flex flex-col">
      <Tweetform />
      <div className="w-full h-px bg-gray-200 my-8"></div>
      <Timeline />
    </div>
  );
}
