import React, { useState, useEffect, useRef } from 'react';
import { Brand, Bid } from '../../types';
import Card from '../common/Card';
import { getLiveAuctionResults } from '../../services/mockApi';

interface BiddingPlatformProps {
    currentUser: Brand;
}

const BiddingPlatform: React.FC<BiddingPlatformProps> = ({ currentUser }) => {
    const [bids, setBids] = useState<Bid[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLive, setIsLive] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchBids = async () => {
        if (document.hidden) return; // Don't fetch if tab is not active
        try {
            const newBids = await getLiveAuctionResults();
            if (newBids.length > 0) {
                setBids(prevBids => [...newBids, ...prevBids].slice(0, 50)); // Keep the list from getting too long
            }
        } catch (error) {
            console.error("Failed to fetch live auction results:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchBids();
        
        // Set up interval for live updates
        if (isLive) {
            intervalRef.current = setInterval(fetchBids, 3000); // Fetch new bids every 3 seconds
        }

        // Cleanup interval on component unmount or when live is toggled off
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLive]);
    
    const toggleLive = () => {
        setIsLive(!isLive);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Live Bidding Platform</h2>
                <button 
                    onClick={toggleLive}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                        isLive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    <span className={`h-3 w-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                    <span>{isLive ? 'Live' : 'Paused'}</span>
                </button>
            </div>

            <Card>
                <div className="p-4 bg-gray-50 border-b">
                    <p className="text-sm text-gray-600">Watching for new winning bids across the platform. Your wins will be highlighted.</p>
                </div>
                {isLoading ? (
                     <div className="text-center py-12 text-gray-500">Initializing live feed...</div>
                ) : (
                <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                    {bids.length === 0 ? (
                         <div className="text-center py-12 text-gray-500">No recent bids to display. Waiting for auction results...</div>
                    ) : (
                        bids.map(bid => {
                            const isCurrentUserWin = bid.brandId === currentUser.id;
                            return (
                                <div key={bid.id} className={`p-4 transition-all duration-500 ${isCurrentUserWin ? 'bg-primary-50' : 'bg-white'}`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {isCurrentUserWin && '🏆 '}
                                                {bid.brandName} won slot for "{bid.campaignTitle}"
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(bid.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                             <p className="font-bold text-primary-600">${bid.bidAmount.toFixed(2)}</p>
                                             <p className="text-xs text-gray-400">Winning Bid</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                )}
            </Card>
        </div>
    );
};

export default BiddingPlatform;
