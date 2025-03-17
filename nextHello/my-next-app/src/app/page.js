"use client";
// Import scheduling algorithms and bar chart features from local files.
import { useState } from "react";
import { Bar } from "react-chartjs-2"; // A bar for the chart. Next line imports the other chart features.
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { fifo, sjf, stcf, roundRobin, mlfq } from "./utils/algorithms"; // The CPU scheduling algorithms.
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const [numProcesses, setNumProcesses] = useState(5);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [mlfqQueues, setMlfqQueues] = useState([2, 4, 8]);
  const [results, setResults] = useState({});
  const [selectedAlgorithms, setSelectedAlgorithms] = useState({
    fifo: true,
    sjf: true,
    stcf: true,
    rr: true,
    mlfq: true,
  });

  const generateProcesses = (n) => {
    return Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      arrivalTime: Math.floor(Math.random() * 10),
      burstTime: Math.floor(Math.random() * 10) + 1, // Ensure burst time is always greater than zero
    }));
  };

  const runAlgorithms = () => {
    const processes = generateProcesses(numProcesses);
    let computedResults = {};

    try {
      if (selectedAlgorithms.fifo) {
        computedResults.fifo = fifo(JSON.parse(JSON.stringify(processes)));
      }
      if (selectedAlgorithms.sjf) {
        computedResults.sjf = sjf(JSON.parse(JSON.stringify(processes)));
      }
      if (selectedAlgorithms.stcf) {
        computedResults.stcf = stcf(JSON.parse(JSON.stringify(processes)));
      }
      if (selectedAlgorithms.rr) {
        computedResults.rr = roundRobin(JSON.parse(JSON.stringify(processes)), timeQuantum);
      }
      if (selectedAlgorithms.mlfq) {
        computedResults.mlfq = mlfq(JSON.parse(JSON.stringify(processes)), mlfqQueues);
      }
    } catch (error) {
      alert(error.message);
      return;
    }

    setResults(computedResults);
  };

  const chartData = (algorithm) => ({
    labels: results[algorithm]?.map((p) => `P${p.id}`) || [],
    datasets: [
      {
        label: "Completion Time",
        data: results[algorithm]?.map((p) => p.finishTime) || [],
        backgroundColor: "blue",
      },
    ],
  });

  const downloadPDF = () => {
    const input = document.getElementById("results");
  
    // Ensure all content is rendered by setting minHeight temporarily
    const originalHeight = input.style.height;
    input.style.height = "auto"; // Let it expand fully
  
    html2canvas(input, {
      scale: 2, // High-quality rendering
      useCORS: true, // Fix for external content
      windowWidth: document.documentElement.scrollWidth, // Capture full width
      windowHeight: document.documentElement.scrollHeight, // Capture full height
    }).then((canvas) => {
      input.style.height = originalHeight; // Restore original height after capture
  
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Keep aspect ratio
  
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
  
      let y = 10; // Start position in PDF
      let currentHeight = imgHeight;
      let totalPages = Math.ceil(currentHeight / pageHeight);
  
      for (let i = 0; i < totalPages; i++) {
        let cropHeight = Math.min(currentHeight, pageHeight);
        let croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = canvas.width;
        croppedCanvas.height = (cropHeight * canvas.width) / imgWidth;
        let croppedCtx = croppedCanvas.getContext("2d");
  
        croppedCtx.drawImage(
          canvas,
          0,
          i * (pageHeight * canvas.width) / imgWidth,
          canvas.width,
          (pageHeight * canvas.width) / imgWidth,
          0,
          0,
          canvas.width,
          (pageHeight * canvas.width) / imgWidth
        );
  
        let croppedImgData = croppedCanvas.toDataURL("image/png");
        pdf.addImage(croppedImgData, "PNG", 0, y, imgWidth, cropHeight);
  
        if (i < totalPages - 1) {
          pdf.addPage();
        }
      }
  
      pdf.save("results.pdf");
    });
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
          MLFQ Queues (comma-separated):
          <input
            type="text"
            value={mlfqQueues.join(",")}
            onChange={(e) => setMlfqQueues(e.target.value.split(",").map(Number))}
            className="border rounded px-2 py-1"
          />
        </label>

        <label>
          Select Algorithms:
          <div className="flex flex-col">
            {Object.keys(selectedAlgorithms).map((algorithm) => (
              <label key={algorithm}>
                <input
                  type="checkbox"
                  checked={selectedAlgorithms[algorithm]}
                  onChange={(e) =>
                    setSelectedAlgorithms({
                      ...selectedAlgorithms,
                      [algorithm]: e.target.checked,
                    })
                  }
                />
                {algorithm.toUpperCase()}
              </label>
            ))}
          </div>
        </label>

        <button
          onClick={runAlgorithms}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Run Algorithms
        </button>
        <button
          onClick={downloadPDF}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          Download Results as PDF
        </button>
      </div>

      {/* Chart Display */}
      <div id="results" className="flex flex-wrap gap-8 mt-8">
        {Object.keys(results).map((algorithm) => (
          <div key={algorithm} className="w-96 h-64">
            <h2 className="text-xl font-bold">{algorithm.toUpperCase()}</h2>
            <Bar data={chartData(algorithm)} />
          </div>
        ))}
      </div>
    </div>
  );
}