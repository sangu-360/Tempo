// Fix: Implementing the DriverForm for the AdminDashboard to add new drivers.
// This replaces placeholder content.
import React, { useState } from 'react';
import { Driver } from '../types';
import { UserIcon } from './icons/UserIcon';
import { TruckIcon } from './icons/TruckIcon';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface DriverFormProps {
  onSubmit: (driverData: Omit<Driver, 'id' | 'role'>) => void;
}

const DriverForm: React.FC<DriverFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !vehicleDetails || !currentLocation || !phone) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    onSubmit({
      name,
      vehicleDetails,
      currentLocation,
      phone,
      isAvailable: true, // New drivers are available by default
    });
    // Reset form
    setName('');
    setVehicleDetails('');
    setCurrentLocation('');
    setPhone('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Driver</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="driver-name" className="block text-sm font-medium text-gray-700 mb-1">
            Driver Name
          </label>
          <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text" id="driver-name" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sanjay Mehta" required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
          </div>
        </div>
        <div>
          <label htmlFor="driver-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel" id="driver-phone" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 1234567890" required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
          </div>
        </div>
        <div>
          <label htmlFor="vehicle-details" className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Details
          </label>
           <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <TruckIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text" id="vehicle-details" value={vehicleDetails} onChange={(e) => setVehicleDetails(e.target.value)}
              placeholder="e.g., Tata Ace (MH 01 AB 1234)" required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
          </div>
        </div>
        <div>
          <label htmlFor="driver-location" className="block text-sm font-medium text-gray-700 mb-1">
            Current Location
          </label>
           <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LocationPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text" id="driver-location" value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)}
              placeholder="e.g., Jayanagar, Bangalore" required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark transition duration-300"
        >
          Add Driver
        </button>
      </form>
    </div>
  );
};

export default DriverForm;