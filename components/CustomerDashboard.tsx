import React from 'react';
import type { BaseUser, Booking } from '../types';
import BookingForm from './BookingForm';
import LoadingScreen from './LoadingScreen';
import ConfirmationScreen from './ConfirmationScreen';
import { LogoutIcon } from './icons/LogoutIcon';

interface CustomerDashboardProps {
  customer: BaseUser;
  bookings: Booking[];
  onBookingRequest: (details: Omit<Booking, 'id' | 'status' | 'customerId' | 'assignedDriver'>) => void;
  onLogout: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ customer, bookings, onBookingRequest, onLogout }) => {
  const activeBooking = bookings.find(b => b.status === 'PENDING' || b.status === 'ACCEPTED');

  const handleNewBooking = () => {
    // In a real app, this would change booking status to COMPLETED or CANCELLED
    // For this simulation, we'll just allow creating a new one.
    // This is a simplification. A real app would need a more robust state machine.
    window.location.reload(); // Simple way to reset state for demo
  }

  const renderContent = () => {
    if (activeBooking) {
      if (activeBooking.status === 'PENDING') {
        return <LoadingScreen />;
      }
      if (activeBooking.status === 'ACCEPTED') {
        return <ConfirmationScreen booking={activeBooking} onNewBooking={handleNewBooking} />;
      }
    }
    return <BookingForm customerName={customer.name} onBookingRequest={onBookingRequest} />;
  };

  return (
    <div className="animate-fade-in">
        <header className="flex justify-between items-center mb-4 pb-2 border-b">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Hi, {customer.name}!</h2>
                <p className="text-sm text-gray-500">Ready to book your tempo?</p>
            </div>
            <button onClick={onLogout} className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors">
                <LogoutIcon className="w-5 h-5 mr-1" />
                Logout
            </button>
        </header>
        {renderContent()}
    </div>
  );
};

export default CustomerDashboard;
