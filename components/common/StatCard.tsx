import React from 'react';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';

interface StatCardProps {
  // FIX: Changed type from React.ReactNode to React.ReactElement to satisfy React.cloneElement's requirements.
  icon: React.ReactElement;
  title: string;
  value: string;
  trend?: {
    value: string;
    type: 'increase' | 'decrease';
  };
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend }) => {
  const trendColor = trend?.type === 'increase' ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start justify-between transition-shadow duration-300 hover:shadow-lg">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <div className={`flex items-center text-sm mt-2 font-semibold ${trendColor}`}>
            {trend.type === 'increase' ? <ArrowUpIcon className="h-4 w-4 mr-1"/> : <ArrowDownIcon className="h-4 w-4 mr-1"/>}
            <span>{trend.value} from last month</span>
          </div>
        )}
      </div>
      <div className="bg-primary-50 text-primary-600 p-3 rounded-full">
        {/* FIX: Removed type assertion as the prop type is now more specific, resolving the overload error. */}
        {React.cloneElement(icon, { className: 'h-6 w-6' })}
      </div>
    </div>
  );
};

export default StatCard;