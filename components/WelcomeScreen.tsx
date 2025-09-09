// Fix: Replaced placeholder content with a functional WelcomeScreen component.
// This component serves as the initial landing page, guiding users to the login/registration flow.
import React from 'react';
import { TempoGoLogo } from './icons/TempoGoLogo';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto animate-fade-in">
        <div className="text-center">
          <TempoGoLogo className="h-24 w-24 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to TempoGo</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Your reliable partner for on-demand mini-truck and tempo services.
            Fast, efficient, and hassle-free logistics at your fingertips.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary-dark shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-light"
          >
            Get Started
          </button>
        </div>
    </div>
  );
};

export default WelcomeScreen;
