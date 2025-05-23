/* eslint-disable react/prop-types */
import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import MapComponent from "../components/MapComponent.jsx";
import SideBar from "../components/SideBar.jsx";
import "../styles/Home.css";
import "../App.css";
import { FaFilter, FaTimes, FaStar, FaUtensils, FaTruck, FaStore } from 'react-icons/fa';
import PlaceList from "../components/PlaceList.jsx";
import { useRef } from "react";
import AuthModal from '../components/AuthModal.jsx';


export default function Home(
  {
  userLocation,
  setUserLocation,
  selectedPlace,
  setSelectedPlace,
  places,
  searchMode,
  setSearchMode,

  fetchNextPage,
  hasMore,
  loading,
  loadingMore,
  selectedCategories,
  setSelectedCategories,
  selectedFilters,
  setSelectedFilters,
  mapState,
  setMapState,
  }
) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
    // State to manage all filter selections in the sidebar
  
  const hasDraggedRef = useRef(false);
  const hasInteractedRef = useRef(false);        // avoid first idle event
  const isDraggingAllowedRef = useRef(true);     // only true after nearby/text


const [showAuthModal, setShowAuthModal] = useState(false);
const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

 

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  }

  return (
    <div className="home-page">
      {/* Pass toggleSidebarHandler to Navbar */}
      <Navbar 
        toggleSidebarHandler={toggleSidebar} 
        selectedPlace={selectedPlace} 
        setSelectedPlace={setSelectedPlace} 
        searchMode={searchMode}
        setSearchMode= {setSearchMode}
        hasDraggedRef={hasDraggedRef}
        hasInteractedRef={hasInteractedRef}
        isDraggingAllowedRef={isDraggingAllowedRef}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        onLoginClick={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }}
        onSignupClick={() => {
          setAuthMode('signup');
          setShowAuthModal(true);
        }}
      />


      <main className="main-container">

        <SideBar 
          toggleSidebar={sidebarOpen} 
          manageSidebar={toggleSidebar} 
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          searchMode={searchMode}
        />
        
         <div className={`map-section ${sidebarOpen ? 'with-sidebar' : ''}`}>
                                      
                    <div className="map-container">
                        <MapComponent 
                        userLocation={userLocation}
                        setUserLocation={setUserLocation}
                        selectedPlace={selectedPlace} 
                        setSelectedPlace={setSelectedPlace}
                        searchMode={searchMode}
                        setSearchMode={setSearchMode}
                        hasDraggedRef={hasDraggedRef}
                        hasInteractedRef={hasInteractedRef}
                        isDraggingAllowedRef={isDraggingAllowedRef}
                        places={places}
                        distanceFilter={selectedFilters?.distance || 5}
                        mapState={mapState}
                        setMapState={setMapState}
                         />
                        <div className="map-overlay">
                            <span className="map-hint">Click on a marker to view details</span>
                        </div>
                    </div>
                
                    {/* Featured sections */}
                    <section className="featured-section">
                        {/* <h2>Top Rated Near You</h2> */}
                        {/* if places.length is 0 dont show the header else dynamically show near you if mode = nearby and show in city when mode is = text */}
                        {places.length > 0 && (
                            <h2>{searchMode === "nearby" ? "Top Rated Near You" : `Top Rated in ${selectedPlace.name}`}</h2>
                        )}
                        {/* If places.length is 0 show a message */}
                        <PlaceList 
                        places={places}
                         userLocation={userLocation}
                          loading={loading}
                         />
                        {/* If places.length is 0 show a message */}
                         {/* add a load more button */}
                        {places.length > 0 && hasMore && (
                        <div className="load-more">
                          <button className="load-more-btn" 
                          onClick={fetchNextPage} 
                          disabled={loadingMore}
                          >
                            {loading ? "Loading..." : "Load More"}
                          </button>
                        </div>
                        )}
                    </section>

                </div>
                {/* Auth Modal */}
                {showAuthModal && (
                  <div className="auth-modal-backdrop">
                    <AuthModal 
                      mode={authMode}
                      onClose={() => setShowAuthModal(false)}
                    />
                  </div>
                )}
      </main>
    </div>
  );
}
