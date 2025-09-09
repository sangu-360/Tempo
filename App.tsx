import React, { useState, useEffect } from 'react';
import { User, UserRole, Driver, Booking, BookingStatus } from './types';
import { USERS, DRIVERS, BOOKINGS, ADMIN_PASSWORD } from './constants';
import { generateId } from './utils';
import LoginScreen from './components/LoginScreen';
import CustomerDashboard from './components/CustomerDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import { TempoGoLogo } from './components/icons/TempoGoLogo';
import { LogoutIcon } from './components/icons/LogoutIcon';

type AppView = 'WELCOME' | 'LOGIN' | 'DASHBOARD';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('WELCOME');
  const [users, setUsers] = useState<User[]>(USERS);
  const [drivers, setDrivers] = useState<Driver[]>(DRIVERS);
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [currentUser, setCurrentUser] = useState<User | Driver | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = (id: string, role: UserRole, password?: string) => {
    setLoginError(null);
    let user: User | Driver | undefined;
    
    if (role === UserRole.DRIVER) {
      user = drivers.find(d => d.id === id);
    } else {
      user = users.find(u => u.id === id && u.role === role);
    }

    if (role === UserRole.ADMIN && (!user || password !== ADMIN_PASSWORD)) {
        setLoginError('Invalid admin ID or password.');
        return;
    }

    if (user) {
      setCurrentUser(user);
      setView('DASHBOARD');
    } else {
      setLoginError('Invalid login credentials for the selected role.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('WELCOME');
  };

  const handleRegister = (newUser: { id: string, name: string, phone: string }) => {
    setLoginError(null);
    if (users.some(u => u.id === newUser.id) || drivers.some(d => d.id === newUser.id)) {
        setLoginError('This Login ID is already taken. Please choose another.');
        return;
    }
    const user: User = { ...newUser, role: UserRole.CUSTOMER };
    setUsers(prev => [...prev, user]);
    setCurrentUser(user);
    setView('DASHBOARD');
  };
  
  const handleAddDriver = (driverData: Omit<Driver, 'id' | 'role'>) => {
    const firstName = driverData.name.split(' ')[0].toLowerCase();
    const randomDigits = Math.floor(100 + Math.random() * 900); // 100-999
    const newDriver: Driver = {
        ...driverData,
        id: `${firstName}${randomDigits}`,
        role: UserRole.DRIVER,
    };
    setDrivers(prev => [...prev, newDriver]);
  };

  const handleBookRide = (bookingData: Omit<Booking, 'id' | 'customerId' | 'status'>) => {
    if (!currentUser) return;
    
    const newBooking: Booking = {
      id: generateId('BK'),
      customerId: currentUser.id,
      status: BookingStatus.PENDING,
      ...bookingData,
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const handleProposeFare = (bookingId: string, driverId: string, fare: number) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, driverId, fare, status: BookingStatus.DRIVER_FOUND } : b
    ));
  };
  
  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => {
        const bookingToUpdate = prev.find(b => b.id === bookingId);
        if (!bookingToUpdate) return prev;

        setDrivers(d => d.map(driver => {
            if (driver.id === bookingToUpdate.driverId) {
                const isAvailable = status === BookingStatus.COMPLETED || status === BookingStatus.CANCELLED;
                return { ...driver, isAvailable };
            }
            return driver;
        }));

        return prev.map(b => b.id === bookingId ? { ...b, status } : b);
    });
  };

  const handleRejectFare = (bookingId: string) => {
     setBookings(prev => prev.map(b => 
        b.id === bookingId 
        ? { ...b, status: BookingStatus.PENDING, driverId: undefined, fare: undefined } 
        : b
    ));
  };

  const renderDashboard = () => {
    if (!currentUser) return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} error={loginError} />;

    switch (currentUser.role) {
      case UserRole.CUSTOMER:
        return <CustomerDashboard 
            user={currentUser} 
            bookings={bookings.filter(b => b.customerId === currentUser.id)}
            allDrivers={drivers}
            onBookRide={handleBookRide} 
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onRejectFare={handleRejectFare}
        />;
      case UserRole.DRIVER:
        return <DriverDashboard 
            driver={currentUser as Driver} 
            bookings={bookings} 
            onProposeFare={handleProposeFare} 
            onUpdateBookingStatus={handleUpdateBookingStatus} 
        />;
      case UserRole.ADMIN:
        return <AdminDashboard 
            allBookings={bookings} 
            allDrivers={drivers}
            onAddDriver={handleAddDriver}
        />;
      default:
        return <p>Error: Unknown user role.</p>;
    }
  };

  const renderContent = () => {
    switch(view) {
        case 'WELCOME':
            return <WelcomeScreen onGetStarted={() => setView('LOGIN')} />;
        case 'LOGIN':
            return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} error={loginError} />;
        case 'DASHBOARD':
            return renderDashboard();
        default:
            return <WelcomeScreen onGetStarted={() => setView('LOGIN')} />;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <TempoGoLogo className="h-10 w-10 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-800">TempoGo</h1>
          </div>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, <span className="font-bold">{currentUser.name}</span>!</span>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition"
                title="Logout"
              >
                <LogoutIcon className="h-6 w-6" />
                <span className="hidden md:block">Logout</span>
              </button>
            </div>
          )}
        </nav>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;