import React from 'react';
import { Booking, Driver } from '../types';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { TruckIcon } from './icons/TruckIcon';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { TempoGoLogo } from './icons/TempoGoLogo';
import { ClockIcon } from './icons/ClockIcon';

interface ConfirmationScreenProps {
  booking: Booking;
  driver: Driver;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ booking, driver }) => {
  
  const formatTime = (time: string) => {
    try {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
        return time; // Fallback for invalid time format
    }
  };

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
            {booking.pickupTime && (
              <div className="flex">
                  <ClockIcon className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                      <p className="font-semibold text-gray-500 text-xs">PICKUP TIME</p>
                      <p className="text-gray-800 font-semibold">{formatTime(booking.pickupTime)}</p>
                  </div>
              </div>
            )}
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