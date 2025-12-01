import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [],

      // Add a new booking
      addBooking: (bookingData) => {
        const booking = {
          id: `booking_${Date.now()}`,
          ...bookingData,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          bookings: [booking, ...state.bookings],
        }));
        
        return booking;
      },

      // Get all bookings
      getBookings: () => get().bookings,

      // Get booking by ID
      getBookingById: (id) => {
        return get().bookings.find((booking) => booking.id === id);
      },

      // Update booking status
      updateBookingStatus: (id, status) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, status } : booking
          ),
        }));
      },

      // Cancel booking
      cancelBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, status: 'cancelled' } : booking
          ),
        }));
      },

      // Clear all bookings (for testing)
      clearBookings: () => set({ bookings: [] }),
    }),
    {
      name: 'eventra-bookings-storage',
    }
  )
);
