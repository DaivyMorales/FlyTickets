import React from "react";
import { PiAirplaneFill } from "react-icons/pi";
import Image from "next/image";

function Home() {
  return (
    <div className="grid h-[720px] w-screen grid-cols-2 gap-5 bg-zinc-800">
      <div className="col-spa flex h-full flex-col items-center justify-center gap-5">
        <h1 className="mt-10 text-center text-6xl font-black">
          Rápido, limpio, fácil
          <br />
          <span className="font-bold text-zinc-300">
            {" "}
            Obtén tus boletos de avión
          </span>
          <p className="mt-6 text-sm font-normal text-zinc-300">
            Encuentra los mejores precios en boletos de avión para viajar por el
            mundo.
            <br />
            Comparamos precios de múltiples aerolíneas para ofrecerte las
            mejores ofertas.
          </p>
        </h1>
        <div className="flex  gap-2 items-center">
          {/* <label
            className="text-neutral-300 mb-2 block text-xs font-medium"
            htmlFor="password"
          >
            ¿A donde te gustaría ir?
          </label> */}
          <input
            className="input text-xs join-item w-[220px]"
            placeholder="¿A donde te gustaría ir?"
          />
          <button className="btn w-[120px] bg-blue-700 text-xs join-item">
            Reservar ahora!
          </button>
        </div>
      </div>
      <div className="w-full rounded-l-lg">
        <img
          src="/wallpaper.png"
          alt="Wallpaper"
          className="h-full w-full rounded-l-md object-cover"
        />
      </div>
    </div>
  );
}

export default Home;
