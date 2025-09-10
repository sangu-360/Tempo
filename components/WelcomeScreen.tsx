import React from 'react';
import { TempoGoLogo } from './icons/TempoGoLogo';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="animate-fade-in-down">
        <TempoGoLogo className="h-40 w-40 md:h-48 md:w-48 text-yellow-500" />
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mt-6 animate-title-reveal" style={{ animationDelay: '0.2s' }}>
        TempoGo
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mt-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        Travel with us
      </p>
      <button
        onClick={onGetStarted}
        className="mt-12 py-3 px-8 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-primary-dark transform hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '1.2s' }}
        aria-label="Get started with TempoGo"
      >
        Get Started
      </button>
    </div>
  );
};

export default WelcomeScreen;