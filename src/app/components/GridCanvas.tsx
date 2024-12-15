// src/components/GridCanvas.tsx
import React, { useState, useRef, useEffect } from "react";
import RunButton from "./Button";
import ControlSidebar from "./ControlSidebar";
import { aStar, aStarSolution, dijkstra, dijkstraSolution } from "./Data";

const GridCanvas: React.FC = () => {
  const [grids, setGrids] = useState<string[][][]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(30); // slides per second
  const [cellSize, setCellSize] = useState<number>(20); // New state for cell size
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentAlgo, setAlgo] = useState<"dijkstra" | "aStar">("dijkstra");

  // Handle grid input changes
  const handleInputChange = (textGrid: string, algo: "dijkstra" | "aStar") => {
    setAlgo(algo);
    const newGrids = convertGridsStringToArray(textGrid);
    setGrids(newGrids);
    setCurrentIndex(0); // Reset to first grid
    setIsPlaying(false); // Stop any ongoing animation
  };

  // Convert grid string to array
  const convertGridsStringToArray = (gridsString: string) => {
    const gridStrings = gridsString.trim().split("\n\n");

    return gridStrings.map((gridString) => {
      const rows = gridString.split("\n");
      return rows.map((row) => row.trim().split(/\s+/));
    });
  };

  // Enhanced Draw the current grid on the canvas
  const drawGrid = (grid: string[][], canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on grid size and cell size
    canvas.width = grid[0].length * cellSize;
    canvas.height = grid.length * cellSize;

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply a subtle background color
    ctx.fillStyle = "#f0f4f8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        let fillColor = "#ffffff"; // Default empty cell color

        switch (cell) {
          case "P":
            fillColor = "#4caf50"; // Start/Path color (Green)
            break;
          case "#":
            fillColor = "#37474f"; // Obstacle color (Dark Gray)
            break;
          case "E":
            fillColor = "#ff5722"; // End color or special cells (Orange)
            break;
          case "PATH":
            fillColor = "#2196f3"; // Path color (Blue)
            break;
          default:
            fillColor = "#ffffff"; // Empty cell
        }

        // Draw cell background
        ctx.fillStyle = fillColor;
        ctx.fillRect(
          colIndex * cellSize,
          rowIndex * cellSize,
          cellSize,
          cellSize
        );

        // Add subtle grid lines
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          colIndex * cellSize,
          rowIndex * cellSize,
          cellSize,
          cellSize
        );
      });
    });

    // Highlight the boundary if applicable
    ctx.strokeStyle = "#000000"; // Boundary color (Black)
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // If it's the last slide, indicate it
    if (currentIndex === grids.length - 1) {
      const overlayHeight = 50;
      ctx.fillStyle = "rgba(33, 150, 243, 0.8)"; // Semi-transparent blue
      ctx.fillRect(
        0,
        canvas.height - overlayHeight,
        canvas.width,
        overlayHeight
      );

      ctx.fillStyle = "#ffffff";
      ctx.font = `${cellSize}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(
        "Path Found!",
        canvas.width / 2,
        canvas.height - overlayHeight / 2 + cellSize / 4
      );
    }
  };

  // Draw the current grid whenever grids, currentIndex, or cellSize change
  useEffect(() => {
    if (grids.length === 0) return;
    const canvas = canvasRef.current;
    if (canvas) {
      drawGrid(grids[currentIndex], canvas);
    }
  }, [grids, currentIndex, cellSize]);

  // Handle animation
  useEffect(() => {
    if (!isPlaying) return;

    if (currentIndex >= grids.length - 1) {
      setIsPlaying(false);
      return;
    }

    const interval = 1000 / speed; // milliseconds per slide
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, interval);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, speed, grids.length]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (grids.length === 0) return;
    setIsPlaying((prev) => !prev);
  };

  // Handle speed change
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  // New handler for cell size change
  const handleCellSizeChange = (newSize: number) => {
    if (newSize < 10) newSize = 10;
    if (newSize > 100) newSize = 100;
    setCellSize(newSize);
  };

  const showFinalPath = () => {
    if (currentAlgo == "dijkstra")
      handleInputChange(dijkstraSolution, "dijkstra");
    if (currentAlgo == "aStar") handleInputChange(aStarSolution, "aStar");
  };

  const isLastSlide = currentIndex === grids.length - 1 && grids.length > 0;

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col items-center space-y-4 p-4">
        <div className="flex flex-row space-x-4">
          <RunButton onClick={() => handleInputChange(dijkstra, "dijkstra")}>
            {"Dijkstra's"}
          </RunButton>
          <RunButton onClick={() => handleInputChange(aStar, "aStar")}>
            {"A* Algorithm"}
          </RunButton>
        </div>
        <p className="text-white text-2xl font-semibold underline">
          {currentAlgo == "aStar" ? "A* Algorithm" : "Dijkstra's Algorithm"}
        </p>
        <canvas ref={canvasRef} className="shadow-lg rounded-lg" />
      </div>
      <ControlSidebar
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        isLastSlide={isLastSlide}
        cellSize={cellSize} // Pass cellSize as a prop
        onCellSizeChange={handleCellSizeChange} // Pass handler as a prop
        algorithm={currentAlgo}
        showFinalPath={showFinalPath}
      />
    </div>
  );
};

export default GridCanvas;
