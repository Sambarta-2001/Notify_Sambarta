import React, { useState, useMemo, useEffect } from 'react';
import { Campaign, CampaignStatus, Brand } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import CampaignModal from '../modals/CampaignModal';
import ProgressBar from '../common/ProgressBar';
import { getCampaignsByBrandId, saveCampaign as apiSaveCampaign, deleteCampaign as apiDeleteCampaign } from '../../services/mockApi';

interface CampaignsProps {
  currentUser: Brand;
}

const StatusBadge: React.FC<{ status: CampaignStatus }> = ({ status }) => {
    const statusClasses = {
        [CampaignStatus.ACTIVE]: 'bg-green-100 text-green-800',
        [CampaignStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
        [CampaignStatus.ENDED]: 'bg-gray-200 text-gray-800',
        [CampaignStatus.DRAFT]: 'bg-blue-100 text-blue-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const Campaigns: React.FC<CampaignsProps> = ({ currentUser }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    const fetchCampaigns = async () => {
        setIsLoading(true);
        const data = await getCampaignsByBrandId(currentUser.id);
        setCampaigns(data);
        setIsLoading(false);
    };
    fetchCampaigns();
  }, [currentUser.id]);

  const handleCreateNew = () => {
    setSelectedCampaign(null);
    setIsModalOpen(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleDelete = async (campaignId: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      await apiDeleteCampaign(campaignId);
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
    }
  };

  const handleSave = async (campaign: Campaign) => {
    const campaignToSave = { ...campaign, brandId: currentUser.id };
    const savedCampaign = await apiSaveCampaign(campaignToSave);
    if (selectedCampaign) {
      setCampaigns(campaigns.map(c => c.id === savedCampaign.id ? savedCampaign : c));
    } else {
      setCampaigns([...campaigns, savedCampaign]);
    }
    setIsModalOpen(false);
  };

  const categories = useMemo(() => ['All', ...Array.from(new Set(campaigns.map(c => c.category)))], [campaigns]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const statusMatch = statusFilter === 'All' || campaign.status === statusFilter;
      const categoryMatch = categoryFilter === 'All' || campaign.category === categoryFilter;
      return statusMatch && categoryMatch;
    });
  }, [campaigns, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-3xl font-bold text-gray-800">Campaign Management</h2>
        <Button onClick={handleCreateNew} className="mt-4 md:mt-0">
          Create New Campaign
        </Button>
      </div>

      <Card>
        <div className="p-4 bg-gray-50 border-b flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div>
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 mr-2">Status:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option>All</option>
              {Object.values(CampaignStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 mr-2">Category:</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeframe</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">Loading campaigns...</td></tr>
              ) : filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                    <div className="text-xs text-gray-500">{campaign.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ProgressBar startTime={campaign.startTime} endTime={campaign.endTime} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Clicks: <span className="font-semibold text-gray-700">{campaign.clicks.toLocaleString()}</span></div>
                    <div>Impressions: <span className="font-semibold text-gray-700">{campaign.impressions.toLocaleString()}</span></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button variant="secondary" className="text-xs !py-1 !px-2" onClick={() => handleEdit(campaign)}>Edit</Button>
                    <Button variant="danger" className="text-xs !py-1 !px-2" onClick={() => handleDelete(campaign.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {isModalOpen && (
        <CampaignModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          campaign={selectedCampaign}
        />
      )}
    </div>
  );
};

export default Campaigns;
