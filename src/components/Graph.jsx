import React from "react";
import { Line } from "react-chartjs-2";

const Graph = ({ title, data }) => {
  const chartData = {
    labels: data.map((entry) => entry.time), // Adjusted time on x-axis
    datasets: [
      {
        label: title,
        data: data.map((entry) => parseFloat(entry.value) || 0),
        borderColor: "#00ffff",
        backgroundColor: "rgba(0, 255, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: title } },
    },
  };

  return (
    <div className="graph">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Graph;
