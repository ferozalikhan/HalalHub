/* eslint-disable react/prop-types */
import '../styles/SideBar.css';
import {
  FaFilter,
  FaTimes,
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaCertificate
} from 'react-icons/fa';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { BiDish } from 'react-icons/bi';
import { useEffect } from 'react';

export default function SideBar({
  toggleSidebar,
  manageSidebar,
  selectedFilters,
  setSelectedFilters,
  searchMode,
}) {
  const handleCheckboxChange = (filterType, value) => {
    setSelectedFilters(prev => {
      if (filterType === 'rating') {
        return {
          ...prev,
          rating: prev.rating === value ? null : value
        };
      }
      const isSelected = prev[filterType].includes(value);
      return {
        ...prev,
        [filterType]: isSelected
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value]
      };
    });
  };

    // useEffect to log selected categories
    useEffect(() => {
      // !! Debugging: Log the selected categories
      console.log("📍------------ inside SideBar ---------📍");
      console.log("Selected Filters:", selectedFilters);
      console.log("Selected Cuisine:", selectedFilters.cuisine);
      console.log("Selected Price:", selectedFilters.price);
      console.log("Selected Rating:", selectedFilters.rating);
      console.log("Selected Features:", selectedFilters.features);
      console.log("Selected Certification:", selectedFilters.certification);
      console.log("Selected Distance:", selectedFilters.distance);
      console.log("📍-------------------📍-----------------📍");
      console.log("");
    }, [selectedFilters]);
  const handleDistanceChange = (e) => {
    setSelectedFilters(prev => ({
      ...prev,
      distance: parseInt(e.target.value, 10)
    }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      price: [],
      rating: null,
      features: [],
      certification: [],
      distance: 5
    });
  };

  const cuisineOptions = [
    { id: 'middle-eastern', label: 'Middle Eastern' },
    { id: 'south-asian', label: 'South Asian' },
    { id: 'mediterranean', label: 'Mediterranean' },
    { id: 'american', label: 'American' },
    { id: 'turkish', label: 'Turkish' }
  ];

  const featureOptions = [
    { id: 'open-now', label: 'Open Now', icon: FaClock },
    { id: 'delivery', label: 'Delivery Available', icon: MdOutlineDeliveryDining },
    { id: 'takeout', label: 'Takeout Available', icon: MdOutlineDeliveryDining },
    { id: 'dine-in', label: 'Dine-in Available', icon: MdOutlineDeliveryDining }
  ];

  const certificationOptions = [
    { id: 'verified', label: 'Officially Certified', icon: FaCertificate },
    { id: 'community', label: 'Community Verified', icon: FaCertificate }
  ];

  return (
    <aside className={`sidebar ${toggleSidebar ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h1><FaFilter className="filter-icon-header" /> Filters</h1>
        <button className="close-btn" onClick={manageSidebar} aria-label="Close filters">
          <FaTimes />
        </button>
      </div>

      {/* only show the distance slider if the mode is either nearby or drag */}
      {searchMode === 'nearby' ? (

      <div className="filter-group">
        <h3 className="filter-title">
          <FaMapMarkerAlt className="filter-icon" /> Distance
        </h3>
        <div className="distance-slider-container">
          <input type="range" min="1" max="20" value={selectedFilters.distance} onChange={handleDistanceChange} className="distance-slider" aria-label="Distance in miles" />
          <div className="distance-value">
            <span>{selectedFilters.distance} miles</span>
          </div>
        </div>
      </div>
      ) : (
       null
      )
      }

      <div className="filter-group">
        <h3 className="filter-title">Certification</h3>
        <ul className="filter-list">
          {certificationOptions.map(cert => (
            <li key={cert.id} className="filter-item">
              <label className="filter-label">
                <input type="checkbox" className="filter-checkbox" checked={selectedFilters.certification.includes(cert.id)} onChange={() => handleCheckboxChange('certification', cert.id)} />
                <cert.icon className="filter-icon" />
                <span>{cert.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">Rating</h3>
        <ul className="filter-list">
          {[5, 4, 3].map((stars) => (
            <li key={stars} className="filter-item">
              <label className="filter-label">
                <input type="checkbox" className="filter-checkbox" checked={selectedFilters.rating === stars} onChange={() => handleCheckboxChange('rating', stars)} />
                <div className="stars-container">
                  {Array.from({ length: stars }).map((_, i) => <FaStar key={i} className="star-icon filled" />)}
                  {Array.from({ length: 5 - stars }).map((_, i) => <FaStar key={i} className="star-icon" />)}
                </div>
                <span className="rating-label">{stars}+ Stars</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">Price</h3>
        <div className="price-filter-row">
          {['$', '$$', '$$$'].map(price => (
            <button key={price} className={`price-button ${selectedFilters.price.includes(price) ? 'active' : ''}`} onClick={() => handleCheckboxChange('price', price)} aria-pressed={selectedFilters.price.includes(price)} aria-label={`Price level ${price}`}>{price}</button>
          ))}
        </div>
        <div className="price-labels-row">
          <span>Budget</span>
          <span>Moderate</span>
          <span>Premium</span>
        </div>
      </div>

      {/* <div className="filter-group">
        <h3 className="filter-title">Cuisine</h3>
        <ul className="filter-list">
          {cuisineOptions.map(cuisine => (
            <li key={cuisine.id} className="filter-item">
              <label className="filter-label">
                <input type="checkbox" className="filter-checkbox" checked={selectedFilters.cuisine.includes(cuisine.id)} onChange={() => handleCheckboxChange('cuisine', cuisine.id)} />
                <BiDish className="filter-icon" />
                <span>{cuisine.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div> */}

      <div className="filter-group">
        <h3 className="filter-title">Features</h3>
        <ul className="filter-list">
          {featureOptions.map(feature => (
            <li key={feature.id} className="filter-item">
              <label className="filter-label">
                <input type="checkbox" className="filter-checkbox" checked={selectedFilters.features.includes(feature.id)} onChange={() => handleCheckboxChange('features', feature.id)} />
                <feature.icon className="filter-icon" />
                <span>{feature.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-actions">
        <button className="btn btn-primary apply-filters" onClick={() => console.log('Apply clicked')}>Apply Filters</button>
        <button className="btn btn-secondary reset-filters" onClick={resetFilters}>Reset All</button>
      </div>
    </aside>
  );
}
