// src/components/GridCanvas.tsx
import React, { useState, useRef, useEffect } from "react";
import RunButton from "./Button";
import ControlSidebar from "./ControlSidebar";

const GridCanvas: React.FC = () => {
  const [grids, setGrids] = useState<string[][][]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(60000);
  const [cellSize, setCellSize] = useState<number>(8.5);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentAlgo, setAlgo] = useState<"dijkstra" | "aStar">("dijkstra");

  const [solutionPath, setSolutionPath] = useState<number[][]>([]);
  const [solutionText, setSolutionText] = useState<string>("");

  const fetchData = async (algo: "dijkstra" | "aStar") => {
    try {
      const logsResponse = await fetch(`/data/${algo}.json`);
      const logsData: string[] = await logsResponse.json();
      const parsedGrids: string[][][] = logsData.map((gridString) =>
        gridString.split("\n").map((row) => row.trim().split(" "))
      );
      setGrids(parsedGrids);

      const solutionResponse = await fetch(`/data/${algo}Solution.json`);
      const path: number[][] = await solutionResponse.json();
      setSolutionPath(path);

      const textResponse = await fetch(`/data/${algo}SolutionText.txt`);
      const text: string = await textResponse.text();
      setSolutionText(text);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRun = (algo: "dijkstra" | "aStar") => {
    setAlgo(algo);
    fetchData(algo);
    setCurrentIndex(0);
    setIsPlaying(false);
    setSolutionPath([]);
    setSolutionText("");
  };

  const drawGrid = (grid: string[][], canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = grid[0].length * cellSize;
    canvas.height = grid.length * cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f0f4f8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        let fillColor = "#ffffff";

        switch (cell) {
          case "P":
            fillColor = "#4caf50";
            break;
          case "#":
            fillColor = "#37474f";
            break;
          case "E":
            fillColor = "#ff5722";
            break;
          case "S":
            fillColor = "#2196f3";
            break;
          default:
            fillColor = "#ffffff";
        }

        ctx.fillStyle = fillColor;
        ctx.fillRect(
          colIndex * cellSize,
          rowIndex * cellSize,
          cellSize,
          cellSize
        );

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

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    if (currentIndex === grids.length - 1 && grids.length > 0) {
      const overlayHeight = 50;
      ctx.fillStyle = "rgba(33, 150, 243, 0.8)";
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

    if (solutionPath.length > 0) {
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 2;
      ctx.beginPath();
      solutionPath.forEach(([x, y], index) => {
        const posX = y * cellSize + cellSize / 2;
        const posY = x * cellSize + cellSize / 2;
        if (index === 0) {
          ctx.moveTo(posX, posY);
        } else {
          ctx.lineTo(posX, posY);
        }
      });
      ctx.stroke();
    }

    if (solutionText) {
      ctx.fillStyle = "#000000";
      ctx.font = `${cellSize}px Arial`;
      ctx.textAlign = "left";
      ctx.fillText(solutionText, 10, canvas.height - 10);
    }
  };

  useEffect(() => {
    if (grids.length === 0) return;
    if (currentIndex >= grids.length) return;
    const canvas = canvasRef.current;
    if (canvas) {
      drawGrid(grids[currentIndex], canvas);
    }
  }, [grids, currentIndex, cellSize, solutionPath, solutionText]);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentIndex >= grids.length - 1) {
      setIsPlaying(false);
      return;
    }
    if (speed >= 100) {
      // for (let i = currentIndex; i < 50; i++) {
      setCurrentIndex((prev) => prev + 1);
      // }
    }

    const interval = 1000 / speed;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, interval);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, speed, grids.length]);

  const togglePlayPause = () => {
    if (grids.length === 0) return;
    setIsPlaying((prev) => !prev);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const handleCellSizeChange = (newSize: number) => {
    // if (newSize < 10) newSize = 0.5;
    // if (newSize > 100) newSize = 100;
    setCellSize(newSize);
  };

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col items-center space-y-4 p-4">
        <div className="flex flex-row space-x-4">
          <RunButton onClick={() => handleRun("dijkstra")}>
            {"Dijkstra's"}
          </RunButton>
          <RunButton onClick={() => handleRun("aStar")}>
            {"A* Algorithm"}
          </RunButton>
        </div>
        <p className="text-white text-2xl font-semibold underline">
          {currentAlgo === "aStar" ? "A* Algorithm" : "Dijkstra's Algorithm"}
        </p>
        <canvas ref={canvasRef} className="shadow-lg rounded-lg" />
      </div>
      <ControlSidebar
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        isLastSlide={currentIndex === grids.length - 1 && grids.length > 0}
        cellSize={cellSize}
        onCellSizeChange={handleCellSizeChange}
        algorithm={currentAlgo}
        showFinalPath={() => {
          if (currentAlgo === "dijkstra") {
            setCurrentIndex(grids.length - 1);
          } else if (currentAlgo === "aStar") {
            setCurrentIndex(grids.length - 1);
          }
        }}
        solutionText={solutionText}
      />
    </div>
  );
};

export default GridCanvas;
