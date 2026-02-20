import React from 'react';

const BouncingLoader = ({ size = "h-3 w-3", color = "bg-purple-600", spacing = "space-x-2" }) => {
  return (
    <div className={`flex ${spacing} justify-center items-center`}>
      <div className={`${size} ${color} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
      <div className={`${size} ${color} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
      <div className={`${size} ${color} rounded-full animate-bounce`}></div>
    </div>
  );
};

export default BouncingLoader;
