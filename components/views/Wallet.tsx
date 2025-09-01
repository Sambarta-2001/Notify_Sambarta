import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Transaction, TransactionStatus, TransactionType, Brand } from '../../types';
import { getTransactionsByBrandId, addFundsToBrand } from '../../services/mockApi';
import DepositModal from '../modals/DepositModal';
import InvoiceIcon from '../icons/InvoiceIcon';

interface WalletProps {
    currentUser: Brand;
    setCurrentUser: (user: Brand) => void;
    setViewingInvoice: (transaction: Transaction) => void;
}

const Wallet: React.FC<WalletProps> = ({ currentUser, setCurrentUser, setViewingInvoice }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            const data = await getTransactionsByBrandId(currentUser.id);
            setTransactions(data);
            setIsLoading(false);
        };
        fetchTransactions();
    }, [currentUser.id]);
    
    const handleDeposit = async (amount: number) => {
        const updatedUser = await addFundsToBrand(currentUser.id, amount);
        setCurrentUser(updatedUser);
        
        // Refetch transactions to show the new deposit
        const data = await getTransactionsByBrandId(currentUser.id);
        setTransactions(data);

        setIsDepositModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800">Wallet</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
                        <p className="text-4xl font-bold text-gray-900">${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <Button className="mt-4 md:mt-0" onClick={() => setIsDepositModalOpen(true)}>
                        Deposit Funds
                    </Button>
                </Card>
                <Card>
                     <h3 className="text-sm font-medium text-gray-500 mb-2">Account Status</h3>
                     <p className="text-lg font-bold text-green-600">Active</p>
                     <p className="text-xs text-gray-400 mt-2">All systems normal. Payments are processed on time.</p>
                </Card>
            </div>


            <Card title="Transaction History">
                <div className="overflow-x-auto -mx-6 -mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-12 text-gray-500">Loading transactions...</td></tr>
                            ) : transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{tx.invoiceNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.description}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${tx.type === TransactionType.CREDIT ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === TransactionType.CREDIT ? '+' : '-'} ${tx.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            tx.status === TransactionStatus.COMPLETED ? 'bg-green-100 text-green-800' : 
                                            tx.status === TransactionStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Button variant="secondary" className="!p-2" onClick={() => setViewingInvoice(tx)} aria-label={`View invoice ${tx.invoiceNumber}`}>
                                            <InvoiceIcon className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isDepositModalOpen && (
                <DepositModal
                    isOpen={isDepositModalOpen}
                    onClose={() => setIsDepositModalOpen(false)}
                    onDeposit={handleDeposit}
                />
            )}
        </div>
    );
};

export default Wallet;
