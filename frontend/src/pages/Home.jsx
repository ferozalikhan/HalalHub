import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import MapComponent from "../components/MapComponent.jsx";
import SideBar from "../components/SideBar.jsx";
import "../styles/Home.css";
import "../App.css";
import { FaFilter, FaTimes, FaStar, FaUtensils, FaTruck, FaStore } from 'react-icons/fa';
import PlaceList from "../components/PlaceList.jsx";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  }

  return (
    <div className="home-page">
      {/* Pass toggleSidebarHandler to Navbar */}
      <Navbar toggleSidebarHandler={toggleSidebar} />


      <main className="main-container">

        <SideBar toggleSidebar={sidebarOpen} manageSidebar={toggleSidebar} />
        
         <div className={`map-section ${sidebarOpen ? 'with-sidebar' : ''}`}>
                    <div className="map-header">
                        <div>
                            <h1>Discover Halal Food Near You</h1>
                            <p className="subtitle">Find the best halal options in your neighborhood</p>
                        </div>
                        
                    </div>                    
                    <div className="map-container">
                        <MapComponent />
                        <div className="map-overlay">
                            <span className="map-hint">Click on a marker to view details</span>
                        </div>
                    </div>
                
                    {/* Featured sections */}
                    <section className="featured-section">
                        <h2>Top Rated Near You</h2>
                        <PlaceList />
                    </section>
                </div>
        
      </main>
    </div>
  );
}
