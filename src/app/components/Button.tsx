import React from "react";
import { Play } from "lucide-react";

interface RunButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

const RunButton: React.FC<RunButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="
        bg-neonYellow
        text-black
        hover:bg-neonYellowDark
        focus:outline-none 
        focus:ring-2 
        focus:ring-yellow-500 
        focus:ring-opacity-50 
        rounded-md 
        px-4 
        py-2 
        transition-colors 
        duration-300 
        ease-in-out 
        shadow-md 
        active:scale-95 
        flex 
        items-center 
        gap-2
      "
      onClick={onClick}
    >
      {children}
      <Play className="w-5 h-5" />
    </button>
  );
};

export default RunButton;
