import React from "react";
import {APIProvider, Map} from '@vis.gl/react-google-maps';


const MapComponent = () => {
    return (

        <div className="map-container">
            <h1>
                Map Component
            </h1>

            <div className="map">

                <APIProvider apiKey='AIzaSyBEyiDRWXJg0LHRi7N5VSQ3k3N5z_lvJkw'>
                <Map
            style={{width: '1300px', height: '50vh'}}
            defaultCenter={{lat: 22.54992, lng: 0}}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}

                />
                </APIProvider>
            </div>


        </div>
       
    );
};

export default React.memo(MapComponent);
