import React from 'react';
import './global.css';

export default function Page() {
  return (
    <div className="wrapper">
      <div className="left-panel">
        <header>
          <h1>InstaGen AI</h1>
          <h2>Instant, smart, and available, AI-generated usernames for your Instagram brand</h2>
        </header>
        <div className="input1">
          <label htmlFor="input1">Step 1: What is your account about?</label>
          <input id="input1" type="text" placeholder="Enter Your Niche:" />
          <button type="submit" className="submit-button">
            <span className="gradient-text">Submit</span>
          </button>
        </div>
      </div>
      <div className="right-panel">
        <label>Step 2: Choose your favorite</label>
        <div className='step2container'>
          <div className="username-card">@travelgram_vibes</div>
           <div className="username-card">@fitflow_daily</div>
            <div className="username-card">@aesthetic.reels</div>
        </div>
      </div>
    </div>
  );
}
