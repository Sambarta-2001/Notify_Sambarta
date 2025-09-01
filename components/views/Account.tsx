import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Brand } from '../../types';
import { updateBrand } from '../../services/mockApi';

interface AccountProps {
    currentUser: Brand;
    setCurrentUser: (user: Brand) => void;
}

const Account: React.FC<AccountProps> = ({ currentUser, setCurrentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        companyName: currentUser.companyName,
        email: currentUser.email,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');
        try {
            const updatedUser = await updateBrand({
                id: currentUser.id,
                companyName: formData.companyName,
                email: formData.email,
            });
            setCurrentUser(updatedUser);
            setSuccessMessage('Account details updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update account:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCancel = () => {
        setFormData({
            companyName: currentUser.companyName,
            email: currentUser.email,
        });
        setIsEditing(false);
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800">Account Details</h2>

            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                    <p>{successMessage}</p>
                </div>
            )}

            <Card>
                <form onSubmit={handleSave}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                id="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Member Since</label>
                            <p className="text-sm text-gray-600 mt-1">{new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Wallet Balance</label>
                            <p className="text-sm text-gray-900 font-semibold mt-1">${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                        {isEditing ? (
                            <>
                                <Button variant="secondary" onClick={handleCancel} type="button">Cancel</Button>
                                <Button type="submit" isLoading={isLoading}>Save Changes</Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} type="button">Edit Details</Button>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Account;
