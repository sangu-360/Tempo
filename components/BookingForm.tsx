import React, { useState } from 'react';
import { LocationPinIcon } from './icons/LocationPinIcon';

interface BookingFormProps {
  onSubmit: (bookingData: { pickupLocation: string; dropoffLocation: string; }) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation || !dropoffLocation) {
      setError('Please fill in both pickup and drop-off locations.');
      return;
    }
    setError('');
    onSubmit({ pickupLocation, dropoffLocation });
    setPickupLocation('');
    setDropoffLocation('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Book a Tempo</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="pickup-location" className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location
          </label>
          <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LocationPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text" id="pickup-location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g., 123, MG Road, Bangalore" required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
          </div>
        </div>
        <div>
          <label htmlFor="dropoff-location" className="block text-sm font-medium text-gray-700 mb-1">
            Drop-off Location
          </label>
           <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LocationPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text" id="dropoff-location" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)}
              placeholder="e.g., 456, HSR Layout, Bangalore" required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark transition duration-300"
        >
          Find Driver
        </button>
      </form>
    </div>
  );
};

export default BookingForm;