import React, { useEffect } from 'react';
import { AppNotification } from '../types';
import { SuccessIcon } from './icons/SuccessIcon';
import { InfoIcon } from './icons/InfoIcon';
import { CloseIcon } from './icons/CloseIcon';

interface NotificationProps {
  notification: AppNotification;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const isSuccess = notification.type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-blue-50';
  const borderColor = isSuccess ? 'border-green-400' : 'border-blue-400';
  const textColor = isSuccess ? 'text-green-800' : 'text-blue-800';
  const Icon = isSuccess ? SuccessIcon : InfoIcon;

  return (
    <div className={`w-full ${bgColor} border-l-4 ${borderColor} p-4 shadow-lg rounded-lg flex items-start animate-fade-in-down`}>
      <div className="flex-shrink-0">
        <Icon className={`h-6 w-6 ${textColor}`} />
      </div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        <p className={`text-sm font-medium ${textColor}`}>{notification.message}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button onClick={onClose} className={`inline-flex rounded-md p-1 focus:outline-none focus:ring-2 ${isSuccess ? 'focus:ring-green-500' : 'focus:ring-blue-500'}`}>
          <CloseIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
