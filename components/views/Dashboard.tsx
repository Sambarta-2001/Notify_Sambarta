import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card from '../common/Card';
import StatCard from '../common/StatCard';
import { Brand, Campaign, Transaction, TransactionType, CampaignStatus } from '../../types';
import { getCampaignsByBrandId, getTransactionsByBrandId } from '../../services/mockApi';
import DollarSignIcon from '../icons/DollarSignIcon';
import CampaignsIcon from '../icons/CampaignsIcon';
import TargetIcon from '../icons/TargetIcon';
import TrophyIcon from '../icons/TrophyIcon';
import Button from '../common/Button';

interface DashboardProps {
    currentUser: Brand;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-sm text-primary-600">{`Impressions: ${payload[0].value.toLocaleString()}`}</p>
        <p className="text-sm text-green-600">{`Clicks: ${payload[1].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [campaignsData, transactionsData] = await Promise.all([
                    getCampaignsByBrandId(currentUser.id),
                    getTransactionsByBrandId(currentUser.id)
                ]);
                setCampaigns(campaignsData);
                setTransactions(transactionsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentUser.id]);

    const { chartData, topCampaign, totalSpend30Days } = useMemo(() => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData: { [key: string]: { name: string; Impressions: number; Clicks: number } } = {};

        campaigns.forEach(c => {
            const date = new Date(c.startTime);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { name: monthNames[date.getMonth()], Impressions: 0, Clicks: 0 };
            }
            monthlyData[monthKey].Impressions += c.impressions;
            monthlyData[monthKey].Clicks += c.clicks;
        });
        
        const sortedChartData = Object.values(monthlyData).sort((a,b) => monthNames.indexOf(a.name) - monthNames.indexOf(b.name));

        const topCampaign = campaigns.length > 0 ? campaigns.reduce((prev, current) => (prev.clicks > current.clicks) ? prev : current) : null;
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const totalSpend30Days = transactions
            .filter(t => t.type === TransactionType.DEBIT && new Date(t.date) >= thirtyDaysAgo)
            .reduce((sum, t) => sum + t.amount, 0);

        return { chartData: sortedChartData, topCampaign, totalSpend30Days };
    }, [campaigns, transactions]);

    const dashboardStats = useMemo(() => {
        const activeCampaigns = campaigns.filter(c => c.status === CampaignStatus.ACTIVE).length;
        return { activeCampaigns };
    }, [campaigns]);

    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-full">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary-600" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-600">Loading dashboard...</p>
          </div>
        );
    }

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<DollarSignIcon />} title="Wallet Balance" value={`$${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <StatCard icon={<CampaignsIcon />} title="Active Campaigns" value={dashboardStats.activeCampaigns.toString()} />
        <StatCard icon={<TargetIcon />} title="Spend (Last 30 Days)" value={`$${totalSpend30Days.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <StatCard icon={<TrophyIcon />} title="Attention Score" value={`${currentUser.attentionScore}`} trend={{ value: '+2 pts', type: 'increase' }} />
      </div>

      <Card title="Performance Overview">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0052FF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0052FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Impressions" stroke="#0052FF" fillOpacity={1} fill="url(#colorImpressions)" />
              <Area type="monotone" dataKey="Clicks" stroke="#00C49F" fillOpacity={1} fill="url(#colorClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card title="Recent Transactions" action={<Button variant='secondary' className="text-xs">View All</Button>}>
                <div className="overflow-x-auto -mx-6 -mb-6">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.slice(0, 5).map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{tx.description}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${tx.type === TransactionType.CREDIT ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.type === TransactionType.CREDIT ? '+' : '-'} ${tx.amount.toFixed(2)}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
        {topCampaign && (
            <Card title="Top Performing Campaign">
                <div className="space-y-4">
                    <h4 className="text-primary-700 font-bold text-lg">{topCampaign.title}</h4>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Impressions</span>
                        <span className="font-semibold text-gray-800">{topCampaign.impressions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Clicks</span>
                        <span className="font-semibold text-gray-800">{topCampaign.clicks.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">CTR</span>
                        <span className="font-semibold text-gray-800">{((topCampaign.clicks / topCampaign.impressions) * 100).toFixed(2)}%</span>
                    </div>
                    <Button className="w-full mt-2" variant="secondary">View Details</Button>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;