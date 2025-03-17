import DestinationInput from "@/components/DestinationInput";
import OriginInput from "@/components/OriginInput";
import CityAutocomplete from "@/components/OriginInput";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PiAirplaneTakeoffFill, PiAirplaneLandingFill } from "react-icons/pi";

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen flex items-center justify-center gap-4 bg-zinc-800">
        <div className="rounded-[100px] join">
          <OriginInput/>
          <DestinationInput/>
        </div>
        <div className="rounded-[100px] join">
          <OriginInput/>
          <DestinationInput/>
        </div>
      </div>
    );
  }

  return null;
};

export default HomePage;
