import React from "react";

const WeatherBox = () => {
  return (
    <>
      <style>{`
        .weather-card {
          width: 320px;
          background: linear-gradient(180deg, #1f2a30 0%, #161f24 100%);
          border-radius: 14px;
          padding: 16px;
          color: #ffffff;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          box-shadow: 0 8px 20px rgba(0,0,0,0.35);
        }

        .weather-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .location {
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .today {
          font-size: 13px;
          color: #cfd8dc;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .toggle {
          width: 32px;
          height: 18px;
          background: #2e3b42;
          border-radius: 20px;
          position: relative;
        }

        .toggle::after {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          background: #ffffff;
          border-radius: 50%;
          top: 2px;
          right: 2px;
        }

        .weather-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .temp {
          font-size: 42px;
          font-weight: 700;
        }

        .condition {
          font-size: 14px;
          letter-spacing: 0.5px;
          color: #e0e0e0;
        }

        .aqi-section {
          margin-top: 8px;
        }

        .aqi-label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .aqi-bar {
          position: relative;
          height: 8px;
          border-radius: 6px;
          background: linear-gradient(
            to right,
            #9acd32 0%,
            #cddc39 20%,
            #ffeb3b 40%,
            #ff9800 60%,
            #f44336 80%,
            #b71c1c 100%
          );
        }

        .aqi-marker {
          position: absolute;
          top: -6px;
          left: 21%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .aqi-dot {
          width: 8px;
          height: 8px;
          background: #00e5ff;
          border-radius: 50%;
        }

        .aqi-value {
          margin-top: 4px;
          font-size: 12px;
        }

        .aqi-scale {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #b0bec5;
          margin-top: 6px;
        }

        .aqi-footer {
          margin-top: 10px;
          font-size: 13px;
          color: #d0f0ff;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #ffeb3b;
          border-radius: 50%;
        }
      `}</style>

      <div className="weather-card">
        {/* Header */}
        <div className="weather-header">
          <div className="location">
            சென்னை <span>▾</span>
          </div>
          <div className="today">
            Today’s Weather
            <div className="toggle" />
          </div>
        </div>

        {/* Main */}
        <div className="weather-main">
          <div>
            <div className="temp">29°C</div>
            <div className="condition">PARTLY CLOUDY</div>
          </div>
          <div>
            {/* Weather Icon */}
            <svg width="48" height="48" fill="none" stroke="#cfd8dc" strokeWidth="2">
              <path d="M32 18a10 10 0 1 0-19 4" />
              <path d="M10 26h22a6 6 0 0 0 0-12 9 9 0 0 0-18 2" />
              <line x1="32" y1="6" x2="32" y2="12" />
              <line x1="42" y1="16" x2="36" y2="16" />
            </svg>
          </div>
        </div>

        {/* AQI */}
        <div className="aqi-section">
          <div className="aqi-label">106 AQI</div>

          <div className="aqi-bar">
            <div className="aqi-marker">
              <div className="aqi-dot" />
              <div className="aqi-value">106</div>
            </div>
          </div>

          <div className="aqi-scale">
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>400</span>
            <span>500</span>
          </div>

          <div className="aqi-footer">
            <div className="dot" />
            106 AQI - Moderate
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherBox;
