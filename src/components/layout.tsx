import React from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "./navbar";
import SideMenu from "./sidemenu";

export default function Layout() {
  return (
    <section className="flex gap-10 w-full ">
      <Navbar />
      <Outlet />
      <SideMenu />
    </section>
  );
}
