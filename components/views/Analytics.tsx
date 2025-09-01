import React, { useState, useEffect, useMemo } from 'react';
import Card from '../common/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Brand, Campaign } from '../../types';
import { getCampaignsByBrandId } from '../../services/mockApi';
import RadialProgress from '../common/RadialProgress';

interface AnalyticsProps {
    currentUser: Brand;
}

const COLORS = ['#0052FF', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-700">{label}</p>
        {payload.map((pld: any) => (
             <p key={pld.dataKey} style={{ color: pld.fill }}>{`${pld.name}: ${pld.value.toFixed(2)}`}</p>
        ))}
      </div>
    );
  }
  return null;
};


const Analytics: React.FC<AnalyticsProps> = ({ currentUser }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const campaignsData = await getCampaignsByBrandId(currentUser.id);
            setCampaigns(campaignsData);
            setIsLoading(false);
        };
        fetchData();
    }, [currentUser.id]);

    const { campaignPerformanceData, categoryData } = useMemo(() => {
        const performanceData = campaigns.map(c => ({
            name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
            ROI: c.totalSpent > 0 ? ((c.clicks * 0.5) / c.totalSpent) : 0, // Mock ROI calculation
            CTR: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0,
        }));

        const catData: { [key: string]: number } = campaigns.reduce((acc, c) => {
            if (!acc[c.category]) {
                acc[c.category] = 0;
            }
            acc[c.category] += 1;
            return acc;
        }, {} as { [key: string]: number });

        const pieData = Object.keys(catData).map(key => ({
            name: key,
            value: catData[key],
        }));

        return { campaignPerformanceData: performanceData, categoryData: pieData };
    }, [campaigns]);
    
    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-full">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
             <p className="text-lg text-gray-600">Loading analytics...</p>
          </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>

            <Card title="Campaign Performance (ROI & CTR)">
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <BarChart data={campaignPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="left" orientation="left" stroke="#0052FF" label={{ value: 'ROI', angle: -90, position: 'insideLeft', fill: '#0052FF' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#00C49F" label={{ value: 'CTR (%)', angle: -90, position: 'insideRight', fill: '#00C49F' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="ROI" fill="#0052FF" name="Return on Investment" />
                            <Bar yAxisId="right" dataKey="CTR" fill="#00C49F" name="Click-Through Rate (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card title="Campaigns by Category" className="lg:col-span-3">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card title="Attention Score" className="lg:col-span-2">
                    <div className="flex flex-col items-center justify-center h-full">
                       <RadialProgress value={currentUser.attentionScore} />
                       <p className="text-sm text-center text-gray-500 mt-4">This score reflects the quality of engagement your campaigns receive from users. Higher scores lead to better ad placements.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
