import React from "react";

interface SecondaryButtonProps {
  children: React.ReactNode;
  handler?: () => void; 
  type?: "button" | "submit" | "reset"; 
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  handler,
  type = "button",
}) => {
  return (
    <button
      onClick={handler}
      type={type}
      className="w-full px-4 py-2  text-base font-medium text-center text-indigo-100 border border-indigo-500 rounded-lg shadow-sm cursor-pointer hover:text-white bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-500"
    >
      <span className="text-sm font-medium transition-all">{children}</span>
    </button>
  );
};

export default SecondaryButton;
