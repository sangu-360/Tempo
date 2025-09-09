import React, { useState } from 'react';
import type { Driver } from '../types';
import { LogoutIcon } from './icons/LogoutIcon';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { TruckIcon } from './icons/TruckIcon';

interface AdminDashboardProps {
  drivers: Driver[];
  onAddDriver: (newDriver: Omit<Driver, 'role' | 'isAuthorized' | 'imageUrl'> & {imageUrl?: string}) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ drivers, onAddDriver, onLogout }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id && name && phone && vehicleNumber) {
        onAddDriver({id, name, phone, vehicleNumber});
        setId('');
        setName('');
        setPhone('');
        setVehicleNumber('');
    }
  }

  return (
    <div className="animate-fade-in">
        <header className="flex justify-between items-center mb-4 pb-2 border-b">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                <p className="text-sm text-gray-500">Manage Drivers</p>
            </div>
            <button onClick={onLogout} className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors">
                <LogoutIcon className="w-5 h-5 mr-1" />
                Logout
            </button>
        </header>

        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Add New Driver</h3>
            <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border rounded-lg space-y-3">
                <input value={id} onChange={e => setId(e.target.value)} placeholder="Driver ID (e.g., new.driver)" required className="w-full p-2 border rounded"/>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required className="w-full p-2 border rounded"/>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" required className="w-full p-2 border rounded"/>
                <input value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} placeholder="Vehicle Number" required className="w-full p-2 border rounded"/>
                <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-3 rounded-lg hover:bg-primary-dark transition">Add & Authorize Driver</button>
            </form>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Driver List ({drivers.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {drivers.map(driver => (
                    <div key={driver.id} className="p-3 bg-white border rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={driver.imageUrl} alt={driver.name} className="w-10 h-10 rounded-full mr-3"/>
                            <div>
                                <p className="font-semibold">{driver.name}</p>
                                <p className="text-xs text-gray-500">{driver.id} | {driver.vehicleNumber}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${driver.isAuthorized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {driver.isAuthorized ? 'Authorized' : 'Unauthorized'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
