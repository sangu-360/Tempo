// Fix: Implementing the FareInputModal component for fare submission.
// This replaces placeholder content with a functional modal form.
import React, { useState } from 'react';

interface FareInputModalProps {
  onSubmit: (fare: number) => void;
  onClose: () => void;
  title: string;
  actionText: string;
}

const FareInputModal: React.FC<FareInputModalProps> = ({ onSubmit, onClose, title, actionText }) => {
  const [fare, setFare] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fareNumber = parseFloat(fare);
    if (isNaN(fareNumber) || fareNumber <= 0) {
      setError('Please enter a valid fare amount.');
      return;
    }
    onSubmit(fareNumber);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <label htmlFor="fare" className="block text-sm font-medium text-gray-700 mb-1">
            Fare Amount (₹)
          </label>
          <input
            type="number"
            id="fare"
            value={fare}
            onChange={(e) => setFare(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            placeholder="e.g., 550"
            required
            min="1"
          />
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark transition"
            >
              {actionText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FareInputModal;