// Fix: Implementing the CustomerDashboard to provide the main UI for customer users.
// It manages the booking flow and displays booking history.
import React, { useState } from 'react';
import { User, Booking, BookingStatus } from '../types';
import BookingForm from './BookingForm';
import LoadingScreen from './LoadingScreen';
import ConfirmationScreen from './ConfirmationScreen';
import { sleep } from '../utils';

interface CustomerDashboardProps {
  user: User;
  bookings: Booking[];
  onNewBooking: (bookingData: Omit<Booking, 'id' | 'customerId' | 'status'>) => Booking;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, bookings, onNewBooking }) => {
  type View = 'form' | 'loading' | 'confirmation';
  const [view, setView] = useState<View>('form');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const handleBookingSubmit = async (bookingData: Omit<Booking, 'id' | 'customerId' | 'status'>) => {
    setView('loading');
    await sleep(3000); // Simulate finding a driver
    const newBooking = onNewBooking(bookingData);
    setConfirmedBooking(newBooking);
    setView('confirmation');
  };

  const handleStartNewBooking = () => {
      setConfirmedBooking(null);
      setView('form');
  }

  const renderCurrentView = () => {
    switch(view) {
      case 'form':
        return <BookingForm onSubmit={handleBookingSubmit} />;
      case 'loading':
        return <LoadingScreen />;
      case 'confirmation':
        if (confirmedBooking) {
            return <ConfirmationScreen booking={confirmedBooking} onNewBooking={handleStartNewBooking} />;
        }
        return null; // Should not happen
      default:
        return <BookingForm onSubmit={handleBookingSubmit} />;
    }
  }
  
  const getStatusChipColor = (status: BookingStatus) => {
    switch(status) {
        case BookingStatus.COMPLETED: return 'bg-green-100 text-green-800';
        case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case BookingStatus.ACCEPTED: return 'bg-blue-100 text-blue-800';
        case BookingStatus.IN_PROGRESS: return 'bg-indigo-100 text-indigo-800';
        case BookingStatus.CANCELLED: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
                {renderCurrentView()}
            </div>
            <div className="lg:col-span-1">
                 <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
                    {bookings.length > 0 ? (
                        <ul className="space-y-4 max-h-[400px] overflow-y-auto">
                            {bookings.slice().reverse().map(booking => (
                                <li key={booking.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-700">{booking.pickupLocation} to {booking.dropoffLocation}</p>
                                            <p className="text-sm text-gray-500">ID: {booking.id} | {booking.vehicleType}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusChipColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    {booking.driverId && <p className="text-sm text-gray-500 mt-1">Driver ID: {booking.driverId}</p>}
                                    {booking.fare && <p className="font-semibold text-gray-800 mt-1">₹{booking.fare}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">You have no bookings yet.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default CustomerDashboard;
