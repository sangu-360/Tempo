import React from 'react';
import type { Booking, Driver } from '../types';
import { LogoutIcon } from './icons/LogoutIcon';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface DriverDashboardProps {
  driver: Driver;
  bookings: Booking[];
  onAcceptBooking: (bookingId: number) => void;
  onLogout: () => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ driver, bookings, onAcceptBooking, onLogout }) => {
    const pendingBookings = bookings.filter(b => b.status === 'PENDING');
    const myJob = bookings.find(b => b.assignedDriver?.id === driver.id && b.status === 'ACCEPTED');

    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-4 pb-2 border-b">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Welcome, {driver.name}</h2>
                    <p className="text-sm text-gray-500">Here are the available jobs.</p>
                </div>
                <button onClick={onLogout} className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors">
                    <LogoutIcon className="w-5 h-5 mr-1" />
                    Logout
                </button>
            </header>

            {myJob && (
                 <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Your Current Job</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Customer:</strong> {myJob.customerName}</p>
                        <p className="flex items-center"><PhoneIcon className="w-4 h-4 mr-2" /><a href={`tel:${myJob.customerPhone}`} className="text-primary hover:underline">{myJob.customerPhone}</a></p>
                        <p><strong>From:</strong> {myJob.pickup}</p>
                        <p><strong>To:</strong> {myJob.dropoff}</p>
                        <p><strong>Time:</strong> {new Date(myJob.bookingTime).toLocaleString()}</p>
                    </div>
                </div>
            )}
            
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Jobs ({pendingBookings.length})</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {pendingBookings.length > 0 ? (
                        pendingBookings.map(booking => (
                            <div key={booking.id} className="p-3 bg-slate-50 border rounded-lg">
                                <p className="font-semibold">{booking.customerName}</p>
                                <p className="text-sm text-gray-500 flex items-center mt-1"><LocationPinIcon className="w-4 h-4 mr-1"/>{booking.pickup} to {booking.dropoff}</p>
                                <p className="text-sm text-gray-500 mt-1">Time: {new Date(booking.bookingTime).toLocaleTimeString()}</p>
                                <button
                                    onClick={() => onAcceptBooking(booking.id)}
                                    disabled={!!myJob}
                                    className="w-full mt-3 bg-success text-white font-bold py-2 px-3 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Accept Job
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No pending jobs right now.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
