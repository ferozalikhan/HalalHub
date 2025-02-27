import Navbar from '../components/Navbar.jsx'
import MapComponent from '../components/MapComponent.jsx'
import '../styles/Home.css'
import '../App.css'


export default function Home() {
    return(
        <div className="home-page">
            <Navbar />
            {/* main element of the page */}
            <main className='main-container'>

                {/* sidebar */}
                <aside className='sidebar'>
                    {/* close button */}
                    <div className='sidebar-header'>
                        <h1>Filters</h1>
                        <button className='close-btn'>&times;</button>  
                    </div>

                    {/* filters */}
                    <div className='filter-group'>
                        <h2 className ="filter-title">Category</h2>
                        <ul>
                            <li><input type='checkbox' /> Halal Restaurants</li>
                            <li><input type='checkbox' /> Halal Food Trucks</li>
                            <li><input type='checkbox' /> Halal Grocery Stores</li>
                        </ul>
                    </div>
                    <div className='filter-group'>
                        <h2 className ="filter-title">Price</h2>
                        <ul>
                            <li><input type='checkbox' /> $</li>
                            <li><input type='checkbox' /> $$</li>
                            <li><input type='checkbox' /> $$$</li>
                        </ul>
                    </div>
                    <div className='filter-group'>
                        <h2 className ="filter-title" >Rating</h2>
                        <ul>
                            <li><input type='checkbox' /> 1 Star</li>
                            <li><input type='checkbox' /> 2 Stars</li>
                            <li><input type='checkbox' /> 3 Stars</li>
                            <li><input type='checkbox' /> 4 Stars</li>          
                            <li><input type='checkbox' /> 5 Stars</li>
                        </ul>
                    </div>
                </aside>

                {/* map */}
                <div className='body-container'>
                    
                        <MapComponent />

                </div>
                

            </main>
        </div>
    )
}