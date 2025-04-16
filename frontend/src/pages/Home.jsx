import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import MapComponent from "../components/MapComponent.jsx";
import SideBar from "../components/SideBar.jsx";
import "../styles/Home.css";
import "../App.css";
import { FaFilter, FaTimes, FaStar, FaUtensils, FaTruck, FaStore } from 'react-icons/fa';
import PlaceList from "../components/PlaceList.jsx";
import axios from "axios";
import { useEffect } from "react";


export default function Home(
  {
  userLocation,
  setUserLocation,
  selectedPlace,
  setSelectedPlace,
  places,
  setPlaces,
  loading,
  }
) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
 

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  }

  return (
    <div className="home-page">
      {/* Pass toggleSidebarHandler to Navbar */}
      <Navbar toggleSidebarHandler={toggleSidebar} selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} />


      <main className="main-container">

        <SideBar toggleSidebar={sidebarOpen} manageSidebar={toggleSidebar} />
        
         <div className={`map-section ${sidebarOpen ? 'with-sidebar' : ''}`}>
                    <div className="map-header">
                        <div>
                            <h1>Discover Halal Food Near You</h1>
                            {/* <p className="subtitle">Find the best halal options in your neighborhood</p> */}
                        </div>
                        
                    </div>                    
                    <div className="map-container">
                        <MapComponent 
                        userLocation={userLocation}
                        setUserLocation={setUserLocation}
                        selectedPlace={selectedPlace} 
                        setSelectedPlace={setSelectedPlace}
                        places={places}
                         />
                        <div className="map-overlay">
                            <span className="map-hint">Click on a marker to view details</span>
                        </div>
                    </div>
                
                    {/* Featured sections */}
                    <section className="featured-section">
                        <h2>Top Rated Near You</h2>
                        <PlaceList places={places} userLocation={userLocation} loading={loading} />
                    </section>
                </div>
        
      </main>
    </div>
  );
}
