import DestinationInput from "@/components/DestinationInput";
import OriginInput from "@/components/OriginInput";
import { FaPeopleGroup } from "react-icons/fa6";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { PiAirplaneTakeoffFill, PiCalendarDotsFill } from "react-icons/pi";
import ModalCategory from "./ModalCategory";
import Flight from "@/components/Flight";
import { useFormik } from "formik";
import ModalHotels from "@/components/ModalHotels";

interface FlightOption {
  id: number;
  departureTime: string;
  arrivalTime: string;
  price: number;
  airline: string;
  includeHotel?: boolean;
}

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const departureRef = useRef<HTMLInputElement>(null);
  const returnRef = useRef<HTMLInputElement>(null);

  const [dateError, setDateError] = useState<string>("");
  const [passengers, setPassengers] = useState<number | string>(1);
  const [showFlights, setShowFlights] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [flightOptions, setFlightOptions] = useState<FlightOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedValues, setSubmittedValues] = useState({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    isRoundTrip: true,
    category: "Bussiness",
    passengers: 1,
  });
  const [searchResults, setSearchResults] = useState({
    flights: [] as FlightOption[],
    searchParams: {
      origin: "",
      destination: "",
      startDate: "",
      endDate: "",
      isRoundTrip: true,
      category: "Bussiness",
      passengers: 1,
      includeHotel: false,
      hotelStars: 0,
    },
  });

  const handleCalendarClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.showPicker();
  };

  const validateDates = (start: string, end: string) => {
    if (!start || !end) return true;
    return new Date(end) > new Date(start);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("startDate", e.target.value);
    if (
      formik.values.endDate &&
      !validateDates(e.target.value, formik.values.endDate)
    ) {
      setDateError("La fecha de vuelta debe ser posterior a la fecha de ida");
    } else {
      setDateError("");
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("endDate", e.target.value);
    if (!validateDates(formik.values.startDate, e.target.value)) {
      setDateError("La fecha de vuelta debe ser posterior a la fecha de ida");
    } else {
      setDateError("");
    }
  };

  const handlePassengerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[1-9]$/.test(inputValue)) {
      setPassengers(inputValue === "" ? "" : parseInt(inputValue));
      formik.setFieldValue(
        "passengers",
        inputValue === "" ? "" : parseInt(inputValue),
      );
    }
  };

  const getTodayString = () => {
    return new Date().toISOString().split("T")[0];
  };

  const calculatePrice = (origin: string, destination: string) => {
    const basePrice = 500000;
    const prices = [
      { price: basePrice, multiplier: 1 },
      { price: basePrice * 1.2, multiplier: 0.9 },
      { price: basePrice * 0.8, multiplier: 1.1 },
    ];
    return prices;
  };

  const generateFlightTimes = (date: string) => {
    const baseDate = new Date(date);
    baseDate.setHours(6, 0, 0, 0);

    const numberOfFlights = Math.floor(Math.random() * 4) + 1;
    const times = [];

    for (let i = 0; i < numberOfFlights; i++) {
      const departureDate = new Date(baseDate);
      const randomHours = Math.floor(Math.random() * 14);
      const randomMinutes = Math.floor(Math.random() * 60);

      departureDate.setHours(departureDate.getHours() + randomHours);
      departureDate.setMinutes(randomMinutes);

      const arrivalDate = new Date(departureDate);
      const flightDuration = 2 + Math.floor(Math.random() * 2);
      arrivalDate.setHours(arrivalDate.getHours() + flightDuration);

      times.push({
        departure: departureDate.toISOString(),
        arrival: arrivalDate.toISOString(),
      });
    }

    return times.sort(
      (a, b) =>
        new Date(a.departure).getTime() - new Date(b.departure).getTime(),
    );
  };

  const formik = useFormik({
    initialValues: {
      origin: "",
      destination: "",
      startDate: "",
      endDate: "",
      passengers: 1,
      category: "Bussiness",
      isRoundTrip: true,
      isOneWay: false,
      includeHotel: false,
      hotelStars: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values)
      try {
        setIsLoading(true);
        setShowFlights(true);
        setSearchPerformed(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const airlines = [
          "Avianca",
          "LATAM",
          "American Airlines",
          "Copa Airlines",
          "United Airlines",
          "Delta",
        ];
        const times = generateFlightTimes(values.startDate);
        const prices = times.map(() => ({
          price: 500000 * (0.8 + Math.random() * 0.7),
          multiplier: 0.9 + Math.random() * 0.3,
        }));

        const categoryMultiplier =
          {
            Turista: 1,
            Business: 1.35,
            Gold: 1.7,
          }[values.category] || 1;

        const options = times.map((time, index) => ({
          id: index + 1,
          departureTime: time.departure,
          arrivalTime: time.arrival,
          price: prices[index]
            ? Math.round(
                prices[index].price *
                  prices[index].multiplier *
                  categoryMultiplier,
              )
            : 0,
          airline:
            airlines[Math.floor(Math.random() * airlines.length)] ||
            "Unknown Airline",
        }));

        setSearchResults({
          flights: options,
          searchParams: {
            origin: values.origin,
            destination: values.destination,
            startDate: values.startDate,
            endDate: values.endDate,
            isRoundTrip: values.isRoundTrip,
            category: values.category,
            passengers: values.passengers,
            includeHotel: values.includeHotel,
            hotelStars: values.hotelStars,
          },
        });
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

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
  console.log(formik.values);

  if (status === "authenticated") {
    return (
      <div className="grid min-h-screen grid-cols-1 grid-rows-4">
        <div className="flex h-full flex-col items-center justify-center gap-10 gap-4 bg-zinc-800">
          <form
            onSubmit={formik.handleSubmit}
            className="flex grid w-[800px] grid-cols-2 items-end justify-end gap-4"
          >
            <div className="col-span-2 flex items-end gap-4">
              <ModalCategory
                setFormik={formik.setFieldValue}
                setSearchResults={setSearchResults}
              />
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
                    name="passengers"
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
                    checked={formik.values.isRoundTrip}
                    className="checkbox checkbox-xs"
                    onChange={() => {
                      formik.setFieldValue("isRoundTrip", true);
                      formik.setFieldValue("isOneWay", false);
                    }}
                  />{" "}
                  Ida y vuelta
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={formik.values.isOneWay}
                    className="checkbox checkbox-xs"
                    onChange={() => {
                      formik.setFieldValue("isRoundTrip", false);
                      formik.setFieldValue("isOneWay", true);
                    }}
                  />{" "}
                  Solo ida
                </div>
              </div>
              <div className="col-span-2 flex items-end gap-4">
                <ModalHotels
                  setFormik={formik.setFieldValue}
                  setSearchResults={setSearchResults}
                />
              </div>
            </div>
            <div className="col-span-3 flex items-end justify-center gap-4">
              <div className="rounded-[100px] join">
                <OriginInput setFormik={formik.setFieldValue} />
                <DestinationInput setFormik={formik.setFieldValue} />
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
                      value={formik.values.startDate}
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
                      value={formik.values.endDate}
                      min={formik.values.startDate || getTodayString()}
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
              <button
                type="submit"
                className="btn w-[170px] rounded-md bg-blue-700 text-xs"
                disabled={isLoading || dateError !== ""}
              >
                {isLoading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </form>
        </div>
        {searchPerformed && (
          <Flight
            origin={searchResults.searchParams.origin}
            destination={searchResults.searchParams.destination}
            startDate={searchResults.searchParams.startDate}
            endDate={searchResults.searchParams.endDate}
            isRoundTrip={searchResults.searchParams.isRoundTrip}
            flightOptions={searchResults.flights}
            category={searchResults.searchParams.category}
            includeHotel={searchResults.searchParams.includeHotel}
            hotelStars={searchResults.searchParams.hotelStars}
            passengers={searchResults.searchParams.passengers}
            loading={isLoading}
          />
        )}
      </div>
    );
  }

  return null;
};

export default HomePage;
