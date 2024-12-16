// src/components/ControlSidebar.tsx
import React from "react";

interface ControlSidebarProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (newSpeed: number) => void;
  isLastSlide: boolean;
  cellSize: number;
  onCellSizeChange: (newSize: number) => void;
  algorithm: "dijkstra" | "aStar";
  showFinalPath: () => void;
  solutionText: string;
}

const ControlSidebar: React.FC<ControlSidebarProps> = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
  isLastSlide,
  cellSize,
  onCellSizeChange,
  algorithm,
  showFinalPath,
  solutionText,
}) => {
  return (
    <div className="w-64 p-4 bg-gray-100 border-l border-gray-300 flex flex-col space-y-4">
      <button
        onClick={onPlayPause}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      {isLastSlide && (
        <button
          onClick={showFinalPath}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Final Path
        </button>
      )}

      <div>
        <label className="block mb-2">Speed (slides per second):</label>
        <input
          type="number"
          min={1}
          max={60}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full px-2 py-1 border rounded"
        />
      </div>

      <div>
        <label className="block mb-2">Cell Size (pixels):</label>
        <input
          type="number"
          min={1}
          max={100}
          value={cellSize}
          onChange={(e) => onCellSizeChange(Number(e.target.value))}
          className="w-full px-2 py-1 border rounded"
        />
      </div>

      {isLastSlide && (
        <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">
          {algorithm === "dijkstra"
            ? "Dijkstra's algorithm completed."
            : "A* Algorithm completed."}
        </div>
      )}
      {isLastSlide && (
        <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">
          {solutionText}
        </div>
      )}
    </div>
  );
};

export default ControlSidebar;
