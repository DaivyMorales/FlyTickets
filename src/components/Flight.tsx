import React from "react";
import { IoAirplaneSharp } from "react-icons/io5";
import { motion } from "framer-motion";

interface FlightProps {
  origin: string;
  destination: string;
  startDate: string;
  category: string;
  endDate: string;
  isRoundTrip: boolean;
  flightOptions: {
    id: number;
    departureTime: string;
    arrivalTime: string;
    price: number;
    airline: string;
  }[];
  loading?: boolean;
  passengers: number;
}

function calculateDistance(origin: string, destination: string): number {
  return Math.random() * 1000;
}

function calculateFinalPrice(basePrice: number, distance: number, category: string): number {
  let finalPrice = basePrice;
  
  // Apply distance surcharge
  if (distance > 500) {
    finalPrice += 100000;
  }

  // Apply category multipliers
  switch (category.toLowerCase()) {
    case "business":
      finalPrice *= 2.5;  // 150% more expensive than tourist
      break;
    case "gold":
      finalPrice *= 3.0;  // 200% more expensive than tourist
      break;
    case "tourist":
    default:
      finalPrice *= 1.0;  // Base price
      break;
  }

  return Math.round(finalPrice);
}

function Flight({ origin, destination, category, startDate, endDate, isRoundTrip, flightOptions, loading, passengers }: FlightProps) {
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.6,
        bounce: 0.3
      }
    }
  };

  const calculateTotalPrice = (basePrice: number) => {
    const passengerTotal = basePrice * passengers;
    return isRoundTrip ? passengerTotal * 2 : passengerTotal;
  };

  return (
    <motion.div 
      className="row-span-4 flex flex-col gap-4 h-full w-full items-center justify-start border-t-[1px] border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 shadow-inner overflow-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {loading ? (
      <div className="flex items-center justify-center">
        <motion.span 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="loading loading-spinner loading-lg text-zinc-400"
        />
      </div>
      ) : (
      flightOptions.map((option) => {
        const distance = calculateDistance(origin, destination);
        const finalPrice = calculateFinalPrice(option.price, distance, category);

        return (
        <motion.div
          key={option.id}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="grid w-[800px] grid-cols-4 rounded-md border-[1px] border-zinc-700 bg-zinc-800 shadow-inner"
        >
          <div className="col-span-3 flex items-center justify-between">
          <div className="px-4 py-10">
            <h3 className="text-xl font-semibold">{formatTime(option.departureTime)}</h3>
            <p className="text-xs font-medium">{origin || "Seleccione origen"}</p>
            <p className="text-xs text-gray-400">{option.airline}</p>
          </div>
          <div className="h-[1px] w-[130px] bg-zinc-600" />
          <IoAirplaneSharp />
          <div className="h-[1px] w-[130px] bg-zinc-600" />
          <div className="px-4 py-10">
            <h3 className="text-xl font-semibold">{formatTime(option.arrivalTime)}</h3>
            <p className="text-xs font-medium">{destination || "Seleccione destino"}</p>
          </div>
          </div>

          <div className="flex flex-col justify-center gap-2 rounded-r-md border-l-[1px] border-zinc-700 bg-zinc-900 p-2 px-6 py-4">
          <h3 className="text-xl font-bold">
            <p className="text-xs font-semibold">COP</p> {calculateTotalPrice(finalPrice).toLocaleString()}
          </h3>
          <button className="btn w-[100px] rounded-md bg-blue-700 text-xs">
            Comprar
          </button>
          </div>
        </motion.div>
        );
      })
      )}

      {isRoundTrip && endDate && (
      <></>
      )}
    </motion.div>
  );
}

export default Flight;
