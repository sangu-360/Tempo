import React from 'react';
import { TempoGoLogo } from './icons/TempoGoLogo';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto animate-fade-in">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-yellow-100 via-yellow-50 to-white"></div>
        <div className="text-center relative z-10">
          <TempoGoLogo className="h-24 w-24 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to TempoGo</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Your reliable partner for on-demand mini-truck and tempo services.
            Fast, efficient, and hassle-free logistics at your fingertips.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-full hover:bg-yellow-500 shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            Get Started
          </button>
        </div>
    </div>
  );
};

export default WelcomeScreen;