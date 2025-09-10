import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Driver, Booking, BookingStatus, AppNotification } from './types';
import { generateId } from './utils';
import LoginScreen from './components/LoginScreen';
import CustomerDashboard from './components/CustomerDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import Notification from './components/Notification';
import { TempoGoLogo } from './components/icons/TempoGoLogo';
import { LogoutIcon } from './components/icons/LogoutIcon';
import { supabase } from './supabase';

type AppView = 'WELCOME' | 'LOGIN' | 'DASHBOARD';
const ADMIN_PASSWORD = 'Hero@123'; // Retained from original constants
const CURRENT_USER_STORAGE_KEY = 'tempoGoCurrentUser';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('WELCOME');
  const [showLogoInHeader, setShowLogoInHeader] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<User | Driver | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Data mapping helpers to convert between snake_case (DB) and camelCase (JS)
  const mapBookingFromDb = (b: any): Booking => ({ id: b.id, customerId: b.customer_id, driverId: b.driver_id, pickupLocation: b.pickup_location, dropoffLocation: b.dropoff_location, status: b.status, fare: b.fare, pickupTime: b.pickup_time });
  const mapDriverFromDb = (d: any): Driver => ({ id: d.id, name: d.name, role: d.role, vehicleDetails: d.vehicle_details, currentLocation: d.current_location, isAvailable: d.is_available, phone: d.phone });

  const addNotification = (message: string, type: 'success' | 'info' = 'info') => {
    const newNotification: AppNotification = {
      id: Date.now(),
      message,
      type,
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const handleDbChanges = (payload: any, setter: React.Dispatch<React.SetStateAction<any[]>>, mapper?: (item: any) => any) => {
      if (payload.eventType === 'INSERT') {
          const newItem = mapper ? mapper(payload.new) : payload.new;
          setter(current => [...current, newItem]);
      } else if (payload.eventType === 'UPDATE') {
          const updatedItem = mapper ? mapper(payload.new) : payload.new;
          setter(current => current.map(item => item.id === updatedItem.id ? updatedItem : item));
      } else if (payload.eventType === 'DELETE') {
          setter(current => current.filter(item => item.id !== payload.old.id));
      }
  };

  useEffect(() => {
    // Restore session from localStorage on initial load
    try {
      const savedUserJSON = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (savedUserJSON) {
        const savedUser = JSON.parse(savedUserJSON);
        if (savedUser?.id && savedUser?.role) {
          setCurrentUser(savedUser);
          setView('DASHBOARD');
          setShowLogoInHeader(true); // Show logo immediately if logged in
        }
      }
    } catch (error) {
      console.error("Could not restore session:", error);
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }

    const fetchAllData = async () => {
      const { data: usersData, error: usersError } = await supabase.from('users').select('*');
      if (usersError) console.error('Error fetching users:', usersError); else setUsers(usersData || []);

      const { data: driversData, error: driversError } = await supabase.from('drivers').select('*');
      if (driversError) console.error('Error fetching drivers:', driversError); else setDrivers(driversData ? driversData.map(mapDriverFromDb) : []);

      const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('*');
      if (bookingsError) console.error('Error fetching bookings:', bookingsError); else setBookings(bookingsData ? bookingsData.map(mapBookingFromDb) : []);
    };

    fetchAllData();
    
    const handleBookingChange = (payload: any) => {
        handleDbChanges(payload, setBookings, mapBookingFromDb);
        const user = currentUserRef.current;
        if (!user) return;

        const newRecord = payload.new;
        const oldRecord = payload.old;
        
        // Notification for DRIVERS on new requests
        if (payload.eventType === 'INSERT' && user.role === UserRole.DRIVER && newRecord.status === BookingStatus.PENDING) {
             addNotification("A new booking request is available!", "info");
        }

        // Notification for CUSTOMERS when a driver proposes a fare
        if (payload.eventType === 'UPDATE' && newRecord.customer_id === user.id && oldRecord.status === BookingStatus.PENDING && newRecord.status === BookingStatus.DRIVER_FOUND) {
            addNotification(`Driver found for booking #${newRecord.id}! Please review the fare.`, "success");
        }

        // Notification for DRIVERS when their proposal is accepted
        if (payload.eventType === 'UPDATE' && newRecord.driver_id === user.id && oldRecord.status === BookingStatus.DRIVER_FOUND && newRecord.status === BookingStatus.ACCEPTED) {
            addNotification(`Proposal for booking #${newRecord.id} was accepted!`, "success");
        }
        
        // Notification for DRIVERS when a customer cancels a booking they bid on
        if (payload.eventType === 'UPDATE' && user.role === UserRole.DRIVER && oldRecord.driver_id === user.id && oldRecord.status === BookingStatus.DRIVER_FOUND && newRecord.status === BookingStatus.CANCELLED) {
            addNotification(`Booking #${newRecord.id} was cancelled by the customer.`, "info");
        }
    }

    const usersSubscription = supabase.channel('users-channel').on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => handleDbChanges(payload, setUsers)).subscribe();
    const driversSubscription = supabase.channel('drivers-channel').on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, (payload) => handleDbChanges(payload, setDrivers, mapDriverFromDb)).subscribe();
    const bookingsSubscription = supabase.channel('bookings-channel').on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, handleBookingChange).subscribe();

    return () => {
      supabase.removeChannel(usersSubscription);
      supabase.removeChannel(driversSubscription);
      supabase.removeChannel(bookingsSubscription);
    };
  }, []);

  const handleGetStarted = () => {
    setView('LOGIN');
    setTimeout(() => setShowLogoInHeader(true), 700); // Show logo after transition
  };

  const handleLogin = async (id: string, role: UserRole, password?: string) => {
    setLoginError(null);
    let user: User | Driver | undefined;
    
    if (role === UserRole.DRIVER) {
      const { data, error } = await supabase.from('drivers').select('*').eq('id', id).single();
      if (error || !data) { setLoginError('Invalid driver ID.'); return; }
      user = mapDriverFromDb(data);
    } else {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).eq('role', role).single();
      if (error || !data) { setLoginError('Invalid login credentials for the selected role.'); return; }
      user = data;
    }

    if (role === UserRole.ADMIN && (!user || password !== ADMIN_PASSWORD)) {
        setLoginError('Invalid admin ID or password.');
        return;
    }

    if (user) {
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      setView('DASHBOARD');
      setShowLogoInHeader(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setView('WELCOME');
    setShowLogoInHeader(false);
  };

  const handleRegister = async (newUser: { id: string, name: string, phone: string }) => {
    setLoginError(null);
    const { data: existingUser } = await supabase.from('users').select('id').eq('id', newUser.id).single();
    const { data: existingDriver } = await supabase.from('drivers').select('id').eq('id', newUser.id).single();

    if (existingUser || existingDriver) {
        setLoginError('This Login ID is already taken. Please choose another.');
        return;
    }

    const userToInsert: User = { ...newUser, role: UserRole.CUSTOMER };
    const { data, error } = await supabase.from('users').insert([userToInsert]).select().single();
    if (error) { setLoginError(`Registration failed: ${error.message}`); return; }
    
    if (data) {
      setCurrentUser(data);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(data));
      setView('DASHBOARD');
      setShowLogoInHeader(true);
    }
  };
  
  const handleAddDriver = async (driverData: Omit<Driver, 'id' | 'role'>) => {
    const firstName = driverData.name.split(' ')[0].toLowerCase();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const newDriverId = `${firstName}${randomDigits}`;
    
    const { data, error } = await supabase.from('drivers').insert([{
        id: newDriverId,
        name: driverData.name,
        phone: driverData.phone,
        vehicle_details: driverData.vehicleDetails,
        current_location: driverData.currentLocation,
        is_available: driverData.isAvailable,
    }]).select().single();

    if (error) { 
      console.error("Failed to add driver:", error);
      addNotification("Error: Could not add new driver.", "info");
      return; 
    }
    if (data) {
        const mappedDriver = mapDriverFromDb(data);
        setDrivers(current => [...current, mappedDriver]);
        addNotification(`Driver ${mappedDriver.name} added successfully.`, 'success');
    }
  };

  const handleBookRide = async (bookingData: Omit<Booking, 'id' | 'customerId' | 'status'>): Promise<boolean> => {
    if (!currentUser) return false;
    const newBooking: Booking = { id: generateId('BK'), customerId: currentUser.id, status: BookingStatus.PENDING, ...bookingData };
    
    const { data: createdBooking, error } = await supabase.from('bookings').insert([{
        id: newBooking.id,
        customer_id: newBooking.customerId,
        status: newBooking.status,
        pickup_location: newBooking.pickupLocation,
        dropoff_location: newBooking.dropoffLocation,
        pickup_time: newBooking.pickupTime,
    }]).select().single();
    
    if (error) { 
      console.error("Booking failed:", error); 
      addNotification(`Booking failed: ${error.message}`, 'info');
      return false;
    }
    if (createdBooking) {
        const mappedBooking = mapBookingFromDb(createdBooking);
        setBookings(current => [...current, mappedBooking]);
        addNotification("Booking request sent successfully!", "success");
        return true;
    }
    return false;
  };

  const handleProposeFare = async (bookingId: string, driverId: string, fare: number) => {
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({ driver_id: driverId, fare, status: BookingStatus.DRIVER_FOUND })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) { console.error("Failed to propose fare:", error); return; }
    if (updatedBooking) {
      const mappedBooking = mapBookingFromDb(updatedBooking);
      setBookings(currentBookings =>
        currentBookings.map(b => b.id === mappedBooking.id ? mappedBooking : b)
      );
      addNotification("Fare proposed successfully!", "success");
    }
  };
  
  const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    // 1. Update the booking status in the database and get the new record back.
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error || !updatedBooking) {
      console.error("Failed to update booking status:", error);
      addNotification("Error: Could not update trip status.", "info");
      return;
    }

    // 2. Now that the booking is updated, handle side-effects (like driver availability).
    const driverId = updatedBooking.driver_id;
    if (driverId) {
        let isAvailable: boolean | undefined;
        if (status === BookingStatus.ACCEPTED) {
            isAvailable = false;
        } else if (status === BookingStatus.COMPLETED || status === BookingStatus.CANCELLED) {
            isAvailable = true;
        }

        if (isAvailable !== undefined) {
            // This can be a fire-and-forget, or we can await it if it's critical.
            await supabase.from('drivers').update({ is_available: isAvailable }).eq('id', driverId);
        }
    }

    // 3. Update the local state for the current user.
    const mappedBooking = mapBookingFromDb(updatedBooking);
    setBookings(currentBookings =>
        currentBookings.map(b => b.id === mappedBooking.id ? mappedBooking : b)
    );
  };

  const handleRejectFare = async (bookingId: string) => {
     const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({ status: BookingStatus.PENDING, driver_id: null, fare: null })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) { console.error("Failed to reject fare:", error); return; }
    if (updatedBooking) {
        const mappedBooking = mapBookingFromDb(updatedBooking);
        setBookings(currentBookings =>
            currentBookings.map(b => b.id === mappedBooking.id ? mappedBooking : b)
        );
        addNotification("Fare has been rejected.", "info");
    }
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
            return <WelcomeScreen onGetStarted={handleGetStarted} />;
        case 'LOGIN':
            return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} error={loginError} />;
        case 'DASHBOARD':
            return renderDashboard();
        default:
            return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
      <header className={`bg-white/70 backdrop-blur-sm shadow-md sticky top-0 z-50 transition-opacity duration-500 ${view === 'WELCOME' ? 'opacity-0' : 'opacity-100'}`}>
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`transition-opacity duration-300 ${showLogoInHeader ? 'opacity-100' : 'opacity-0'}`}>
              <TempoGoLogo className="h-10 w-10 text-yellow-500" />
            </div>
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