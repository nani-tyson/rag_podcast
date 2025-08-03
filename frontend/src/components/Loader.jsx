import React from "react";

const Loader = () => {
  return (
    <div className="mt-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <p className="mt-2 text-gray-300">Loading...</p>
    </div>
  );
};

export default Loader;
