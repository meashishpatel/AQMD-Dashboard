import React, { useState, useEffect } from "react";
import axios from "axios";
import Graph from "./Graph";
import "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const fields = ["PM2.5", "PM10", "Ozone", "Humidity", "Temperature", "CO"];
  const [reloadTime, setReloadTime] = useState(new Date());

  // Generate time slots for the last 10 hours with current time
  const generateTimeSlots = () => {
    const currentTime = new Date();
    const startMinutes = currentTime.getMinutes(); // Capture current minutes
    return Array.from({ length: 10 }, (_, i) => {
      const time = new Date(currentTime);
      time.setHours(time.getHours() - i, startMinutes, 0, 0);
      return time;
    }).reverse();
  };

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.thingspeak.com/channels/1596152/feeds.json?results=50"
      );
      const feeds = response.data.feeds;

      // Align API data with time slots
      const mappedData = timeSlots.map((slot) => {
        const matchingEntry = feeds.find((entry) => {
          const entryTime = new Date(entry.created_at);
          return (
            entryTime.getHours() === slot.getHours() &&
            entryTime.getDate() === slot.getDate() &&
            entryTime.getMonth() === slot.getMonth() &&
            entryTime.getFullYear() === slot.getFullYear()
          );
        });

        return {
          time: slot,
          fields: fields.map((_, index) =>
            matchingEntry ? matchingEntry[`field${index + 1}`] : null
          ),
        };
      });

      setData(mappedData);

      // Schedule reload time
      const nextReloadTime = new Date();
      nextReloadTime.setMinutes(reloadTime.getMinutes() + 60); // 1-hour interval
      setReloadTime(nextReloadTime);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setTimeSlots(generateTimeSlots());
      fetchData();
    }, 3600000); // Reload every hour
    return () => clearInterval(interval);
  }, [reloadTime]);

  return (
    <div className="dashboard">
      {fields.map((field, index) => (
        <div key={index} className="graph-box">
          <Graph
            title={field}
            data={data.map((entry) => ({
              time: entry.time.toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              value: entry.fields[index] || 0, // Use 0 if no matching data
            }))}
          />
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
