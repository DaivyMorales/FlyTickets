import DestinationInput from "@/components/DestinationInput";
import OriginInput from "@/components/OriginInput";
import { FaPeopleGroup } from "react-icons/fa6";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { PiAirplaneTakeoffFill, PiCalendarDotsFill } from "react-icons/pi";
import ModalCategory from "./ModalCategory";
import Flight from "@/components/Flight";

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const departureRef = useRef<HTMLInputElement>(null);
  const returnRef = useRef<HTMLInputElement>(null);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [passengers, setPassengers] = useState<number | string>(1);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [isOneWay, setIsOneWay] = useState(false);

  const handleCalendarClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.showPicker();
  };

  const validateDates = (start: string, end: string) => {
    if (!start || !end) return true;
    return new Date(end) > new Date(start);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    if (endDate && !validateDates(e.target.value, endDate)) {
      setDateError("La fecha de vuelta debe ser posterior a la fecha de ida");
    } else {
      setDateError("");
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    if (!validateDates(startDate, e.target.value)) {
      setDateError("La fecha de vuelta debe ser posterior a la fecha de ida");
    } else {
      setDateError("");
    }
  };

  const handlePassengerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[1-9]$/.test(inputValue)) {
      setPassengers(inputValue === "" ? "" : parseInt(inputValue));
    }
  };

  const getTodayString = () => {
    return new Date().toISOString().split("T")[0];
  };

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
      <div className="h-screen  grid-cols-1 grid-rows-2">
        <div className="flex h-full flex-col items-center justify-center gap-10 gap-4 bg-zinc-800">
          <div className="flex grid w-[800px] grid-cols-2 items-end justify-end gap-4">
            <div className="col-span-2 flex items-end gap-4">
              <ModalCategory />
              <div>
                <label
                  className="text-neutral-300 mb-2 block text-xs font-medium"
                  htmlFor="password"
                >
                  Pasajeros
                </label>
                <label className="input relative w-[70px] rounded-l-md bg-transparent">
                  <FaPeopleGroup size={20} />
                  <input
                    className="input-sm w-full"
                    type="number"
                    placeholder="1"
                    min="1"
                    max="9"
                    value={passengers}
                    onChange={handlePassengerChange}
                    required
                  />
                </label>
              </div>
              <div className="flex justify-center gap-4 rounded-md border-[1px] border-b-[2px] border-zinc-600 bg-transparent px-5 py-2.5 text-xs">
                <div>
                  <input
                    type="checkbox"
                    checked={isRoundTrip}
                    className="checkbox checkbox-xs"
                    onChange={() => {
                      setIsRoundTrip(true);
                      setIsOneWay(false);
                    }}
                  />{" "}
                  Ida y vuelta
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={isOneWay}
                    className="checkbox checkbox-xs"
                    onChange={() => {
                      setIsRoundTrip(false);
                      setIsOneWay(true);
                    }}
                  />{" "}
                  Solo ida
                </div>
              </div>
            </div>
            <div className="col-span-3 flex items-end justify-center gap-4">
              <div className="rounded-[100px] join">
                <OriginInput />
                <DestinationInput />
              </div>
              <div className="rounded-[100px] join">
                <div>
                  <label
                    className="text-neutral-300 mb-2 block text-xs font-medium"
                    htmlFor="password"
                  >
                    Ida
                  </label>
                  <label className="input relative w-full rounded-l-md bg-zinc-900">
                    <div
                      onClick={() => handleCalendarClick(departureRef)}
                      className="cursor-pointer"
                    >
                      <PiCalendarDotsFill />
                    </div>
                    <input
                      ref={departureRef}
                      type="date"
                      value={startDate}
                      min={getTodayString()}
                      onChange={handleStartDateChange}
                      placeholder="ida"
                      className="input text-xs placeholder:text-gray-400 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
                    />
                  </label>
                </div>

                <div>
                  <label
                    className="text-neutral-300 mb-2 block text-xs font-medium"
                    htmlFor="password"
                  >
                    Vuelta
                  </label>
                  <label className="input relative w-full rounded-r-md bg-zinc-900">
                    <div
                      onClick={() => handleCalendarClick(returnRef)}
                      className="cursor-pointer"
                    >
                      <PiCalendarDotsFill />
                    </div>
                    <input
                      ref={returnRef}
                      type="date"
                      value={endDate}
                      min={startDate || getTodayString()}
                      onChange={handleEndDateChange}
                      placeholder="vuelta"
                      className="input text-xs placeholder:text-gray-400 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
                    />
                  </label>
                </div>
                {dateError && (
                  <p className="absolute -bottom-6 mt-2 text-xs text-red-500">
                    {dateError}
                  </p>
                )}
              </div>
              <button className="btn w-[170px] rounded-md bg-blue-700 text-xs">
                Buscar
              </button>
            </div>
          </div>
        </div>
        {/* <Flight /> */}
      </div>
    );
  }

  return null;
};

export default HomePage;
