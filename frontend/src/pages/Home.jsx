import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import MapComponent from "../components/MapComponent.jsx";
import SideBar from "../components/SideBar.jsx";
import "../styles/Home.css";
import "../App.css";

export default function Home() {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  function toggleSidebarHandler() {
    setToggleSidebar((prev) => !prev);
  }

  return (
    <div className="home-page">
      {/* Pass toggleSidebarHandler to Navbar */}
      <Navbar toggleSidebarHandler={toggleSidebarHandler} />
      <main className="main-container">
        <SideBar toggleSidebar={toggleSidebar} manageSidebar={toggleSidebarHandler} />
        <div className={`body-container ${toggleSidebar ? "sidebar-open" : "sidebar-closed"}`}>
          <MapComponent />
        </div>
      </main>
    </div>
  );
}
