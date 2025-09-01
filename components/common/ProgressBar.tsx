import React from 'react';

interface ProgressBarProps {
  startTime: string;
  endTime: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ startTime, endTime }) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const now = new Date().getTime();

  const totalDuration = end - start;
  const elapsedDuration = now - start;

  let progress = (elapsedDuration / totalDuration) * 100;
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;
  
  const startDateFormatted = new Date(startTime).toLocaleDateString();
  const endDateFormatted = new Date(endTime).toLocaleDateString();

  return (
    <div>
        <div className="flex justify-between mb-1 text-xs text-gray-500">
            <span>{startDateFormatted}</span>
            <span>{endDateFormatted}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    </div>
  );
};

export default ProgressBar;
