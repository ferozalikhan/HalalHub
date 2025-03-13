import { useState } from 'react'
import Home from './pages/Home'
import { APIProvider } from '@vis.gl/react-google-maps'
import './App.css'

function App() {


  return (
  
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Home />
      </APIProvider>


  )
}

export default App
