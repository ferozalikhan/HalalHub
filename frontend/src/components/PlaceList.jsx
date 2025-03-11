import { FaStar } from "react-icons/fa";
import "../styles/PlaceList.css";

export default function PlaceList() {
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