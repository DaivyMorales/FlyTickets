import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IoIosAirplane } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { BiPlusCircle } from "react-icons/bi";
import { useBookingsStore } from "@/store/BookingsStore";

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

function Reservations() {
  const { data: session } = useSession();
  const { bookings, setBookings, removeBooking } = useBookingsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const formatTime = (time: string | undefined) => {
    if (!time) return "";
    const timeParts = time.split(":");
    const hour = timeParts[0] ? parseInt(timeParts[0]) : 0;
    const minutes = timeParts[1];
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(
          `/api/user/booking?userId=${session.user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [session, setBookings]);

  const handleDelete = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/user/booking?bookingId=${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update global state
        removeBooking(bookingId);
        setShowDeleteModal(false);
        setSelectedBooking(null);
        
        // Send email notification
        await fetch('/api/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: "nperezp@ucentral.edu.co",
            booking: selectedBooking,
          }),
        });
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  if (!session) {
    return (
      <div className="flex min-h-[720px] w-screen items-center justify-center bg-zinc-800 text-white">
        Please sign in to view your reservations
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[720px] w-screen items-center justify-center bg-transparent text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="z-50">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-zinc-800 p-6">
            <h3 className=" text-lg font-semibold">Confirmar cancelación</h3>
            <p className="mb-6 text-sm">
              ¿Estás seguro que deseas cancelar esta reservación?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedBooking(null);
                }}
                className="btn rounded px-4 py-2 text-sm hover:bg-zinc-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(selectedBooking.id)}
                className="btn rounded bg-red-500 px-4 py-2 text-sm hover:bg-red-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="drawer">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer-4"
            className="cursor-pointer text-sm hover:text-blue-500"
          >
            Mis reservaciones
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <div className="flex min-h-[820px] w-[400px] flex-col rounded-r-md p-4 backdrop-blur-sm">
            <h3 className="text-sm font-semibold">Mis reservaciones</h3>
            <div className="scrollbar-hide mt-4 flex max-h-[calc(100vh-100px)] flex-col gap-2 overflow-y-auto">
              {bookings.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 p-4 text-center"
                >
                  <BiPlusCircle className="mb-2 h-8 w-8 text-zinc-400" />
                  <p className="text-sm text-zinc-400">No tienes reservaciones activas</p>
                  <label 
                    htmlFor="my-drawer-4" 
                    className="mt-4 cursor-pointer rounded-md bg-zinc-700 px-4 py-2 text-sm transition-colors hover:bg-zinc-600"
                  >
                    Crear una reservación
                  </label>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {bookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="inset-shadow-sm group relative flex cursor-pointer flex-col rounded-md border-[1px] border-zinc-700 bg-zinc-900 shadow-sm"
                    >
                      <div 
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDeleteModal(true);
                        }}
                        className="absolute right-2 top-0 rounded-b bg-zinc-800 p-1 text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >
                        Cancelar
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-zinc-400">{booking.airline}</p>
                        <div className="flex items-center justify-between">
                          {" "}
                          <div className="flex flex-col">
                            <p className="text-lg font-medium">
                              {formatTime(booking.departureTime)}
                            </p>
                            <span className="text-[10px]">{booking.origin}</span>
                            <span className="text-xs text-zinc-400">
                              {formatDate(booking.startDate)}
                            </span>
                          </div>
                          <div className="h-[6px] w-[6px] rounded-full border-[1px] border-zinc-400" />
                          <div className="h-[1px] w-[30px] border-[1px] border-dashed border-zinc-700 bg-transparent" />
                          <IoIosAirplane />
                          <div className="h-[1px] w-[30px] border-[1px] border-dashed border-zinc-700 bg-transparent" />
                          <div className="h-[6px] w-[6px] rounded-full border-[1px] border-zinc-400" />
                          <div>
                            <div className="flex flex-col">
                              <p className="text-lg font-medium">
                                {formatTime(booking.arrivalTime)}
                              </p>
                              <span className="text-[10px]">
                                {booking.destination}
                              </span>
                              <span className="text-xs text-zinc-400">
                                {formatDate(booking.startDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {booking.hotelName && booking.numberOfNights && (
                        <>
                          <div className="h-[1px] w-full border-[1px] border-dashed border-zinc-700 bg-transparent" />

                          <div className="flex flex-col py-2">
                            <div className="flex w-full justify-between px-3 py-1">
                              <p className="text-[10px]">Alojamiento:</p>
                              <p className="text-[10px] font-light text-zinc-100">
                                {booking.hotelName}
                              </p>
                            </div>
                            <div className="flex w-full justify-between px-3 py-1">
                              <p className="text-[10px]">Noches:</p>
                              <p className="text-[10px] font-light text-zinc-100">
                                {booking.numberOfNights}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="h-[1px] w-full border-[1px] border-dashed border-zinc-700 bg-transparent" />
                      <div className="inset-shadow-sm flex items-center justify-between rounded-b-md bg-zinc-700 p-2 shadow-inner">
                        <span className="text-[10px] font-light">
                          <span className="font-medium">Clase:</span>{" "}
                          {booking.category}
                        </span>
                        <p className="font-semibold text-white">
                          {booking.price} COP
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservations;
