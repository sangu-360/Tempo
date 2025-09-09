// Fix: Implementing the ConfirmationScreen component to show booking details to the customer.
// This replaces the placeholder content.
import React from 'react';
import { Booking } from '../types';

interface ConfirmationScreenProps {
  booking: Booking;
  onNewBooking: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ booking, onNewBooking }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center animate-fade-in max-w-lg mx-auto">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">We are finding a driver for you. You will be notified once a driver accepts your request.</p>
        
        <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
            <p><span className="font-semibold">Booking ID:</span> {booking.id}</p>
            <p><span className="font-semibold">From:</span> {booking.pickupLocation}</p>
            <p><span className="font-semibold">To:</span> {booking.dropoffLocation}</p>
            <p><span className="font-semibold">Vehicle:</span> {booking.vehicleType}</p>
        </div>

        <button
          onClick={onNewBooking}
          className="mt-8 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition duration-300"
        >
          Make Another Booking
        </button>
    </div>
  );
};

export default ConfirmationScreen;
