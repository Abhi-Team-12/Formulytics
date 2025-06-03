import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ChartErrorBoundary from "../components/ChartErrorBoundary";
import {
  FaThLarge,
  FaUpload,
  FaChartBar,
  FaHistory,
  FaDownload,
  FaBrain,
  FaCog,
} from "react-icons/fa";
import SidebarButton from "../components/SidebarButton";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Bar3D from "../components/Bar3D";
import Scatter3D from "../components/Scatter3D";
import Pie3D from "../components/Pie3D"; // We'll create these components\
import User from "../components/User";

// For downloading charts as PDF
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// For 3D charts, we need to use the react-three-fiber library
import { useRef } from "react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A4DE6C",
  "#D0ED57",
];
const MAX_DATA_POINTS = 500;
const CHART_TYPES = [
  { value: "Bar", label: "2D Bar" },
  { value: "Pie", label: "2D Pie" },
  { value: "Line", label: "2D Line" },
  { value: "Area", label: "2D Area" },
  { value: "Bar3D", label: "3D Bar" },  
  { value: "3D pie", label: "3D pie" },
];

export default function AnalyzeData() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState(""); // For 3D charts
  const [chartType, setChartType] = useState("Bar");
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [samplingEnabled, setSamplingEnabled] = useState(true);

  // Function to handle downloading the chart as a PDF
  const handleDownloadChart = async () => {
    const chartContainer = document.getElementById("chart-container");
    if (!chartContainer) return alert("Chart not available to download");

    try {
      const canvas = await html2canvas(chartContainer);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`chart-${chartType}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to download chart.");
    }
  };

  // Ref for the 3D canvas
  const canvasRef = useRef();
  // Ref for the WebGL canvas to capture 3D images
  const glCanvasRef = useRef();

  // Function to handle downloading the 3D chart as an image
  const handleDownload3DChart = () => {
    if (!glCanvasRef.current) return alert("3D canvas not available");

    try {
      const image = glCanvasRef.current.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `3d-chart-${chartType}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Error downloading 3D chart:", err);
      alert("Failed to download 3D chart image.");
    }
  };

  // Check if user is logged in
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const chartData = useMemo(() => {
    if (!rawData.length) return [];

    let processed = rawData.filter((item) => {
      const y = parseFloat(item[yAxis]);
      return !isNaN(y) && y !== null;
    });

    if (samplingEnabled && processed.length > MAX_DATA_POINTS) {
      const step = Math.ceil(processed.length / MAX_DATA_POINTS);
      processed = processed.filter((_, index) => index % step === 0);
    }

    return processed;
  }, [rawData, yAxis, samplingEnabled]);

  // Fetch available files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/upload/files", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch files");
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Unable to load files");
      }
    };

    if (token) fetchFiles();
  }, [token]);

  // Load data/columns when a file is selected
  useEffect(() => {
    if (!selectedFile || !token) return;

    const selected = files.find((f) => f._id === selectedFile);
    if (!selected) return;

    setIsLoading(true);
    fetch(`http://localhost:5000/api/upload/data/${selectedFile}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        const data = res.data || [];
        setRawData(data);
        setColumns(data.length ? Object.keys(data[0]) : []);
      })
      .catch((err) => {
        console.error("Error fetching file data:", err);
        setError("Could not load file data");
      })
      .finally(() => setIsLoading(false));
  }, [selectedFile, token, files]);

  const render3DBarChart = () => {
    if (!xAxis || !yAxis || !chartData.length) return null;

    const dataFor3D = chartData.map((item) => ({
      x: item[xAxis],
      y: parseFloat(item[yAxis]),
      z: zAxis ? parseFloat(item[zAxis]) || 1 : 1, // Default height if no z-axis
    }));

    return (
      <div className="w-full h-[500px]">
        <Canvas
          ref={canvasRef}
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [0, 7, 10], fov: 50 }}
          onCreated={({ gl }) => {
            glCanvasRef.current = gl.domElement;
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Bar3D data={dataFor3D} />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
          />
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
    );
  };

  const render3DScatterPlot = () => {
  if (!xAxis || !yAxis || !chartData.length) return null;

  // Validate and parse data
  const dataFor3D = chartData
    .map((item, index) => {
      const xVal = parseFloat(item[xAxis]);
      const yVal = parseFloat(item[yAxis]);
      const zVal = zAxis ? parseFloat(item[zAxis]) : 0;

      if (isNaN(xVal) || isNaN(yVal) || isNaN(zVal)) return null;

      return {
        x: xVal,
        y: yVal,
        z: zVal,
        size: 0.25,
        color: COLORS[index % COLORS.length],
      };
    })
    .filter(Boolean); // remove nulls

  if (!dataFor3D.length) {
    return <p className="text-red-500">No valid data points for 3D Scatter Plot.</p>;
  }

  return (
    <div className="w-full h-[500px]">
      <Canvas
        ref={canvasRef}
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 7, 10], fov: 50 }}
        onCreated={({ gl }) => {
          glCanvasRef.current = gl.domElement;
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scatter3D data={dataFor3D} />
        <OrbitControls enableZoom enablePan enableRotate />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
};
  const render3DPieChart = () => {
    if (!yAxis || !chartData.length) return null;

    // Prepare data for Pie3D: x is label/category, y is value
    const dataForPie = chartData.map((item) => ({
      x: item[xAxis], // label/category (optional, Pie3D currently only uses y and index for colors)
      y: parseFloat(item[yAxis]),
    }));

    return (
      <div className="w-full h-[500px]">
        <Canvas
          ref={canvasRef}
          gl={{ preserveDrawingBuffer: true }} // This is crucial for screenshot capture!
          camera={{ position: [0, 7, 10], fov: 50 }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Pie3D data={dataForPie} />
          <OrbitControls enableZoom enablePan enableRotate />
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
    );
  };

  const renderChart = () => {
    if (!xAxis || !yAxis || !chartData.length)
      return <p>Select file and axes to display chart.</p>;

    switch (chartType) {
      case "Bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case "Line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yAxis} stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "Area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={xAxis} />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={yAxis}
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorY)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "Pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={120}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "Bar3D":
        return render3DBarChart();
      
      case "3D pie":
        return render3DPieChart();
      default:
        return <p>Chart type not supported (yet).</p>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <User />
      {/* Main */}
      <div className="flex-1 p-4 md:p-8 overflow-auto space-y-4 md:space-y-6">
        <motion.h2 className="text-2xl md:text-3xl font-bold text-green-800">
          Data Analysis
        </motion.h2>
        
        <motion.div
          className="bg-white rounded-xl shadow p-4 md:p-6 space-y-3 md:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg md:text-xl font-semibold text-green-700">
            Configure Your Chart
          </h3>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {/* File Selector */}
            <div>
              <label className="block text-sm mb-1">Select File:</label>
              <select
                className="w-full border px-3 py-2 rounded text-sm md:text-base"
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                disabled={isLoading}
              >
                <option value="">-- Select File --</option>
                {files.map((file) => (
                  <option key={file._id} value={file._id}>
                    {file.fileName}
                  </option>
                ))}
              </select>
            </div>
            
            {/* X Axis */}
            <div>
              <label className="block text-sm mb-1">X Axis:</label>
              <select
                className="w-full border px-3 py-2 rounded text-sm md:text-base"
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                disabled={!selectedFile}
              >
                <option value="">-- Choose --</option>
                {columns.map((col, i) => (
                  <option key={i} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Y Axis */}
            <div>
              <label className="block text-sm mb-1">Y Axis:</label>
              <select
                className="w-full border px-3 py-2 rounded text-sm md:text-base"
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                disabled={!selectedFile}
              >
                <option value="">-- Choose --</option>
                {columns.map((col, i) => (
                  <option key={i} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Z Axis for 3D charts */}
          {(chartType === "Bar3D" || chartType === "Scatter3D") && (
            <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-3 md:gap-4 md:mt-4">
              <div>
                <label className="block text-sm mb-1">
                  Z Axis (Height/Depth):
                </label>
                <select
                  className="w-full border px-3 py-2 rounded text-sm md:text-base"
                  value={zAxis}
                  onChange={(e) => setZAxis(e.target.value)}
                  disabled={!selectedFile}
                >
                  <option value="">-- Optional --</option>
                  {columns.map((col, i) => (
                    <option key={i} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-2 md:gap-4 md:mt-4">
            {/* Chart Type */}
            <div>
              <label className="block text-sm mb-1">Chart Type:</label>
              <select
                className="w-full border px-3 py-2 rounded text-sm md:text-base"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                {CHART_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sampling Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sampling"
                checked={samplingEnabled}
                onChange={() => setSamplingEnabled(!samplingEnabled)}
                className="mr-2"
                disabled={rawData.length <= MAX_DATA_POINTS}
              />
              <label htmlFor="sampling" className="text-xs md:text-sm">
                Enable data sampling for large datasets
              </label>
            </div>
          </div>

          {rawData.length > MAX_DATA_POINTS && (
            <p className="text-xs md:text-sm text-gray-600 mt-2">
              Dataset contains {rawData.length} rows.{" "}
              {samplingEnabled
                ? `Displaying sampled ${chartData.length} points.`
                : "Showing all data (may impact performance)."}
            </p>
          )}
        </motion.div>

        {/* Chart Container */}
        <div 
          id="chart-container" 
          className="bg-white rounded-xl shadow p-4 md:p-6"
          style={{
            height: window.innerWidth < 768 ? '300px' : '400px',
            overflow: 'hidden'
          }}
        >
          <ChartErrorBoundary>
            {window.innerWidth < 768 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-center text-sm">
                  For best experience, view charts on a larger screen or rotate your device.
                </p>
              </div>
            ) : (
              renderChart()
            )}
          </ChartErrorBoundary>
        </div>

        {/* Download Buttons */}
        <div className="flex justify-center">
          {["Bar3D", "Scatter3D", "3D pie"].includes(chartType) ? (
            <button
              onClick={handleDownload3DChart}
              className="bg-green-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-green-700 text-sm md:text-base"
            >
              Download 3D Chart
            </button>
          ) : (
            <button
              onClick={handleDownloadChart}
              className="bg-green-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-green-700 text-sm md:text-base"
            >
              Download Chart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}