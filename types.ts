
export enum AppStatus {
  FORM = 'FORM',
  LOADING = 'LOADING',
  CONFIRMED = 'CONFIRMED',
}

export interface BookingDetails {
  pickup: string;
  dropoff: string;
  name: string;
  phone: string;
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicleNumber: string;
  eta: number; // in minutes
  imageUrl: string;
}
