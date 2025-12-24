
import React from 'react';

const Santa: React.FC = () => {
  return (
    <div className="fixed bottom-10 right-10 z-50 animate-bounce cursor-pointer group">
      <div className="relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border-2 border-red-600">
          Ho Ho Ho! Click me!
        </div>
        <svg
          width="120"
          height="120"
          viewBox="0 0 200 200"
          className="filter drop-shadow-xl"
        >
          {/* Sleigh */}
          <path d="M20,150 Q40,180 180,150 L180,130 Q40,160 20,130 Z" fill="#8B4513" />
          {/* Santa Body */}
          <circle cx="100" cy="100" r="40" fill="#ff0000" />
          <circle cx="100" cy="60" r="30" fill="#ffd1dc" />
          {/* Hat */}
          <path d="M75,45 Q100,10 125,45 Z" fill="#ff0000" />
          <circle cx="100" cy="25" r="8" fill="white" />
          {/* Beard */}
          <path d="M70,65 Q100,100 130,65 Q100,85 70,65" fill="white" />
          {/* Eyes */}
          <circle cx="90" cy="55" r="2" fill="black" />
          <circle cx="110" cy="55" r="2" fill="black" />
        </svg>
      </div>
    </div>
  );
};

export default Santa;
