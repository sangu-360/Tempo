
import React, { useState, useEffect, useCallback } from 'react';
import type { BookingDetails, Driver } from './types';
import { AppStatus } from './types';
import { DRIVERS } from './constants';
import BookingForm from './components/BookingForm';
import LoadingScreen from './components/LoadingScreen';
import ConfirmationScreen from './components/ConfirmationScreen';
import { TruckIcon } from './components/icons/TruckIcon';


const App: React.FC = () => {
  const [appStatus, setAppStatus] = useState<AppStatus>(AppStatus.FORM);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [assignedDriver, setAssignedDriver] = useState<Driver | null>(null);

  const handleBookingRequest = (details: BookingDetails) => {
    setBookingDetails(details);
    setAppStatus(AppStatus.LOADING);
  };

  const findDriver = useCallback(() => {
    // Simulate finding and assigning a driver
    setTimeout(() => {
      const randomDriver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
      setAssignedDriver(randomDriver);
      setAppStatus(AppStatus.CONFIRMED);
    }, 4000); // Total loading time
  }, []);

  useEffect(() => {
    if (appStatus === AppStatus.LOADING) {
      findDriver();
    }
  }, [appStatus, findDriver]);

  const handleNewBooking = () => {
    setAppStatus(AppStatus.FORM);
    setBookingDetails(null);
    setAssignedDriver(null);
  };

  const renderContent = () => {
    switch (appStatus) {
      case AppStatus.LOADING:
        return <LoadingScreen />;
      case AppStatus.CONFIRMED:
        return (
          assignedDriver && bookingDetails && (
            <ConfirmationScreen
              driver={assignedDriver}
              bookingDetails={bookingDetails}
              onNewBooking={handleNewBooking}
            />
          )
        );
      case AppStatus.FORM:
      default:
        return <BookingForm onBookingRequest={handleBookingRequest} />;
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <header className="flex items-center justify-center mb-6">
          <TruckIcon className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-bold text-gray-800 ml-3">TempoGo</h1>
        </header>
        <main className="bg-white rounded-2xl shadow-2xl p-8 transition-all duration-500">
          {renderContent()}
        </main>
         <footer className="text-center mt-6 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} TempoGo. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
