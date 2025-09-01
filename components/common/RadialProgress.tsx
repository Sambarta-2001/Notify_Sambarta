import React from 'react';

interface RadialProgressProps {
  value: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ value }) => {
  const size = 160;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  let colorClass = 'text-green-500';
  if (value < 75) colorClass = 'text-yellow-500';
  if (value < 50) colorClass = 'text-red-500';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className={`transition-all duration-1000 ease-out ${colorClass}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-4xl font-bold ${colorClass.replace('text-','text-')}`}>{value}</span>
      </div>
    </div>
  );
};

export default RadialProgress;
