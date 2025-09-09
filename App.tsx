import React, { useState } from 'react';
// FIX: Import BookingStatus enum to use its members.
import { AppScreen, UserRole, BookingStatus } from './types';
import type { BaseUser, Booking, Driver } from './types';
import { ADMINS, CUSTOMERS, DRIVERS } from './constants';

import LoginScreen from './components/LoginScreen';
import CustomerDashboard from './components/CustomerDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import { TruckIcon } from './components/icons/TruckIcon';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [loggedInUser, setLoggedInUser] = useState<BaseUser | null>(null);
  
  const [drivers, setDrivers] = useState<Driver[]>(DRIVERS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (id: string, role: UserRole) => {
    setError(null);
    let user: BaseUser | Driver | undefined;
    
    if (role === UserRole.CUSTOMER) user = CUSTOMERS.find(c => c.id === id);
    if (role === UserRole.ADMIN) user = ADMINS.find(a => a.id === id);
    if (role === UserRole.DRIVER) {
        const driver = drivers.find(d => d.id === id);
        if (driver && !driver.isAuthorized) {
            setError('Unauthorized access. Please contact an admin.');
            return;
        }
        user = driver;
    }

    if (user) {
      setLoggedInUser(user);
      if (user.role === UserRole.CUSTOMER) setScreen(AppScreen.CUSTOMER_DASHBOARD);
      if (user.role === UserRole.DRIVER) setScreen(AppScreen.DRIVER_DASHBOARD);
      if (user.role === UserRole.ADMIN) setScreen(AppScreen.ADMIN_DASHBOARD);
    } else {
      setError('Invalid ID. Please try again.');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setScreen(AppScreen.LOGIN);
    setError(null);
  };

  const handleBookingRequest = (bookingDetails: Omit<Booking, 'id' | 'status' | 'customerId' | 'assignedDriver'>) => {
    if (!loggedInUser) return;
    const newBooking: Booking = {
      ...bookingDetails,
      id: Date.now(),
      // FIX: Use BookingStatus enum member instead of string literal to resolve type error.
      status: BookingStatus.PENDING,
      customerId: loggedInUser.id,
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const handleAcceptBooking = (bookingId: number) => {
    if (!loggedInUser || loggedInUser.role !== UserRole.DRIVER) return;
    const driver = drivers.find(d => d.id === loggedInUser.id);
    if (!driver) return;

    setBookings(prevBookings =>
      prevBookings.map(b =>
        // FIX: Use BookingStatus enum member instead of string literal to resolve type error.
        b.id === bookingId ? { ...b, status: BookingStatus.ACCEPTED, assignedDriver: driver } : b
      )
    );
  };
  
    const handleAddDriver = (newDriver: Omit<Driver, 'role' | 'isAuthorized' | 'imageUrl'> & {imageUrl?: string}) => {
    const fullDriver: Driver = {
        ...newDriver,
        imageUrl: newDriver.imageUrl || `https://i.pravatar.cc/150?u=${newDriver.id}`,
        role: UserRole.DRIVER,
        isAuthorized: true
    };
    setDrivers(prev => [...prev, fullDriver]);
    alert(`Driver ${fullDriver.name} added successfully!`);
  };


  const renderContent = () => {
    switch (screen) {
      case AppScreen.CUSTOMER_DASHBOARD:
        return loggedInUser && (
            <CustomerDashboard 
                customer={loggedInUser}
                bookings={bookings.filter(b => b.customerId === loggedInUser.id)}
                onBookingRequest={handleBookingRequest}
                onLogout={handleLogout}
            />
        );
      case AppScreen.DRIVER_DASHBOARD:
        return loggedInUser && (
            <DriverDashboard
                driver={loggedInUser as Driver}
                bookings={bookings}
                onAcceptBooking={handleAcceptBooking}
                onLogout={handleLogout}
            />
        );
      case AppScreen.ADMIN_DASHBOARD:
          return loggedInUser && (
              <AdminDashboard 
                drivers={drivers}
                onAddDriver={handleAddDriver}
                onLogout={handleLogout}
              />
          );
      case AppScreen.LOGIN:
      default:
        return <LoginScreen onLogin={handleLogin} error={error} />;
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <header className="flex items-center justify-center mb-6">
          <TruckIcon className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-bold text-gray-800 ml-3">TempoGo</h1>
        </header>
        <main className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-500 min-h-[480px]">
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