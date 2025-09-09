import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (id: string, role: UserRole) => void;
  error: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error }) => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [id, setId] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      onLogin(id, activeRole);
    }
  };

  const getPlaceholder = () => {
    switch (activeRole) {
      case UserRole.CUSTOMER: return "Enter your customer ID (e.g., priya.s)";
      case UserRole.DRIVER: return "Enter your driver ID (e.g., ravi.k)";
      case UserRole.ADMIN: return "Enter your admin ID (e.g., admin)";
    }
  };

  const roles = [UserRole.CUSTOMER, UserRole.DRIVER, UserRole.ADMIN];

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Welcome to TempoGo</h2>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex justify-center space-x-4" aria-label="Tabs">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
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
      <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder={getPlaceholder()}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
            />
          </div>
        </div>
        
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                <p>{error}</p>
            </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
