"use client";

import React, { useState } from 'react';
import './global.css';

export default function Page() {
  const [niche, setNiche] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateAI = async () => {
    if (!niche.trim()) return;
    setLoading(true);

    console.log("🟢 Submitting AI generation with niche:", niche);

    try {
      const response = await fetch('http://localhost:5000/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche })
      });

      const data = await response.json();
      console.log("🟣 Response from AI:", data);

      setUsernames(data.usernames || []);
    } catch (err) {
      console.error("🔴 Error while fetching from AI:", err.message);
    }

    setLoading(false);
  };

  const [copiedIndex, setCopiedIndex] = useState(null);
  const handleCopy = (username, index) => {
    const cleanName = username.replace('@', '').toLowerCase();
    navigator.clipboard.writeText(cleanName);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };
  
  

  return (
    <div className="wrapper">
      <div className="left-panel">
        <header>
          <h1>InstaGen AI</h1>
          <h2>Get creative, available Instagram usernames tailored by AI</h2>
        </header>
        <div className="input1">
          <label htmlFor="input1">What is your page about? Try being Specific</label>
          <input
            id="input1"
            type="text"
            placeholder="e.g. creating art with chalk"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
          />
          <button type="submit" className="submit-button" onClick={handleGenerateAI}>
            <span className="gradient-text">Generate</span>
          </button>
        </div>
      </div>

      <div className="right-panel">
        <label>Available Usernames</label>
        <div className="step2container">
          {loading && <p>Loading...</p>}

          {!loading && usernames.length === 0 && <p>No usernames yet. Try something!</p>}
          {!loading && usernames.map((name, index) => (
  <div key={index} className="username-card">
    <span>{name}</span>
    <button
      className="copy-button"
      onClick={() => handleCopy(name, index)}
    >
      {copiedIndex === index ? '✅' : '📋'}
    </button>
  </div>
))}

        </div>
      </div>
    </div>
  );
}
