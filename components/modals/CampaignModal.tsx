import React, { useState, useEffect } from 'react';
import { Campaign, CampaignStatus } from '../../types';
import Button from '../common/Button';
import { generateCampaignMessages } from '../../services/geminiService';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
  campaign: Campaign | null;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, onSave, campaign }) => {
  const [formData, setFormData] = useState<Omit<Campaign, 'id' | 'brandId' | 'impressions' | 'clicks' | 'totalSpent' | 'conversionRate'>>({
    title: '',
    message: '',
    category: '',
    bidAmount: 0.5,
    startTime: '',
    endTime: '',
    status: CampaignStatus.DRAFT,
    targetAudience: '',
  });
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiError, setAiError] = useState('');
  const [productInfo, setProductInfo] = useState('');

  useEffect(() => {
    if (campaign) {
      setFormData(campaign);
    } else {
      setFormData({
        title: '', message: '', category: '', bidAmount: 0.5,
        startTime: new Date().toISOString().split('T')[0],
        endTime: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        status: CampaignStatus.DRAFT,
        targetAudience: 'General Audience',
      });
    }
  }, [campaign, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'bidAmount' ? parseFloat(value) : value }));
  };

  const handleSave = () => {
    const campaignToSave: Campaign = {
      ...formData,
      id: campaign?.id || '',
      brandId: campaign?.brandId || '',
      impressions: campaign?.impressions || 0,
      clicks: campaign?.clicks || 0,
      totalSpent: campaign?.totalSpent || 0,
      conversionRate: campaign?.conversionRate || 0,
    };
    onSave(campaignToSave);
  };
  
  const handleGenerateMessages = async () => {
    if (!productInfo.trim()) {
      setAiError('Please provide some product information.');
      return;
    }
    setIsAiLoading(true);
    setAiError('');
    setAiSuggestions([]);
    try {
      const suggestions = await generateCampaignMessages(productInfo);
      setAiSuggestions(suggestions);
    } catch (error: any) {
      setAiError(error.message || 'An unknown error occurred.');
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const useSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, message: suggestion }));
    setAiSuggestions([]);
    setProductInfo('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{campaign ? 'Edit Campaign' : 'Create New Campaign'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea name="message" id="message" value={formData.message} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
          </div>

          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">✨ AI Campaign Assistant</p>
            <textarea value={productInfo} onChange={(e) => setProductInfo(e.target.value)} placeholder="Describe your product or offer (e.g., 'A new line of waterproof hiking boots')..." rows={2} className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
            <Button onClick={handleGenerateMessages} isLoading={isAiLoading} className="mt-2 text-sm" variant="secondary">Generate Suggestions</Button>
            {aiError && <p className="text-red-500 text-xs mt-2">{aiError}</p>}
            {aiSuggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                    {aiSuggestions.map((s, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-2 rounded-md border">
                            <p className="text-sm text-gray-800">{s}</p>
                            <button onClick={() => useSuggestion(s)} className="text-xs text-primary-600 font-semibold hover:underline">Use</button>
                        </div>
                    ))}
                </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">Bid Amount ($)</label>
                <input type="number" name="bidAmount" id="bidAmount" value={formData.bidAmount} onChange={handleChange} step="0.01" min="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">Target Audience</label>
            <input type="text" name="targetAudience" id="targetAudience" value={formData.targetAudience} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="date" name="startTime" id="startTime" value={formData.startTime} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                <input type="date" name="endTime" id="endTime" value={formData.endTime} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>
           <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                {Object.values(CampaignStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Campaign</Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;
