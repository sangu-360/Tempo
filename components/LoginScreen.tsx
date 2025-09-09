import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (id: string, role: UserRole, password?: string) => void;
  onRegister: (newUser: { id: string; name: string }) => void;
  error: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister, error }) => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login states
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // Registration states
  const [regName, setRegName] = useState('');
  const [regId, setRegId] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      onLogin(id, activeRole, password);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regId && regName) {
        onRegister({ id: regId, name: regName });
    }
  }

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setIsRegistering(false); // Reset to login view on role change
    setId('');
    setPassword('');
  };
  
  const getLoginPlaceholder = () => {
    switch (activeRole) {
      case UserRole.CUSTOMER: return "Enter your customer ID (e.g., priya.s)";
      case UserRole.DRIVER: return "Enter your driver ID (e.g., ravi.k)";
      case UserRole.ADMIN: return "Enter your admin ID (e.g., admin)";
    }
  };

  const roles = [UserRole.CUSTOMER, UserRole.DRIVER, UserRole.ADMIN];

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
        <div>
          <label htmlFor="login-id" className="block text-sm font-medium text-gray-700">
            Login ID
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="login-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder={getLoginPlaceholder()}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
            />
          </div>
        </div>
        
        {activeRole === UserRole.ADMIN && (
            <div>
              <label htmlFor="password-id" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  id="password-id"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
                />
              </div>
            </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition duration-300"
        >
          Login
        </button>

        {activeRole === UserRole.CUSTOMER && (
            <p className="text-center text-sm">
                Don't have an account?{' '}
                <button type="button" onClick={() => setIsRegistering(true)} className="font-medium text-primary hover:underline">
                    Register here
                </button>
            </p>
        )}
    </form>
  );

  const renderRegisterForm = () => (
     <form onSubmit={handleRegisterSubmit} className="space-y-6">
        <div>
          <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="mt-1">
            <input type="text" id="reg-name" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="e.g., Priya Sharma" required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"/>
          </div>
        </div>
        <div>
          <label htmlFor="reg-id" className="block text-sm font-medium text-gray-700">
            Choose a Login ID
          </label>
          <div className="mt-1">
            <input type="text" id="reg-id" value={regId} onChange={(e) => setRegId(e.target.value)} placeholder="e.g., priya.s" required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"/>
          </div>
        </div>
        
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-success hover:bg-opacity-90 transition">
          Create Account
        </button>
        <p className="text-center text-sm">
            Already have an account?{' '}
            <button type="button" onClick={() => setIsRegistering(false)} className="font-medium text-primary hover:underline">
                Login here
            </button>
        </p>
     </form>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto animate-fade-in-down">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
        {isRegistering ? 'Create Customer Account' : 'Welcome to TempoGo'}
      </h2>
      {!isRegistering && (
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex justify-center space-x-4" aria-label="Tabs">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`${
                    activeRole === role
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } capitalize whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  {role.toLowerCase()} Login
                </button>
              ))}
            </nav>
          </div>
      )}
      
      {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4">
                <p>{error}</p>
            </div>
        )}

      {isRegistering ? renderRegisterForm() : renderLoginForm()}
    </div>
  );
};

export default LoginScreen;