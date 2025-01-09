// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/home'
import About from './pages/about';
import Token from './pages/token';
import './App.css'; // Import the CSS file
import { Buffer } from 'buffer';

// Polyfill Buffer for browser
if (!window.Buffer) {
    window.Buffer = Buffer;
}

function App() {
  return (
    <Router>
      {/* Header Section */}
      <header className="header">
        <h1>TweetTone</h1>
        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/token" className="nav-link">
            CreateToken
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/token" element={<Token />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;