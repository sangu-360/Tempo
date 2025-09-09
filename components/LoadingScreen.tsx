
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  'Searching for nearby drivers...',
  'Contacting available tempos...',
  'Finalizing your booking...',
  'Driver is on the way!'
];

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 1000); // Change message every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-700">Please wait</h2>
        <p className="text-gray-500 mt-2 text-center transition-opacity duration-300">
            {loadingMessages[messageIndex]}
        </p>
    </div>
  );
};

export default LoadingScreen;
