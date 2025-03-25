import { create } from 'zustand';

interface Booking {
  id: string;
  airline: string;
  category: string;
  startDate: string;
  endDate: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  passengers: number;
  hotelName?: string;
  numberOfNights?: number;
  price: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookingsStore {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  removeBooking: (id: string) => void;
}

export const useBookingsStore = create<BookingsStore>((set) => ({
  bookings: [],
  setBookings: (bookings) => set({ bookings }),
  addBooking: (booking) => set((state) => ({ 
    bookings: [...state.bookings, booking] 
  })),
  removeBooking: (id) => set((state) => ({
    bookings: state.bookings.filter((booking) => booking.id !== id)
  })),
}));
