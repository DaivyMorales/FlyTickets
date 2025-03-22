import React, { useEffect, useState } from "react";
import { PiAirplaneFill } from "react-icons/pi";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import DestinationInput from "@/components/DestinationInput";
import SearchDestinationInput from "@/components/SearchDestinationInput";

function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState(() => {
    // Initialize state with localStorage value if it exists
    if (typeof window !== "undefined") {
      return localStorage.getItem("savedDestination") || "";
    }
    return "";
  });

  useEffect(() => {
    if (status !== "loading") {
      if (session) {
        router.replace("/");
      } else {
        setLoading(false);
      }
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session && destination) {
      // Clear localStorage after setting initial state
      localStorage.removeItem("savedDestination");
    }

    // Set a timer to delete savedDestination after 5 minutes
    const timer = setTimeout(
      () => {
        localStorage.removeItem("savedDestination");
      },
      5 * 60 * 1000,
    ); // 5 minutes in milliseconds

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [session, destination]);

  const handleDestinationSelect = (value: string) => {
    setDestination(value);
  };

  const handleReservation = () => {
    if (destination) {
      localStorage.setItem("savedDestination", destination);
    }
    router.push("/auth");
  };

  if (loading || status === "loading") {
    return <div className="h-screen w-screen bg-zinc-800" />;
  }

  // Return null if user is authenticated to prevent flash of content
  if (session) return null;

  return (
    <div className="grid h-[720px] w-screen grid-cols-2 gap-5 bg-zinc-800">
      <div className="col-spa flex h-full flex-col items-center justify-center gap-5">
        <h1 className="mt-10 text-center text-6xl font-black">
          Rápido, barato, fácil
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
        <div className="flex items-end gap-2">
          <div className="w-[280px]">
            <SearchDestinationInput
              onSelect={handleDestinationSelect}
              initialValue={destination}
            />
          </div>
          <button
            onClick={handleReservation}
            className="btn h-[42px] w-[120px] bg-blue-700 text-xs"
          >
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
