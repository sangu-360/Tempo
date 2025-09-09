
import React from 'react';
import type { Driver, BookingDetails } from '../types';
import { PhoneIcon } from './icons/PhoneIcon';
import { TruckIcon } from './icons/TruckIcon';

interface ConfirmationScreenProps {
  driver: Driver;
  bookingDetails: BookingDetails;
  onNewBooking: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ driver, bookingDetails, onNewBooking }) => {
  return (
    <div className="text-center animate-slide-in-up">
      <h2 className="text-2xl font-bold text-success mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-6">Your tempo is on its way. Please find the driver details below.</p>
      
      <div className="bg-slate-50 border border-gray-200 rounded-lg p-6 mb-6">
        <img src={driver.imageUrl} alt={driver.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md"/>
        <h3 className="text-xl font-semibold text-gray-800">{driver.name}</h3>
        <p className="text-gray-500">Your assigned driver</p>
        
        <div className="flex items-center justify-center mt-4 text-primary">
            <PhoneIcon className="w-5 h-5 mr-2" />
            <a href={`tel:${driver.phone}`} className="font-semibold text-lg hover:underline">{driver.phone}</a>
        </div>
      </div>

      <div className="text-left space-y-3">
        <div className="flex items-center">
            <TruckIcon className="w-6 h-6 mr-3 text-gray-500"/>
            <div>
                <p className="font-semibold text-gray-700">Vehicle Number</p>
                <p className="text-gray-600">{driver.vehicleNumber}</p>
            </div>
        </div>
        <div className="flex items-center">
            <div className="w-6 h-6 mr-3 text-gray-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
                <p className="font-semibold text-gray-700">Estimated Arrival</p>
                <p className="text-gray-600">{driver.eta} minutes</p>
            </div>
        </div>
      </div>
      
      <div className="mt-8 space-y-3">
         <button className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition">
          Track Your Ride
        </button>
        <button onClick={onNewBooking} className="w-full bg-transparent text-primary font-bold py-3 px-4 rounded-lg border-2 border-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
          Make a New Booking
        </button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
