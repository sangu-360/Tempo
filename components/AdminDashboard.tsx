// Fix: Implementing the AdminDashboard to provide a system-wide view and management tools.
// This replaces the placeholder content.
import React from 'react';
import { Booking, Driver, BookingStatus } from '../types';
import DriverForm from './DriverForm';
import { PhoneIcon } from './icons/PhoneIcon';

interface AdminDashboardProps {
  allBookings: Booking[];
  allDrivers: Driver[];
  onAddDriver: (driverData: Omit<Driver, 'id' | 'role'>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ allBookings, allDrivers, onAddDriver }) => {
    
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
    
    const formatTime = (time: string) => {
        if (!time) return 'N/A';
        try {
            return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        } catch {
            return time; // Fallback for invalid time format
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Column 1: Add Driver Form & Driver List */}
            <div className="lg:col-span-1 space-y-8">
                <DriverForm onSubmit={onAddDriver} />
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">All Drivers ({allDrivers.length})</h3>
                    <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                        {allDrivers.map(driver => (
                            <li key={driver.id} className="p-3 border rounded-md hover:bg-gray-50">
                                <p className="font-semibold">{driver.name} <span className="text-sm font-normal text-gray-500">({driver.id})</span></p>
                                <p className="text-sm text-gray-600">{driver.vehicleDetails}</p>
                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                                    {driver.phone}
                                </p>
                                <p className={`text-sm font-medium mt-1 ${driver.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                    {driver.isAvailable ? 'Available' : 'On a trip'}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Column 2: All Bookings List */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">System-Wide Bookings ({allBookings.length})</h2>
                <div className="max-h-[80vh] overflow-y-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3">ID</th>
                                <th scope="col" className="px-4 py-3">Time</th>
                                <th scope="col" className="px-4 py-3">Customer</th>
                                <th scope="col" className="px-4 py-3">Driver</th>
                                <th scope="col" className="px-4 py-3">Route</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3">Fare</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allBookings.slice().reverse().map(booking => (
                                <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium text-gray-900">{booking.id}</td>
                                    <td className="px-4 py-2">{formatTime(booking.pickupTime || '')}</td>
                                    <td className="px-4 py-2">{booking.customerId}</td>
                                    <td className="px-4 py-2">{booking.driverId || 'N/A'}</td>
                                    <td className="px-4 py-2">{booking.pickupLocation} to {booking.dropoffLocation}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusChipColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 font-semibold">{booking.fare ? `₹${booking.fare}` : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;