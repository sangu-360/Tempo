
import React, { useState } from 'react';
import type { BookingDetails } from '../types';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface BookingFormProps {
  onBookingRequest: (details: BookingDetails) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingRequest }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Partial<BookingDetails>>({});

  const validateForm = () => {
    const newErrors: Partial<BookingDetails> = {};
    if (!pickup.trim()) newErrors.pickup = 'Pickup location is required.';
    if (!dropoff.trim()) newErrors.dropoff = 'Drop-off location is required.';
    if (!name.trim()) newErrors.name = 'Your name is required.';
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onBookingRequest({ pickup, dropoff, name, phone });
    }
  };

  const InputField = ({ id, label, value, onChange, placeholder, error, IconComponent }: { id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, error?: string, IconComponent: React.ElementType }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconComponent className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Book a Tempo Instantly</h2>
      <form onSubmit={handleSubmit} noValidate>
        <InputField id="pickup" label="Pickup Location" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Enter pickup address" error={errors.pickup} IconComponent={LocationPinIcon} />
        <InputField id="dropoff" label="Drop-off Location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Enter drop-off address" error={errors.dropoff} IconComponent={LocationPinIcon} />
        <InputField id="name" label="Your Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., John Doe" error={errors.name} IconComponent={UserIcon} />
        <InputField id="phone" label="Your Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 12345 67890" error={errors.phone} IconComponent={PhoneIcon} />
        
        <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition duration-300 ease-in-out mt-4">
          Find Driver
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
