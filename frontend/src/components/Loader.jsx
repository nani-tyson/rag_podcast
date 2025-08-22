import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute h-6 w-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin-slow"></div>
      </div>

      {/* Text */}
      <p className="mt-3 text-sm font-medium text-gray-400 animate-pulse">
        Thinking...
      </p>
    </div>
  );
};

export default Loader;
