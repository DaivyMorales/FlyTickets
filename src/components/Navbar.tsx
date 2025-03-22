import React from "react";
import { signOut, useSession } from "next-auth/react";
import Booking from "./Booking";
import { useOpenGlobal } from "./../store/OpenGlobalSlice";

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const { data: session } = useSession();
  const { openBooking } = useOpenGlobal();

  return (
    <div className="bg-zinc-800">
      {openBooking && <Booking />}
      <div className="navbar shadow-sm px-3">
        <div className="flex-1">
          <a className="text-md font-bold">FlyTickets</a>
        </div>
        <div className="flex-none">
          {session ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS Navbar component" src="" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="z-1 dropdown-content menu menu-sm mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li onClick={() => signOut()}>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
            <button 
              onClick={() => window.location.href = '/auth?mode=login'} 
              className="btn w-[130px] bg-transparent text-xs"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => window.location.href = '/auth?mode=register'} 
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
