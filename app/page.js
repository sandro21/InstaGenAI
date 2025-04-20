"use client";


import React, { useState } from 'react';
import './global.css';


export default function Page() {
  const [niche, setNiche] = useState('');
  const [usernames, setUsernames] = useState([]);

  const handleSubmit = async () => {
    if (!niche.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche })
      });

      const data = await response.json();
      setUsernames(data.usernames || []);
    } catch (err) {
      console.error('Error fetching usernames:', err);
    }
  };

  return (
    <div className="wrapper">
      <div className="left-panel">
        <header>
          <h1>InstaGen AI</h1>
          <h2>Instant, smart, and available, AI-generated usernames for your Instagram brand</h2>
        </header>
        <div className="input1">
          <label htmlFor="input1">Step 1: What is your account about?</label>
          <input
            id="input1"
            type="text"
            placeholder="Enter Your Niche:"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
          />
          <button type="submit" className="submit-button" onClick={handleSubmit}>
            <span className="gradient-text">Submit</span>
          </button>
        </div>
      </div>

      <div className="right-panel">
        <label>Step 2: Choose your favorite</label>
        <div className="step2container">
          {usernames.map((name, index) => (
            <div key={index} className="username-card">{name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
