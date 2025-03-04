import React, {useState} from 'react';
import '../styles/SideBar.css';

export default function SideBar(
    {toggleSidebar, manageSidebar}

) {

    return(
        <>
        {/* sidebar */}
        <aside className={`sidebar ${toggleSidebar ? 'open' : 'closed'}`}>
        {/* close button */}
        <div className='sidebar-header'>
            <h1>Filters</h1>
            <button className='close-btn' onClick={manageSidebar}
            >&times;</button>  
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
        </>
    )
}