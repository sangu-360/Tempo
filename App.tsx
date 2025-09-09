// Fix: Implemented the main App component to manage state, routing, and authentication.
// This replaces the placeholder content and fixes the module resolution error in index.tsx.
import React, { useState } from 'react';
import { User, UserRole, Booking, Driver } from './types';
import { USERS, DRIVERS, BOOKINGS, ADMIN_PASSWORD } from './constants';
import { generateId, sleep } from './utils';

import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import CustomerDashboard from './components/CustomerDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import { TempoGoLogo } from './components/icons/TempoGoLogo';
import { LogoutIcon } from './components/icons/LogoutIcon';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'welcome' | 'login' | 'dashboard'>('welcome');
  const [error, setError] = useState<string | null>(null);

  // State managed by the "backend" (App component)
  const [users, setUsers] = useState<User[]>(USERS);
  const [drivers, setDrivers] = useState<Driver[]>(DRIVERS);
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);

  const handleLogin = async (id: string, role: UserRole, password?: string) => {
    await sleep(500); // Simulate network delay
    setError(null);
    if (role === UserRole.ADMIN) {
      if (id === 'admin' && password === ADMIN_PASSWORD) {
        const adminUser = users.find(u => u.id === 'admin');
        if (adminUser) {
          setCurrentUser(adminUser);
          setView('dashboard');
        }
      } else {
        setError("Invalid admin credentials.");
      }
      return;
    }

    const user = users.find(u => u.id === id && u.role === role);
    if (user) {
      setCurrentUser(user);
      setView('dashboard');
    } else {
      setError(`No ${role} found with that ID. Please check the ID or register.`);
    }
  };

  const handleRegister = async (newUser: { id: string, name: string }) => {
    await sleep(500);
    setError(null);
    if (users.some(u => u.id === newUser.id)) {
        setError("This Login ID is already taken. Please choose another one.");
        return;
    }
    const customer: User = { ...newUser, role: UserRole.CUSTOMER };
    setUsers([...users, customer]);
    setCurrentUser(customer);
    setView('dashboard');
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
  };
  
  const handleGetStarted = () => {
    setView('login');
  };

  const handleNewBooking = (newBookingData: Omit<Booking, 'id' | 'customerId' | 'status'>) => {
    if(!currentUser) return;
    const newBooking: Booking = {
      ...newBookingData,
      id: generateId('BK'),
      customerId: currentUser.id,
      status: 'pending',
    };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
     setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };
  
  const handleAddDriver = (newDriverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...newDriverData,
      id: generateId('DR'),
    };
    const newUser: User = {
        id: newDriver.id,
        name: newDriver.name,
        role: UserRole.DRIVER,
    }
    setDrivers(prev => [...prev, newDriver]);
    setUsers(prev => [...prev, newUser]);
  }

  const renderDashboard = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case UserRole.CUSTOMER:
        return <CustomerDashboard 
                    user={currentUser} 
                    bookings={bookings.filter(b => b.customerId === currentUser.id)}
                    onNewBooking={handleNewBooking}
                />;
      case UserRole.DRIVER:
        return <DriverDashboard 
                    driver={drivers.find(d => d.id === currentUser.id)!} 
                    bookings={bookings.filter(b => b.driverId === currentUser.id || b.status === 'pending')}
                    onUpdateBooking={handleUpdateBooking}
                />;
      case UserRole.ADMIN:
        return <AdminDashboard 
                    allBookings={bookings}
                    allDrivers={drivers}
                    onAddDriver={handleAddDriver}
                />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TempoGoLogo className="h-8 w-8 text-primary"/>
            <span className="text-xl font-bold text-gray-700">TempoGo</span>
          </div>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {currentUser.name}!</span>
              <button 
                onClick={handleLogout} 
                className="flex items-center text-gray-500 hover:text-primary transition-colors"
                title="Logout"
              >
                <LogoutIcon className="h-6 w-6"/>
              </button>
            </div>
          )}
        </nav>
      </header>
      <main className="container mx-auto p-6">
        {view === 'welcome' && <WelcomeScreen onGetStarted={handleGetStarted} />}
        {view === 'login' && <LoginScreen onLogin={handleLogin} onRegister={handleRegister} error={error} />}
        {view === 'dashboard' && renderDashboard()}
      </main>
    </div>
  );
};

export default App;
