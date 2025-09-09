import React, { useState } from 'react';
import type { Booking } from '../types';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface BookingFormProps {
  customerName: string;
  onBookingRequest: (details: Omit<Booking, 'id' | 'status' | 'customerId' | 'assignedDriver'>) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ customerName, onBookingRequest }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Booking, 'id'|'status'|'customerId'|'assignedDriver'|'customerName'>, string>>>({});
  
  const getLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  const validateForm = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!pickup.trim()) newErrors.pickup = 'Pickup location is required.';
    if (!dropoff.trim()) newErrors.dropoff = 'Drop-off location is required.';
    if (!customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required.';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid phone number.';
    }
    if (!bookingTime) {
        newErrors.bookingTime = 'Booking time is required.';
    } else if (new Date(bookingTime) < new Date()) {
        newErrors.bookingTime = 'Booking time cannot be in the past.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onBookingRequest({ pickup, dropoff, customerName, customerPhone, bookingTime });
    }
  };

  const InputField = ({ id, label, value, onChange, placeholder, error, IconComponent, type = "text", min }: { id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, error?: string, IconComponent?: React.ElementType, type?: string, min?: string }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        {IconComponent && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconComponent className="h-5 w-5 text-gray-400" />
        </div>}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          className={`w-full ${IconComponent ? 'pl-10' : 'pl-3'} pr-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition`}
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
        <InputField id="phone" label="Your Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+91 12345 67890" error={errors.customerPhone} IconComponent={PhoneIcon} />
        <InputField id="bookingTime" label="Pickup Time" type="datetime-local" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} placeholder="" error={errors.bookingTime} min={getLocalDateTime()} />

        <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition duration-300 ease-in-out mt-4">
          Find Driver
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
