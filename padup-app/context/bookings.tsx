import React, { createContext, useContext, useState } from 'react';

export type Booking = {
  id: string;
  clubId: string;
  clubName: string;
  clubIcon: string;
  terrainName: string;
  terrainType: string;
  dateLabel: string;
  slotStart: string;
  slotEnd: string;
  price: number;
};

type BookingsCtx = {
  bookings: Booking[];
  bookedKeys: string[]; // format: `${clubId}|${terrainName}|${dateLabel}|${slotStart}`
  addBooking: (booking: Booking) => void;
  isBooked: (key: string) => boolean;
};

const Ctx = createContext<BookingsCtx>({
  bookings: [],
  bookedKeys: [],
  addBooking: () => {},
  isBooked: () => false,
});

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookedKeys, setBookedKeys] = useState<string[]>([]);

  function addBooking(booking: Booking) {
    const key = `${booking.clubId}|${booking.terrainName}|${booking.dateLabel}|${booking.slotStart}`;
    setBookings((prev) => [booking, ...prev]);
    setBookedKeys((prev) => [...prev, key]);
  }

  function isBooked(key: string) {
    return bookedKeys.includes(key);
  }

  return (
    <Ctx.Provider value={{ bookings, bookedKeys, addBooking, isBooked }}>
      {children}
    </Ctx.Provider>
  );
}

export function useBookings() {
  return useContext(Ctx);
}
