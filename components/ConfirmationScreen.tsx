import React from 'react';
import { Booking, Driver } from '../types';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { TruckIcon } from './icons/TruckIcon';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { TempoGoLogo } from './icons/TempoGoLogo';

interface ConfirmationScreenProps {
  booking: Booking;
  driver: Driver;
}

// Fix: Implementing ConfirmationScreen to display booking and driver details.
// This resolves "Cannot find name" errors and the "is not a module" error in CustomerDashboard.
const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ booking, driver }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <TempoGoLogo className="h-9 w-9 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Driver Confirmed!</h3>
        <p className="text-gray-500 mt-1">Your tempo is on its way.</p>
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="font-bold text-gray-700 mb-3">Driver Details</h4>
        <div className="space-y-3 text-sm">
           <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="font-semibold text-gray-800">{driver.name}</span>
            </div>
             <div className="flex items-center">
                <TruckIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">{driver.vehicleDetails}</span>
            </div>
            <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                <a href={`tel:${driver.phone}`} className="text-primary hover:underline">{driver.phone}</a>
            </div>
        </div>
      </div>
      
       <div className="mt-4 border-t pt-4">
        <h4 className="font-bold text-gray-700 mb-3">Trip Details</h4>
         <div className="space-y-3 text-sm">
            <div className="flex">
                <LocationPinIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-gray-500 text-xs">PICKUP</p>
                    <p className="text-gray-800">{booking.pickupLocation}</p>
                </div>
            </div>
            <div className="flex">
                <LocationPinIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-gray-500 text-xs">DROP-OFF</p>
                    <p className="text-gray-800">{booking.dropoffLocation}</p>
                </div>
            </div>
             <p className="font-bold text-lg text-green-600 text-center pt-2">Fare: ₹{booking.fare}</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;