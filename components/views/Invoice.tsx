import React from 'react';
import { Transaction, Brand, TransactionType } from '../../types';
import PrintIcon from '../icons/PrintIcon';

interface InvoiceProps {
    transaction: Transaction;
    brand: Brand;
    onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ transaction, brand, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-gray-100 z-50 p-4 sm:p-8 flex flex-col">
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #invoice-section, #invoice-section * {
                            visibility: visible;
                        }
                        #invoice-section {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                `}
            </style>
            <div className="no-print flex justify-end items-center mb-4 space-x-4">
                 <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition">
                    <PrintIcon className="h-5 w-5" />
                    <span>Print / Save as PDF</span>
                 </button>
                 <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
            </div>
            <div id="invoice-section" className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto w-full p-8 sm:p-12 flex-grow overflow-y-auto">
                <header className="flex justify-between items-start pb-8 border-b">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">INVOICE</h1>
                        <p className="text-gray-500 mt-2">Invoice #: {transaction.invoiceNumber}</p>
                        <p className="text-gray-500">Date: {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                         <div className="flex justify-end items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <h2 className="text-2xl font-bold ml-2">PingRight</h2>
                          </div>
                        <p className="text-gray-500">Platform for Brands</p>
                    </div>
                </header>
                
                <section className="grid grid-cols-2 gap-8 my-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Bill To</h3>
                        <p className="text-lg font-medium text-gray-900 mt-2">{brand.companyName}</p>
                        <p className="text-gray-600">{brand.email}</p>
                    </div>
                     <div className="text-right">
                         <p className="text-sm text-gray-500">Status</p>
                         <p className="text-2xl font-bold text-green-600 uppercase">Paid</p>
                     </div>
                </section>
                
                <section>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Description</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 uppercase text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-4">{transaction.description}</td>
                                <td className="p-4 text-right">${transaction.amount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                
                <section className="flex justify-end mt-8">
                    <div className="w-full max-w-xs">
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${transaction.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Taxes</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between py-4 border-t-2 border-gray-200 mt-2">
                            <span className="text-lg font-bold text-gray-900">Total {transaction.type === TransactionType.CREDIT ? 'Deposited' : 'Paid'}</span>
                            <span className="text-lg font-bold text-gray-900">${transaction.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
                
                <footer className="mt-12 pt-8 border-t text-center text-gray-500 text-sm">
                    <p>Thank you for your business!</p>
                    <p>If you have any questions, please contact support@pingright.com.</p>
                </footer>
            </div>
        </div>
    );
};

export default Invoice;
