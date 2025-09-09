import React from 'react';

export const TempoGoLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M2 10C2 8.34315 3.34315 7 5 7H13V5C13 4.44772 13.4477 4 14 4H18C18.5523 4 19 4.44772 19 5V7H20C21.1046 7 22 7.89543 22 9V16C22 17.1046 21.1046 18 20 18H19V19C19 19.5523 18.5523 20 18 20H16C15.4477 20 15 19.5523 15 19V18H9V19C9 19.5523 8.55228 20 8 20H6C5.44772 20 5 19.5523 5 19V18H4C2.89543 18 2 17.1046 2 16V10ZM5 9H13V16H5V9Z" />
    <circle cx="7" cy="19" r="2" fill="#374151"/>
    <circle cx="17" cy="19" r="2" fill="#374151"/>
  </svg>
);