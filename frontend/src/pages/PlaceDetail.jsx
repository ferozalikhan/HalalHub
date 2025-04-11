import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaPhone, FaGlobe, FaClock, 
         FaUtensils, FaWalking, FaParking, FaRegCreditCard,
         FaWheelchair, FaArrowLeft } from "react-icons/fa";
import "../styles/PlaceDetail.css";

export default function PlaceDetail({ places }) {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  
  useEffect(() => {
    // In a real app, you might fetch data here instead
    if (places && places.length > 0) {
      const foundPlace = places.find((p, index) => p.id === id || index.toString() === id);
      setPlace(foundPlace);
    }
    setLoading(false);
  }, [id, places]);
  
  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading place details...</p>
      </div>
    );
  }
  
  if (!place) {
    return (
      <div className="detail-error">
        <h2>Place Not Found</h2>
        <p>We couldn't find the halal place you're looking for.</p>
        <Link to="/" className="btn btn-primary">Return to Home</Link>
      </div>
    );
  }
  
  // Format price level
  const priceSymbols = place.priceLevel ? "$".repeat(place.priceLevel) : "$$";
  
  // Format opening hours if available
  const openingHours = place.regularOpeningHours?.periods?.map(period => {
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][period.open?.day];
    const openTime = period.open?.hour + ":" + (period.open?.minute || "00");
    const closeTime = period.close?.hour + ":" + (period.close?.minute || "00");
    return { day, openTime, closeTime };
  });
  
  // Payment options formatting
  const paymentMethods = [];
  if (place.paymentOptions) {
    if (place.paymentOptions.acceptsCreditCards) paymentMethods.push("Credit Cards");
    if (place.paymentOptions.acceptsDebitCards) paymentMethods.push("Debit Cards");
    if (place.paymentOptions.acceptsCash) paymentMethods.push("Cash");
    if (place.paymentOptions.acceptsNfc) paymentMethods.push("Mobile Payment");
  }
  
  return (
    <div className="place-detail-container">
      <div className="place-detail-header">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Back to results
        </Link>
        
        <div className="header-content">
          <div className="header-text">
            <h1>{place.displayName?.text || "Unknown Place"}</h1>
            <div className="place-meta">
              <div className="stars-large">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(place.rating) ? "star-icon filled" : "star-icon"} />
                ))}
                <span className="rating">{place.rating?.toFixed(1) || "N/A"}</span>
                <span className="rating-count">({place.userRatingCount || 0} reviews)</span>
              </div>
              <span className="price-tag">{priceSymbols}</span>
              <span className="badge badge-verified">Verified Halal</span>
            </div>
            
            {place.primaryType && (
              <p className="place-category">
                <FaUtensils className="category-icon" />
                {place.primaryType.replace(/_/g, ' ').toLowerCase()}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="place-hero">
        {place.photos && place.photos.length > 0 ? (
          <div className="photo-grid">
            {place.photos.slice(0, 4).map((photo, index) => (
              <div 
                key={index} 
                className={`photo-item ${index === 0 ? 'photo-main' : ''}`}
                style={{
                  backgroundImage: `url(${photo.name})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
            ))}
          </div>
        ) : (
          <div className="photo-placeholder"></div>
        )}
      </div>
      
      <div className="place-detail-content">
        <div className="place-detail-tabs">
          <button 
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`} 
            onClick={() => setActiveTab('info')}
          >
            Information
          </button>
          <button 
            className={`tab-button ${activeTab === 'hours' ? 'active' : ''}`} 
            onClick={() => setActiveTab('hours')}
          >
            Hours & Location
          </button>
          <button 
            className={`tab-button ${activeTab === 'features' ? 'active' : ''}`} 
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'info' && (
            <div className="info-tab">
              <div className="info-section">
                <h3>About</h3>
                <p className="editorial-summary">
                  {place.editorialSummary?.text || "No description available for this place."}
                </p>
                
                <div className="contact-info">
                  {place.formattedAddress && (
                    <div className="contact-item">
                      <FaMapMarkerAlt className="contact-icon" />
                      <span>{place.formattedAddress}</span>
                    </div>
                  )}
                  
                  {place.nationalPhoneNumber && (
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <a href={`tel:${place.nationalPhoneNumber}`}>{place.nationalPhoneNumber}</a>
                    </div>
                  )}
                  
                  {place.websiteUri && (
                    <div className="contact-item">
                      <FaGlobe className="contact-icon" />
                      <a href={place.websiteUri} target="_blank" rel="noopener noreferrer">Visit Website</a>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="info-section">
                <h3>Dining Options</h3>
                <div className="features-grid">
                  {place.dineIn && (
                    <div className="feature-item">
                      <FaUtensils className="feature-icon" />
                      <span>Dine-in Available</span>
                    </div>
                  )}
                  {place.delivery && (
                    <div className="feature-item">
                      <FaWalking className="feature-icon" />
                      <span>Delivery Available</span>
                    </div>
                  )}
                  {place.takeout && (
                    <div className="feature-item">
                      <FaUtensils className="feature-icon" />
                      <span>Takeout Available</span>
                    </div>
                  )}
                  {place.servesVegetarianFood && (
                    <div className="feature-item">
                      <FaUtensils className="feature-icon" />
                      <span>Vegetarian Options</span>
                    </div>
                  )}
                </div>
              </div>
              
              {place.googleMapsUri && (
                <a 
                  href={place.googleMapsUri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary get-directions"
                >
                  Get Directions
                </a>
              )}
            </div>
          )}
          
          {activeTab === 'hours' && (
            <div className="hours-tab">
              <div className="info-section">
                <h3>Hours of Operation</h3>
                {place.currentOpeningHours?.openNow !== undefined && (
                  <div className={`current-status ${place.currentOpeningHours.openNow ? 'open' : 'closed'}`}>
                    <FaClock className="status-icon" />
                    <span>{place.currentOpeningHours.openNow ? 'Open Now' : 'Closed'}</span>
                  </div>
                )}
                
                {openingHours && openingHours.length > 0 ? (
                  <div className="hours-list">
                    {openingHours.map((hours, index) => (
                      <div key={index} className="hours-item">
                        <span className="day">{hours.day}</span>
                        <span className="time">{hours.openTime} - {hours.closeTime}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hours information available.</p>
                )}
              </div>
              
              <div className="info-section">
                <h3>Location</h3>
                <div className="map-placeholder">
                  <div className="map-overlay-container">
                    <div className="map-pin">
                      <FaMapMarkerAlt className="pin-icon" />
                    </div>
                    {place.formattedAddress && <p className="address-display">{place.formattedAddress}</p>}
                  </div>
                </div>
                
                {place.googleMapsUri && (
                  <a 
                    href={place.googleMapsUri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary view-map"
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'features' && (
            <div className="features-tab">
              <div className="info-section">
                <h3>Payment Options</h3>
                {paymentMethods.length > 0 ? (
                  <div className="features-grid">
                    {paymentMethods.map((method, index) => (
                      <div key={index} className="feature-item">
                        <FaRegCreditCard className="feature-icon" />
                        <span>{method}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No payment information available.</p>
                )}
              </div>
              
              <div className="info-section">
                <h3>Amenities</h3>
                <div className="features-grid">
                  {place.restroom && (
                    <div className="feature-item">
                      <FaWheelchair className="feature-icon" />
                      <span>Restroom Available</span>
                    </div>
                  )}
                  
                  {/* We can explicitly note when alcohol is not served, which is relevant for halal places */}
                  {!place.servesBeer && !place.servesWine && (
                    <div className="feature-item positive">
                      <FaUtensils className="feature-icon" />
                      <span>No Alcohol Served</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}