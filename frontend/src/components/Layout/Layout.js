import React from "react";
import Navigation from "../Navigation/Navigation";
import { Outlet } from "react-router-dom";
import "./Layout.css";


function Layout() {
  return (
    <div>
      <Navigation />
      <div className="mainPage">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
