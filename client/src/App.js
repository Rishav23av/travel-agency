import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import PackageDetails from './pages/PackageDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddPackage from './pages/AddPackage';
import FlightSearch from './pages/FlightSearch';
import FlightTracker from './pages/FlightTracker';
import TravelSearch from './pages/TravelSearch';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/package/:id" element={<PackageDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-package" element={<AddPackage />} />
            <Route path="/flights" element={<FlightSearch />} />
            <Route path="/track-flight" element={<FlightTracker />} />
            <Route path="/travel-search" element={<TravelSearch />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
