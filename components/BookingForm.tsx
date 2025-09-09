// Fix: Implementing the BookingForm component to allow customers to create new bookings.
// This replaces the placeholder content.
import React, { useState } from 'react';
import { Booking } from '../types';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { TruckIcon } from './icons/TruckIcon';

interface BookingFormProps {
  onSubmit: (bookingData: Omit<Booking, 'id' | 'customerId' | 'status'>) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('Tata Ace');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation || !dropoffLocation) {
      setError('Please fill in both pickup and drop-off locations.');
      return;
    }
    setError('');
    onSubmit({
      pickupLocation,
      dropoffLocation,
      vehicleType,
    });
    setPickupLocation('');
    setDropoffLocation('');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in-down">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book a Tempo</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location
          </label>
          <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LocationPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="pickup"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g., Koramangala, Bangalore"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
            />
          </div>
        </div>
        <div>
          <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 mb-1">
            Drop-off Location
          </label>
           <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LocationPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="dropoff"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              placeholder="e.g., HSR Layout, Bangalore"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
            />
          </div>
        </div>
        <div>
          <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Type
          </label>
           <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <TruckIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="vehicle"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition appearance-none"
            >
              <option>Tata Ace</option>
              <option>Mahindra Bolero</option>
              <option>Ashok Leyland Dost</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition duration-300"
        >
          Find Driver
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
