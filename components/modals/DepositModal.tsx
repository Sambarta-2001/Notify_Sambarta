import React, { useState } from 'react';
import Button from '../common/Button';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => Promise<void>;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid, positive amount.');
      return;
    }
    setError('');
    setIsLoading(true);
    await onDeposit(numericAmount);
    setIsLoading(false);
  };
  
  const handleAmountButtonClick = (value: number) => {
    setAmount(value.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Deposit Funds</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    aria-describedby="price-currency"
                />
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm" id="price-currency">USD</span>
                </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex justify-center space-x-2">
            {[50, 100, 250, 500].map((val) => (
                <Button key={val} variant="secondary" onClick={() => handleAmountButtonClick(val)} className="flex-1 text-xs">
                    ${val}
                </Button>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleDeposit} isLoading={isLoading}>Deposit</Button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
