"use client";
// Import scheduling algorithms and bar chart features from local files.
import { useState } from "react";
import { Bar } from "react-chartjs-2"; // A bar for the chart. Next line imports the other chart features.
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { fifo, sjf, stcf, roundRobin } from "./utils/algorithms"; // The CPU scheduling algorithms.

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const [numProcesses, setNumProcesses] = useState(5);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [results, setResults] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("fifo");

  const generateProcesses = (n) => {
    return Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      arrivalTime: Math.floor(Math.random() * 10),
      burstTime: Math.floor(Math.random() * 10) + 1,
    }));
  };

  const runAlgorithm = () => {
    const processes = generateProcesses(numProcesses);
    let computedResults = [];

    try {
      if (selectedAlgorithm === "fifo") {
        computedResults = fifo(processes);
      } else if (selectedAlgorithm === "sjf") {
        computedResults = sjf(processes);
      } else if (selectedAlgorithm === "stcf") {
        computedResults = stcf(processes);
      } else if (selectedAlgorithm === "rr") {
        computedResults = roundRobin(processes, timeQuantum);
      }
    } catch (error) {
      alert(error.message);
      return;
    }

    setResults(computedResults);
  };

  const chartData = {
    labels: results.map((p) => `P${p.id}`),
    datasets: [
      {
        label: "Completion Time",
        data: results.map((p) => p.finishTime),
        backgroundColor: "blue",
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold">CPU Scheduling Simulator</h1>

      {/* User Input Form */}
      <div className="flex flex-col gap-4 mt-4">
        <label>
          Number of Processes:
          <input
            type="number"
            value={numProcesses}
            onChange={(e) => setNumProcesses(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </label>

        <label>
          Time Quantum (RR only):
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </label>

        <label>
          Select Algorithm:
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="fifo">FIFO</option>
            <option value="sjf">SJF</option>
            <option value="stcf">STCF</option>
            <option value="rr">Round Robin</option>
          </select>
        </label>

        <button
          onClick={runAlgorithm}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Run Algorithm
        </button>
      </div>

      {/* Chart Display */}
      <div className="w-96 h-64 mt-8">
        {results.length > 0 && <Bar data={chartData} />}
      </div>
    </div>
  );
}