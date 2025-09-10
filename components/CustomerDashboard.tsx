import React, { useState } from 'react';
import { User, Booking, BookingStatus, Driver } from '../types';
import BookingForm from './BookingForm';
import LoadingScreen from './LoadingScreen';
import ConfirmationScreen from './ConfirmationScreen';
import MapModal from './MapModal';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { UserIcon } from './icons/UserIcon';
import { ClockIcon } from './icons/ClockIcon';

interface CustomerDashboardProps {
  user: User;
  bookings: Booking[];
  allDrivers: Driver[];
  onBookRide: (bookingData: Omit<Booking, 'id' | 'customerId' | 'status'>) => Promise<boolean>;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onRejectFare: (bookingId: string) => void;
}

type ViewState = 'FORM' | 'LOADING' | 'CONFIRMED';

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, bookings, allDrivers, onBookRide, onUpdateBookingStatus, onRejectFare }) => {
  const [viewState, setViewState] = useState<ViewState>('FORM');
  const [selectedBookingForMap, setSelectedBookingForMap] = useState<Booking | null>(null);

  const activeBooking = bookings.find(b => b.status === BookingStatus.ACCEPTED || b.status === BookingStatus.IN_PROGRESS);
  const confirmedDriver = activeBooking ? allDrivers.find(d => d.id === activeBooking.driverId) : null;

  // Automatically switch to confirmed view if an active booking exists
  React.useEffect(() => {
    if (activeBooking && confirmedDriver) {
      setViewState('CONFIRMED');
    } else if (!bookings.some(b => b.status === BookingStatus.PENDING || b.status === BookingStatus.DRIVER_FOUND)) {
       setViewState('FORM');
    }
  }, [bookings, activeBooking, confirmedDriver]);

  const handleBookingSubmit = async (bookingData: { pickupLocation: string; dropoffLocation: string; pickupTime: string; }) => {
    setViewState('LOADING');
    const success = await onBookRide(bookingData);
    if (!success) {
      // If booking fails, go back to the form so the user can try again.
      setViewState('FORM');
    }
  };
  
  const formatTime = (time: string) => {
    try {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
        return time; // Fallback for invalid time format
    }
  };

  const getStatusChipColor = (status: BookingStatus) => {
    switch(status) {
        case BookingStatus.COMPLETED: return 'bg-green-100 text-green-800';
        case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case BookingStatus.DRIVER_FOUND: return 'bg-cyan-100 text-cyan-800';
        case BookingStatus.ACCEPTED: return 'bg-blue-100 text-blue-800';
        case BookingStatus.IN_PROGRESS: return 'bg-indigo-100 text-indigo-800';
        case BookingStatus.CANCELLED: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  }

  const renderCurrentState = () => {
    if (viewState === 'CONFIRMED' && activeBooking && confirmedDriver) {
        return <ConfirmationScreen booking={activeBooking} driver={confirmedDriver} />;
    }
    
    const pendingOrFoundBooking = bookings.find(b => b.status === BookingStatus.PENDING || b.status === BookingStatus.DRIVER_FOUND);

    if (pendingOrFoundBooking || viewState === 'LOADING') {
      return <LoadingScreen />;
    }

    return <BookingForm onSubmit={handleBookingSubmit} />;
  };

  const renderBookingItemContent = (booking: Booking) => {
    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            onUpdateBookingStatus(booking.id, BookingStatus.CANCELLED);
        }
    };

    if (booking.status === BookingStatus.DRIVER_FOUND && booking.driverId) {
        const proposingDriver = allDrivers.find(d => d.id === booking.driverId);
        return (
            <div className="bg-cyan-50 border border-cyan-200 p-3 rounded-md mt-3 animate-fade-in">
                <p className="font-semibold text-sm text-cyan-800">Driver Found! Waiting for your approval.</p>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-500 mr-2"/>
                        <div>
                            <p className="font-bold">{proposingDriver?.name}</p>
                            <p className="text-sm font-bold text-green-600">Proposed Fare: ₹{booking.fare}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={handleCancel} className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-md hover:bg-red-200">Cancel</button>
                        <button onClick={() => onRejectFare(booking.id)} className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-md hover:bg-red-600">Reject</button>
                        <button onClick={() => onUpdateBookingStatus(booking.id, BookingStatus.ACCEPTED)} className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-md hover:bg-green-600">Accept</button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (booking.status === BookingStatus.PENDING) {
        return (
             <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <p className="text-sm text-yellow-700">Searching for a driver...</p>
                <button 
                    onClick={handleCancel}
                    className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                    Cancel Booking
                </button>
            </div>
        )
    }

    return (
        <div className="mt-3 pt-3 border-t flex justify-between items-center">
            <p className="text-sm font-semibold">{booking.fare ? `Fare: ₹${booking.fare}` : 'Fare pending'}</p>
            <button 
                onClick={() => setSelectedBookingForMap(booking)}
                className="flex items-center text-sm text-primary hover:underline"
            >
                <LocationPinIcon className="h-4 w-4 mr-1" />
                View Route
            </button>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-1">
        {renderCurrentState()}
      </div>
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>
        <div className="max-h-[80vh] overflow-y-auto">
          {bookings.length > 0 ? (
            <ul className="space-y-4">
              {bookings.slice().reverse().map(booking => (
                <li key={booking.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-700">Booking #{booking.id}</p>
                      {booking.pickupTime && (
                         <div className="flex items-center text-sm text-gray-600 mt-1">
                            <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-semibold">{formatTime(booking.pickupTime)}</span>
                         </div>
                      )}
                      <p className="text-sm text-gray-500 mt-1">{booking.pickupLocation} to {booking.dropoffLocation}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusChipColor(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                  {renderBookingItemContent(booking)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">You have no bookings yet.</p>
          )}
        </div>
      </div>
      {selectedBookingForMap && <MapModal booking={selectedBookingForMap} onClose={() => setSelectedBookingForMap(null)} />}
    </div>
  );
};

export default CustomerDashboard;
