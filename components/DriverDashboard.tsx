// Fix: Implementing the DriverDashboard to allow drivers to view and manage jobs.
// This replaces the placeholder content.
import React, { useState } from 'react';
import { Driver, Booking, BookingStatus } from '../types';
import MapModal from './MapModal';

interface DriverDashboardProps {
  driver: Driver;
  bookings: Booking[]; // Mix of pending and assigned to this driver
  onUpdateBooking: (booking: Booking) => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ driver, bookings, onUpdateBooking }) => {
  const [isMapVisible, setMapVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const availableJobs = bookings.filter(b => b.status === BookingStatus.PENDING);
  const myJobs = bookings.filter(b => b.driverId === driver.id);
  
  const handleAcceptJob = (booking: Booking) => {
    onUpdateBooking({ ...booking, driverId: driver.id, status: BookingStatus.ACCEPTED });
  };

  const handleUpdateJobStatus = (booking: Booking, status: BookingStatus) => {
    let fare: number | undefined = booking.fare;
    if (status === BookingStatus.COMPLETED && !fare) {
        // Simple fare calculation for demo
        fare = Math.floor(Math.random() * (1000 - 300 + 1) + 300);
    }
    onUpdateBooking({ ...booking, status, fare });
  };
  
  const openMap = (booking: Booking) => {
      setSelectedBooking(booking);
      setMapVisible(true);
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

  const renderJobCard = (job: Booking, isAvailable: boolean) => (
    <li key={job.id} className="bg-white p-4 border rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-gray-800 text-lg">
                {job.pickupLocation} <span className="text-gray-500">to</span> {job.dropoffLocation}
            </p>
            {!isAvailable && (
                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusChipColor(job.status)}`}>
                    {job.status}
                </span>
            )}
        </div>
        <p className="text-sm text-gray-500">Vehicle: {job.vehicleType} | Customer ID: {job.customerId}</p>
        
        <div className="mt-4 flex space-x-2">
             <button onClick={() => openMap(job)} className="text-sm text-primary hover:underline">View Route</button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
            {isAvailable && (
                <button onClick={() => handleAcceptJob(job)} className="px-4 py-2 text-sm font-bold text-white bg-success rounded-lg hover:bg-opacity-90 transition">
                    Accept Job
                </button>
            )}
            {!isAvailable && job.status === BookingStatus.ACCEPTED && (
                <button onClick={() => handleUpdateJobStatus(job, BookingStatus.IN_PROGRESS)} className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-dark transition">
                    Start Trip
                </button>
            )}
             {!isAvailable && job.status === BookingStatus.IN_PROGRESS && (
                <button onClick={() => handleUpdateJobStatus(job, BookingStatus.COMPLETED)} className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-dark transition">
                    Mark as Completed
                </button>
            )}
        </div>
    </li>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Jobs</h2>
        {availableJobs.length > 0 ? (
          <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
            {availableJobs.map(job => renderJobCard(job, true))}
          </ul>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
            No available jobs right now.
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Current Jobs</h2>
        {myJobs.length > 0 ? (
          <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
            {myJobs.map(job => renderJobCard(job, false))}
          </ul>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
            You have no active jobs.
          </div>
        )}
      </div>
      {isMapVisible && selectedBooking && (
        <MapModal
            booking={selectedBooking}
            onClose={() => setMapVisible(false)}
        />
      )}
    </div>
  );
};

export default DriverDashboard;
