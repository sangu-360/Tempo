// Fix: Implementing a MapModal component to display a placeholder route map.
// This replaces the placeholder content.
import React from 'react';
import { Booking } from '../types';

interface MapModalProps {
  booking: Booking;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ booking, onClose }) => {
  // In a real app, this would use Google Maps API or similar.
  // For this demo, we'll use a static image placeholder.
  const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&maptype=roadmap&markers=color:blue|label:A|${encodeURIComponent(booking.pickupLocation)}&markers=color:green|label:B|${encodeURIComponent(booking.dropoffLocation)}&key=YOUR_API_KEY_HERE`;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-4">
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <h3 className="text-xl font-semibold text-gray-800">Route Map</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <p className="mb-2"><span className="font-semibold">From:</span> {booking.pickupLocation}</p>
          <p className="mb-4"><span className="font-semibold">To:</span> {booking.dropoffLocation}</p>
          <div className="bg-gray-200 h-64 flex items-center justify-center rounded">
            <p className="text-gray-500">Map placeholder</p>
            {/* <img src={mapImageUrl} alt="Route map" className="w-full h-full object-cover rounded"/>
               Note: The static map URL requires an API key and billing to be set up.
               Using a placeholder for this demo to avoid exposing keys.
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
