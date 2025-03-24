import { create } from "zustand";

interface SelectedFlight {
  id: number;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  price: number;
  airline: string;
  category: string;
  passengers: number;
  hotelName: string | null;
  hotelStars: number | null;
  numberOfNights: number | null;
}

export interface OpenGlobalProps {
  openBooking: boolean;
  selectedFlight: SelectedFlight | null;
  setOpenBooking: (value: boolean) => void;
  setSelectedFlight: (flight: SelectedFlight | null) => void;
}

export const useOpenGlobal = create<OpenGlobalProps>((set) => ({
  openBooking: false,
  selectedFlight: null,
  setOpenBooking: (value: boolean) => {
    set(() => ({ openBooking: value }));
  },
  setSelectedFlight: (flight: SelectedFlight | null) => {
    set(() => ({ selectedFlight: flight }));
  },
}));
