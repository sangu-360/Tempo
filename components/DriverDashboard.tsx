import React, { useState } from 'react';
import { Driver, Booking, BookingStatus } from '../types';
import FareInputModal from './FareInputModal';
import { LocationPinIcon } from './icons/LocationPinIcon';

interface DriverDashboardProps {
  driver: Driver;
  bookings: Booking[];
  onProposeFare: (bookingId: string, driverId: string, fare: number) => void;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
}

// Fix: Implementing the DriverDashboard to manage driver-specific tasks.
// This resolves the "Cannot find name" errors for this component.
const DriverDashboard: React.FC<DriverDashboardProps> = ({ driver, bookings, onProposeFare, onUpdateBookingStatus }) => {
  const [bookingToProposeFare, setBookingToProposeFare] = useState<Booking | null>(null);

  const pendingRequests = bookings.filter(b => b.status === BookingStatus.PENDING && !b.driverId);
  const activeBooking = bookings.find(b => b.driverId === driver.id && (b.status === BookingStatus.ACCEPTED || b.status === BookingStatus.IN_PROGRESS));
  const pastBookings = bookings.filter(b => b.driverId === driver.id && (b.status === BookingStatus.COMPLETED || b.status === BookingStatus.CANCELLED));

  const handleFareSubmit = (fare: number) => {
    if (bookingToProposeFare) {
      onProposeFare(bookingToProposeFare.id, driver.id, fare);
      setBookingToProposeFare(null);
    }
  };

  const renderBookingCard = (booking: Booking, type: 'pending' | 'active') => (
    <li key={booking.id} className="p-4 bg-white border rounded-lg shadow-sm">
      <p className="font-bold text-gray-700">Booking #{booking.id}</p>
      <div className="text-sm text-gray-600 mt-2 space-y-1">
        <p><span className="font-semibold">From:</span> {booking.pickupLocation}</p>
        <p><span className="font-semibold">To:</span> {booking.dropoffLocation}</p>
      </div>
      <div className="mt-4 pt-3 border-t">
        {type === 'pending' && (
            <button
              onClick={() => setBookingToProposeFare(booking)}
              className="w-full text-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark transition"
            >
              Propose Fare
            </button>
        )}
        {type === 'active' && booking.status === BookingStatus.ACCEPTED && (
           <button
             onClick={() => onUpdateBookingStatus(booking.id, BookingStatus.IN_PROGRESS)}
             className="w-full text-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
           >
             Start Trip
           </button>
        )}
         {type === 'active' && booking.status === BookingStatus.IN_PROGRESS && (
           <button
             onClick={() => onUpdateBookingStatus(booking.id, BookingStatus.COMPLETED)}
             className="w-full text-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition"
           >
             Complete Trip
           </button>
        )}
      </div>
    </li>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Active Booking */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Trip</h2>
        {activeBooking ? (
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <p className="font-bold text-blue-800 text-lg">Booking #{activeBooking.id}</p>
                 <div className="text-sm text-blue-700 mt-3 space-y-2">
                    <p><span className="font-semibold">Status:</span> <span className="font-bold uppercase">{activeBooking.status.replace('_', ' ')}</span></p>
                    <p><span className="font-semibold">Customer ID:</span> {activeBooking.customerId}</p>
                    <p><span className="font-semibold">From:</span> {activeBooking.pickupLocation}</p>
                    <p><span className="font-semibold">To:</span> {activeBooking.dropoffLocation}</p>
                    <p className="font-bold text-green-600 text-lg pt-2">Fare: ₹{activeBooking.fare}</p>
                </div>
                <div className="mt-4">
                  {activeBooking.status === BookingStatus.ACCEPTED && (
                     <button onClick={() => onUpdateBookingStatus(activeBooking.id, BookingStatus.IN_PROGRESS)} className="w-full text-center py-2 px-4 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition">Start Trip</button>
                  )}
                   {activeBooking.status === BookingStatus.IN_PROGRESS && (
                     <button onClick={() => onUpdateBookingStatus(activeBooking.id, BookingStatus.COMPLETED)} className="w-full text-center py-2 px-4 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition">Complete Trip</button>
                  )}
                </div>
            </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">You have no active trip.</p>
          </div>
        )}
      </div>
      
      {/* Pending Requests */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Requests</h2>
        <div className="max-h-[80vh] overflow-y-auto">
            {pendingRequests.length > 0 ? (
              <ul className="space-y-4">
                {pendingRequests.map(b => renderBookingCard(b, 'pending'))}
              </ul>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No new booking requests at the moment.</p>
              </div>
            )}
        </div>
      </div>

      {/* Past Bookings */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip History</h2>
        <div className="max-h-[80vh] overflow-y-auto bg-white p-4 rounded-lg shadow-sm">
            {pastBookings.length > 0 ? (
              <ul className="space-y-3">
                {pastBookings.slice().reverse().map(b => (
                    <li key={b.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-gray-700">#{b.id}</p>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${b.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {b.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 truncate">{b.pickupLocation} to {b.dropoffLocation}</p>
                        <p className="text-sm font-bold text-gray-800 mt-1">Fare: ₹{b.fare}</p>
                    </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">You have no past trips.</p>
            )}
        </div>
      </div>

      {bookingToProposeFare && (
        <FareInputModal
          onSubmit={handleFareSubmit}
          onClose={() => setBookingToProposeFare(null)}
          title={`Propose Fare for Booking #${bookingToProposeFare.id}`}
          actionText="Submit Proposal"
        />
      )}
    </div>
  );
};

export default DriverDashboard;
