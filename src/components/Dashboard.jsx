import React, { useState, useEffect } from "react";
import axios from "axios";
import Graph from "./Graph";
import "./Dashboard.css"; // Include CSS for responsive layout

const Dashboard = () => {
  const [data, setData] = useState([]);
  const fields = ["PM2.5", "PM10", "Ozone", "Humidity", "Temperature", "CO"];

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.thingspeak.com/channels/1596152/feeds.json?results=10"
      );
      const feeds = response.data.feeds.slice(-10);
      setData(feeds);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      {fields.map((field, index) => (
        <Graph
          key={index}
          title={field}
          data={data.map((entry) => ({
            time: new Date(entry.created_at).toLocaleTimeString(),
            value: entry[`field${index + 1}`],
          }))}
        />
      ))}
    </div>
  );
};

export default Dashboard;
