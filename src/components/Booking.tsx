import { useOpenGlobal } from "@/store/OpenGlobalSlice";
import { useSession } from "next-auth/react";
import React, { useRef, useState, useEffect } from "react";
import { useBookingsStore } from "@/store/BookingsStore";

export default function Booking() {
  const { data: session } = useSession();
  const { setOpenBooking, selectedFlight } = useOpenGlobal();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { addBooking } = useBookingsStore();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const generateFlightId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const randomLetters = Array(2)
      .fill(0)
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("");
    const randomNumbers = Array(4)
      .fill(0)
      .map(() => numbers[Math.floor(Math.random() * numbers.length)])
      .join("");
    return `${randomLetters}${randomNumbers}`;
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setOpenBooking(false);
    }
  };

  if (!selectedFlight) return null;

  const bookingId = generateFlightId();

  const handleConfirmBooking = async () => {
    if (!session?.user?.email) return;

    try {
      setIsSending(true);

      const newBooking = {
        id: bookingId,
        airline: selectedFlight.airline,
        category: selectedFlight.category,
        startDate: new Date(selectedFlight.startDate).toISOString(),
        endDate: new Date(selectedFlight.endDate).toISOString(),
        departureTime: selectedFlight.departureTime,
        arrivalTime: selectedFlight.arrivalTime,
        origin: selectedFlight.origin,
        destination: selectedFlight.destination,
        passengers: selectedFlight.passengers,
        hotelName: selectedFlight.hotelName || undefined,
        numberOfNights: selectedFlight.numberOfNights || undefined,
        price: selectedFlight.price.toLocaleString(),
        userId: session.user.id,
      };

      // Create booking
      const bookingResponse = await fetch("/api/user/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking");
      }

      // Add to global state
      addBooking(newBooking);

      // Send email
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          flight: selectedFlight,
          userEmail: session.user.email,
          userName: session.user.name || "Usuario",
          hotelName: selectedFlight.hotelName,
          hotelStars: selectedFlight.hotelStars,
          numberOfNights: selectedFlight.numberOfNights,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setEmailSent(true);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setOpenBooking(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="animate-fade-in fixed inset-x-0 top-4 z-[60] mx-auto w-[90%] max-w-sm rounded-lg bg-green-800 p-4 shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="h-6 w-6 text-green-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-center text-sm font-medium text-white">
              Tu reserva ha sido enviada a tu correo electrónico
            </p>
          </div>
        </div>
      )}
      <div
        onClick={handleOutsideClick}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-brightness-50"
      >
        <div
          ref={modalRef}
          className="h-[730px] w-[400px] rounded-md border-[1px] border-zinc-700 bg-zinc-800 px-8 py-4 shadow-inner"
        >
          <div className="flex h-full w-full flex-col items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Confirmación de Reserva</h3>
              <p className="text-xs text-zinc-500">
                Confirma los detalles de tu reserva antes de proceder. Al
                confirmar, recibirás un correo con la información completa del
                vuelo y las instrucciones siguientes.
              </p>
            </div>

            <div className="h-[1px] w-full border-[1px] border-dashed border-zinc-700" />

            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Nombre</p>
                <p className="text-xs text-zinc-200">{session?.user.name}</p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Email</p>
                <p className="text-xs text-zinc-200">{session?.user.email}</p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">ID Vuelo</p>
                <p className="text-xs text-zinc-200">{bookingId}</p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Aerolínea</p>
                <p className="text-xs text-zinc-200">
                  {selectedFlight.airline}
                </p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Categoria</p>
                <p className="text-xs text-zinc-200">
                  {selectedFlight.category}
                </p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Fecha Inicio</p>
                <p className="text-xs text-zinc-200">
                  {selectedFlight.startDate}
                </p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Fecha Final</p>
                <p className="text-xs text-zinc-200">
                  {selectedFlight.endDate}
                </p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Hora Salida</p>
                <p className="text-xs text-zinc-200">
                  {selectedFlight.departureTime}
                </p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Hora Llegada</p>
                <p className="text-xs text-zinc-200">
                  {selectedFlight.arrivalTime}
                </p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Ciudad de salida</p>
                <p className="text-xs text-zinc-200">{selectedFlight.origin}</p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Ciudad de llegada</p>
                <p className="text-xs text-zinc-200">
                  {selectedFlight.destination}
                </p>
              </div>
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Pasajeros</p>
                <p className="text-xs text-zinc-200">
                  {selectedFlight.passengers}
                </p>
              </div>
              {selectedFlight.hotelName && (
                <>
                  <div className="flex w-full justify-between">
                    <p className="text-xs font-semibold">Hotel</p>
                    <p className="text-xs text-zinc-200">
                      {selectedFlight.hotelName}
                    </p>
                  </div>
                  <div className="flex w-full justify-between">
                    <p className="text-xs font-semibold">Estrellas del Hotel</p>
                    <p className="text-xs text-zinc-200">
                      {selectedFlight.hotelStars}
                    </p>
                  </div>
                  <div className="flex w-full justify-between">
                    <p className="text-xs font-semibold">Noches en el Hotel</p>
                    <p className="text-xs text-zinc-200">
                      {selectedFlight.numberOfNights}
                    </p>
                  </div>
                </>
              )}
              <div className="flex w-full justify-between">
                <p className="text-xs font-semibold">Precio</p>
                <p className="text-xs font-bold text-white">
                  {selectedFlight.price.toLocaleString()} COP
                </p>
              </div>
            </div>

            <div className="h-[1px] w-full border-[1px] border-dashed border-zinc-700" />
            <button
              onClick={handleConfirmBooking}
              disabled={isSending || emailSent}
              className="btn w-full rounded-md bg-blue-700 text-xs disabled:opacity-50"
            >
              {isSending ? "Enviando..." : emailSent ? "Enviado" : "¡Confirmo!"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
