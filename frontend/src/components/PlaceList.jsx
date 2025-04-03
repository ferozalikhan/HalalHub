import { FaStar } from "react-icons/fa";
import "../styles/PlaceList.css";
import { useEffect, useState } from "react";
import axios from "axios";


import { use } from "react";

export default function PlaceList({
selectedPlace // e.g., { name: "Live Oak", formattedAddress: "Live Oak, CA 95953, USA", latitude: 39.334, longitude: -121.735 }

})
{

    // useState to manage the fetched places (e.g., restaurants, stores, food trucks)
    const [places, setPlaces] = useState([]);
    // useState to manage the loading state
    const [loading, setLoading] = useState(true);
    


    useEffect(() => {
        const fetchPlaces = async () => {
            if (!selectedPlace?.latitude || !selectedPlace?.longitude) return;
    
            try {
                const response = await axios.post("http://localhost:3000/api/places/restaurants/nearby", {
                    lat: selectedPlace.latitude,
                    lng: selectedPlace.longitude
                });
    
                console.log("Fetched places:", response.data.places);
                setPlaces(response.data.places);  // Update state
    
            } catch (error) {
                console.error("Error fetching places:", error.response?.data || error.message);
            }
        };
    
        fetchPlaces();
    }, [selectedPlace]);
     // Dependency array ensures re-fetching when selectedPlace changes
    



  return (
    <>
      {/* Featured sections */}
      <div className="featured-grid">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="card featured-card">
                                    <div className="card-img placeholder"></div>
                                    <div className="card-content">
                                        <div className="card-header">
                                            <h3>Restaurant Name {item}</h3>
                                            <span className="badge badge-verified">Verified Halal</span>
                                        </div>
                                        <div className="card-meta">
                                            <div className="stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < 4 ? "star-icon filled" : "star-icon"} />
                                                ))}
                                                <span>(42)</span>
                                            </div>
                                            <span className="price">$$</span>
                                            <span className="distance">0.{item} mi</span>
                                        </div>
                                        <p className="card-description">
                                            Authentic halal cuisine with a modern twist. Popular for their signature dishes.
                                        </p>
                                        <button className="btn btn-secondary view-details">View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
      
    </>
  );
}