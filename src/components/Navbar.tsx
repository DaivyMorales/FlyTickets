import React from "react";
import { signOut, useSession } from "next-auth/react";
import Booking from "./Booking";
import { useOpenGlobal } from "./../store/OpenGlobalSlice";
import { PiAirplaneFill } from "react-icons/pi";
import { ImUser } from "react-icons/im";

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const { data: session } = useSession();
  const { openBooking } = useOpenGlobal();

  return (
    <div className="bg-zinc-800">
      {openBooking && <Booking />}
      <div className="navbar px-3 shadow-sm">
        <div className="flex-1 items-center">
          <a className="text-md flex items-center gap-1 font-bold">
            {" "}
            <PiAirplaneFill size={15} className="text-blue-600" /> FlyTickets
          </a>
        </div>
        <div className="flex-none">
          {session ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle avatar bg-zinc-700"
              >
                <div className="flex items-center justify-center rounded-full">
                  <ImUser size={20} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="z-1 dropdown-content menu menu-sm mt-3 w-52 rounded-box bg-zinc-900 p-2 shadow"
              >
                <li className="text-xs font-semibold px-2">{session?.user?.name}</li>
                <li onClick={() => signOut({ callbackUrl: "/home" })}>
                  <a>Cerrar Sesión</a>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => (window.location.href = "/auth?mode=login")}
                className="btn w-[130px] bg-transparent text-xs"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => (window.location.href = "/auth?mode=register")}
                className="btn w-[130px] bg-blue-700 text-xs"
              >
                Empezar ahora!
              </button>
            </div>
          )}
        </div>
      </div>
      <main className="bg-zinc-800">{children}</main>
    </div>
  );
};

export default Navbar;
