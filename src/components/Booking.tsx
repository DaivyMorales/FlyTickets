import { useOpenGlobal } from "@/store/OpenGlobalSlice";
import React, { useRef } from "react";

export default function Booking() {
  const { setOpenBooking, selectedFlight } = useOpenGlobal();
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      onClick={handleOutsideClick}
      className="absolute z-50 flex h-full h-screen w-screen flex-col items-center justify-center backdrop-brightness-50"
    >
      <div
        ref={modalRef}
        className="h-[530px] w-[400px] rounded-md border-[1px] border-zinc-700 bg-zinc-800 px-8 py-4 shadow-inner"
      >
        <div className="flex h-full w-full flex-col items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Confirmación de Reserva</h3>
            <p className="text-xs text-zinc-500">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam
              nisi quo iure repudiandae maxime ex numquam et rem, explicabo
              similique.
            </p>
          </div>

          <div className="h-[1px] w-full border-[1px] border-dashed border-zinc-700" />

          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full justify-between">
              <p className="text-xs font-semibold">ID Vuelo</p>
              <p className="text-xs text-zinc-200">{bookingId}</p>
            </div>
            <div className="flex w-full justify-between">
              <p className="text-xs font-semibold">Aerolínea</p>
              <p className="text-xs text-zinc-200">{selectedFlight.airline}</p>
            </div>
            <div className="flex w-full justify-between">
              <p className="text-xs font-semibold">Categoria</p>
              <p className="text-xs text-zinc-200">{selectedFlight.category}</p>
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
            <div className="flex w-full justify-between">
              <p className="text-xs font-semibold">Precio</p>
              <p className="text-xs font-bold text-white">
                {selectedFlight.price.toLocaleString()} COP
              </p>
            </div>
          </div>

          <div className="h-[1px] w-full border-[1px] border-dashed border-zinc-700" />
          <button
            onClick={() => {
              setOpenBooking(false);
            }}
            className="btn w-full rounded-md bg-blue-700 text-xs"
          >
            ¡Confirmo!
          </button>
        </div>
      </div>
    </div>
  );
}
