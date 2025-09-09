import React from 'react';
import type { Booking } from '../types';
import { PhoneIcon } from './icons/PhoneIcon';
import { TruckIcon } from './icons/TruckIcon';

interface ConfirmationScreenProps {
  booking: Booking;
  onNewBooking: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ booking, onNewBooking }) => {
  const { assignedDriver } = booking;

  if (!assignedDriver) {
    return (
        <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-red-600">Error: No driver assigned.</h2>
            <button onClick={onNewBooking} className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg">
              Go Back
            </button>
        </div>
    );
  }

  const arrivalTime = new Date(booking.bookingTime);
  
  return (
    <div className="text-center animate-slide-in-up">
      <h2 className="text-2xl font-bold text-success mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-6">Your tempo is scheduled. Please find the driver details below.</p>
      
      <div className="bg-slate-50 border border-gray-200 rounded-lg p-6 mb-6">
        <img src={assignedDriver.imageUrl} alt={assignedDriver.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md"/>
        <h3 className="text-xl font-semibold text-gray-800">{assignedDriver.name}</h3>
        <p className="text-gray-500">Your assigned driver</p>
        
        <div className="flex items-center justify-center mt-4 text-primary">
            <PhoneIcon className="w-5 h-5 mr-2" />
            <a href={`tel:${assignedDriver.phone}`} className="font-semibold text-lg hover:underline">{assignedDriver.phone}</a>
        </div>
      </div>

      <div className="text-left space-y-3">
        <div className="flex items-center">
            <TruckIcon className="w-6 h-6 mr-3 text-gray-500"/>
            <div>
                <p className="font-semibold text-gray-700">Vehicle Number</p>
                <p className="text-gray-600">{assignedDriver.vehicleNumber}</p>
            </div>
        </div>
        <div className="flex items-center">
            <div className="w-6 h-6 mr-3 text-gray-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
                <p className="font-semibold text-gray-700">Scheduled Pickup Time</p>
                <p className="text-gray-600">{arrivalTime.toLocaleString()}</p>
            </div>
        </div>
      </div>
      
      <div className="mt-8 space-y-3">
        <button onClick={onNewBooking} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
          Make a New Booking
        </button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
