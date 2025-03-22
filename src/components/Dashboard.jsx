import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Dashboard.css';
import user_icon from "../assets/profile.svg";
import silt from "../assets/silt-soil-vector.png";
import ph_scale from "../assets/ph-scale.png";
import moisture from "../assets/moisture.png";
import temperature from "../assets/temperature.png";

import gis_data from "../geo_data.json";

const getNPKStatus = (value, type) => {
  if (type === "Nitrogen") {
    if (value >= 40) return "Good 🟢";
    if (value >= 20) return "Average 🟠";
    return "Bad 🔴";
  } else if (type === "Phosphorous") {
    if (value >= 25) return "Good 🟢";
    if (value >= 15) return "Average 🟠";
    return "Bad 🔴";
  } else if (type === "Potassium") {
    if (value >= 20) return "Good 🟢";
    if (value >= 10) return "Average 🟠";
    return "Bad 🔴";
  }
  return "Unknown";
};

export default function Dashboard() {
  const [data, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pid, setPid] = useState(""); // State to track the current plot ID
  const [plotIndex, setPlotIndex] = useState(-1); // State to track the current plot index

  // Default plot data when pid is ""
  const defaultPlot = {
    plot_id: "",
    gis_data: { type: "Point", coordinates: [0, 0] },
    soil_type: "---",
    weather: "---",
    npk_levels: { N: "---", P: "---", K: "---" },
    moisture: "---",
    temperature: "---",
    ph_value: "---",
    vegetation: { NDVI: "---", NDMI: "---" },
    ideal_crops: ["---"],
  };

  const plot = pid ? gis_data.find((plot) => plot.plot_id === pid) : defaultPlot;

  // Function to handle the "START" button click
  const handleStartClick = () => {
    const plotIds = gis_data.map((plot) => plot.plot_id).filter((id) => id !== ""); // Get all plot IDs except the default one
    const nextIndex = (plotIndex + 1) % plotIds.length; // Cycle through the plots
    setPid(plotIds[nextIndex]);
    setPlotIndex(nextIndex);
  };

  useEffect(() => {
    if (plot) {
      const graphFriendlyData = [
        {
          name: plot.plot_id,
          Potassium: plot.npk_levels.K,
          Phosphorous: plot.npk_levels.P,
          Nitrogen: plot.npk_levels.N,
        },
      ];
      setGraphData(graphFriendlyData);
    }
    setLoading(false);
  }, [plot]);

  return (
    <>
      <div className="user-profile">
        <p>Admin</p>
        <img src={user_icon} alt="User icon" />
      </div>

      <div className="gis">
        <button id="gis-btn"><i className="fa-solid fa-location-dot"></i></button>
        <input type="text" placeholder="GIS Goes here ..." />
        <button id="gis-start-btn" onClick={handleStartClick}>START</button>
      </div>

      <div className="gis-data gis">
        {/* Placeholder for the map */}
        {!pid ? (
          <div className="map-placeholder" style={{ width: "600px", height: "400px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px dashed #ccc", backgroundColor: "#f9f9f9" }}>
            <p style={{ color: "#666", fontStyle: "italic" }}>Map will load here</p>
          </div>
        ) : (
          <iframe
            width="600"
            height="400"
            src="https://www.arcgis.com/apps/Embed/index.html?webmap=c8ea84aa917b46c996e79cb1f5680055"
            frameBorder="0"
            scrolling="no"
            title="GIS Map"
          ></iframe>
        )}
        <div className="gis-details">
          <h3>GIS & Location Details</h3>
          <p>
            <strong>Plot ID:</strong> {plot.plot_id} <br />
            <strong>Location:</strong> BITS Pilani <br />
            <strong>Latitude:</strong> {plot.gis_data.coordinates[1]} <br />
            <strong>Longitude:</strong> {plot.gis_data.coordinates[0]} <br />
            <strong>NDVI:</strong> {plot.vegetation.NDVI} <br />
            <strong>NDMI:</strong> {plot.vegetation.NDMI} <br />
            {/* <strong>Elevation:</strong> {plot.elevation || "---"} m <br /> */}
            <strong>Remarks:</strong> {plot.remarks ? plot.remarks : "No additional remarks"} <br />
          </p>
        </div>
      </div>

      <div className="dashboard">
        <div className="f-card div1 soil-type">
          <p>SOIL TYPE</p>
          <img src={silt} alt="Soil Type" />
          <p className='card-value'>{plot.soil_type}</p>
        </div>
        <div className="f-card div2 ph-scale">
          <p>PH VALUE</p>
          <img src={ph_scale} alt="PH Scale" />
          <p className='card-value'>{plot.ph_value}</p>
        </div>
        <div className="f-card div3 moisture">
          <p>MOISTURE</p>
          <img src={moisture} alt="Moisture" />
          <p className='card-value'>{plot.moisture}</p>
        </div>
        <div className="f-card div4 temperature">
          <p>TEMPERATURE</p>
          <img src={temperature} alt="Temperature" />
          <p className='card-value'>{plot.temperature}</p>
        </div>
        <div className="t-card div5 npk-chart">
          <label className="npk">NPK Values of Soil</label>
          {loading ? (
            <p>Loading chart data...</p>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Phosphorous" fill="#8884d8" />
                <Bar dataKey="Potassium" fill="#82ca9d" />
                <Bar dataKey="Nitrogen" fill="#FF0000" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available for the chart.</p>
          )}
        </div>
        <div className="t-card div6">
          <h3>Details - NPK Values</h3>
          <div className="npk-details">
            <div className="npk-item">
              <h4>Nitrogen (N)</h4>
              <p>Value: {plot.npk_levels.N}</p>
              <p>Status: {getNPKStatus(plot.npk_levels.N, "Nitrogen")}</p>
              <p>
                {getNPKStatus(plot.npk_levels.N, "Nitrogen") === "Good"
                  ? "Nitrogen levels are optimal for plant growth."
                  : getNPKStatus(plot.npk_levels.N, "Nitrogen") === "Average"
                  ? "Nitrogen levels are moderate. Consider adding organic compost."
                  : "Nitrogen levels are low. Add nitrogen-rich fertilizers."}
              </p>
            </div>
            <div className="npk-item">
              <h4>Phosphorous (P)</h4>
              <p>Value: {plot.npk_levels.P}</p>
              <p>Status: {getNPKStatus(plot.npk_levels.P, "Phosphorous")}</p>
              <p>
                {getNPKStatus(plot.npk_levels.P, "Phosphorous") === "Good"
                  ? "Phosphorous levels are optimal for root development."
                  : getNPKStatus(plot.npk_levels.P, "Phosphorous") === "Average"
                  ? "Phosphorous levels are moderate. Consider adding bone meal."
                  : "Phosphorous levels are low. Add phosphorous-rich fertilizers."}
              </p>
            </div>
            <div className="npk-item">
              <h4>Potassium (K)</h4>
              <p>Value: {plot.npk_levels.K}</p>
              <p>Status: {getNPKStatus(plot.npk_levels.K, "Potassium")}</p>
              <p>
                {getNPKStatus(plot.npk_levels.K, "Potassium") === "Good"
                  ? "Potassium levels are optimal for overall plant health."
                  : getNPKStatus(plot.npk_levels.K, "Potassium") === "Average"
                  ? "Potassium levels are moderate. Consider adding wood ash."
                  : "Potassium levels are low. Add potassium-rich fertilizers."}
              </p>
            </div>
          </div>
        </div>
        <div className="o-card div7 vegitation-container">
          <div className="vegitation-text">
            <h3>Vegetation Details</h3>
            <p>
              {(() => {
                const soilType = plot.soil_type || "Unknown";
                let cropInfoStart = "Ideal crops: "
                let cropInfo = "";
                let instructions = "";

                const cropRecommendations = {
                  "Sandy Loam": "Best for Carrots, Tomatoes, Potatoes, Peanuts, Watermelon.",
                  "Clay": "Ideal for Rice, Wheat, Soybeans, and Cabbage.",
                  "Loamy": "Highly suitable for Maize, Barley, Sugarcane, and Vegetables.",
                  "Sandy": "Perfect for Cactus, Peanuts, and Root Vegetables.",
                  "Clay Loam": "Best for Corn, Sunflower, Pulses, and Legumes.",
                  "Silty Clay": "Suitable for Rice, Berries, and Leafy Greens.",
                  "Loamy Sand": "Supports Carrots, Melons, and Tomatoes.",
                  "Sandy Clay": "Great for Peppers, Tomatoes, and Beans.",
                };

                if (cropRecommendations[soilType]) {
                  
                  cropInfo = `${cropRecommendations[soilType]}`;
                } else {
                  cropInfo = "Crop information not available for this soil type.";
                }

                if (cropInfo.length < 80) {
                  instructions =
                    "Ensure proper irrigation and fertilization based on crop requirements.";
                }

                return (
                  <>
                    <b>{cropInfoStart}</b>
                    {cropInfo}
                    {instructions && <br />}
                    <i>{instructions}</i>
                  </>
                );
              })()}
            </p>
          </div>
        </div>

        <div className="t-card div8 fertilizer-prediction">
          <h3>Fertilizer Prediction</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Recusandae repellendus deleniti sit repellat nisi, quas, provident aliquam veniam deserunt earum,
            reiciendis eaque sequi magnam? Asperiores a tempore minima. Quasi, officiis.
          </p>
          <button>PREDICT</button>
        </div>
        <div className="t-card div9 fertilizer-details">
          <h3>Fertilizer Details</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </p>
        </div>
        <div className="t-card div10 disease-prediction">
          <h3>Disease Prediction</h3>
          <div className="input-container">
            <input type="file" accept="image/*" id="disease-image" />
            <label htmlFor="disease-image" className="upload-label">
              <i className="fa-solid fa-upload"></i> Upload Image
            </label>
          </div>
          <button className="predict-button">Predict</button>
          <div className="result-area">
            <h4>Result:</h4>
            <p>No result yet.</p>
          </div>
        </div>
        <div className="t-card div11 insect-classification">
          <h3>Insect Classification</h3>
          <div className="input-container">
            <input type="file" accept="image/*" id="insect-image" />
            <label htmlFor="insect-image" className="upload-label">
              <i className="fa-solid fa-upload"></i> Upload Image
            </label>
          </div>
          <button className="predict-button">Classify</button>
          <div className="result-area">
            <h4>Result:</h4>
            <p>No result yet.</p>
          </div>
        </div>
        <div className="t-card div12">
          <h3>Predicted Results</h3>
          <p>
            This is the content for the 12th div. It can include text, images, or any other elements.
          </p>
        </div>
        <div className="t-card div13">
          <h3>Suggestions & Feedbacks</h3>
          <p>
            This is the content for the 13th div. It can include text, images, or any other elements.
          </p>
        </div>
        <div className="o-card div7 prediction-container">
          <h3>Predictor:</h3>
          <input type="date" />
          <button>Enter</button>
          <textarea className="weather-prediction" readOnly></textarea>
          <textarea className="weather-suggestion" readOnly></textarea>
        </div>
        <div className="o-card div15 generate-report">
          <select name="report-type" id="">
            <option value="">Report type</option>
            <option value="Monthly">Monthly</option>
            <option value="Annual">Annual</option>
          </select>
          <button>Generate</button>
        </div>
      </div>
      <div className="footer">
        <p>Agro zapp @ 2025</p>
      </div>
    </>
  );
}