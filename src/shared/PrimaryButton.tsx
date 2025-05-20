import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  handler?: () => void; // Make this optional if not all buttons have handlers
  type?: "button" | "submit" | "reset"; // Ensure proper button types
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  handler,
  type = "button", 
}) => {
  return (
    <button
      onClick={handler}
      type={type}
      className="inline-flex items-center justify-center px-4 py-2 text-base font-medium text-center text-black border border-indigo-500 rounded-lg shadow-sm cursor-pointer transition-colors duration-300 hover:bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-500  hover:border-indigo-600"
    >
      <span className="text-sm font-medium transition-all">{children}</span>
    </button>
  );
};

export default PrimaryButton;
