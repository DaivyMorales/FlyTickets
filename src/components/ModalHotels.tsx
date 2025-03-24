import React, { useState, useEffect } from "react";
import { MdLocalHotel } from "react-icons/md";
import { HiCheck, HiX } from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

function ModalHotels({
  setFormik,
  setSearchResults,
}: {
  setFormik: any;
  setSearchResults: any;
}) {
  const [hotelsEnabled, setHotelsEnabled] = useState(false);
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // Initialize formik values when component mounts
  useEffect(() => {
    setFormik("includeHotel", false);
    setFormik("hotelStars", 0);
  }, []);

  // Update formik when stars change
  useEffect(() => {
    setFormik("hotelStars", stars);
  }, [stars, setFormik]);

  const toggleHotels = (enabled: boolean) => {
    setHotelsEnabled(enabled);
    setFormik("includeHotel", enabled);
    setFormik("hotelStars", stars);
  };

  const handleSelect = (enabled: boolean) => {
    setHotelsEnabled(enabled);
    setFormik("includeHotel", enabled);
    setFormik("hotelStars", enabled ? stars : 0);
    if (!enabled) {
      const modal = document.getElementById("my_modal_6");
      if (modal) {
        (modal as HTMLDialogElement).close();
      }
    }
  };

  const handleStarSelect = (starCount: number) => {
    // Update formik with the new starCount directly
    setFormik("hotelStars", starCount);
    setFormik("includeHotel", true);
    
    // Then update local state
    setStars(starCount);
    setHotelsEnabled(true);
    
    const modal = document.getElementById("my_modal_6");
    if (modal) {
      (modal as HTMLDialogElement).close();
    }
  };

  return (
    <div>
      <label
        className="text-neutral-300 mb-2 block text-xs font-medium"
        htmlFor="password"
      >
        Hospedaje
      </label>
      <button
        type="button"
        className="input w-[130px] cursor-pointer rounded-r-md bg-transparent text-xs placeholder:text-gray-400"
        onClick={(e) => {
          e.preventDefault();
          const modal = document.getElementById("my_modal_6");
          if (modal) {
            (modal as HTMLDialogElement).showModal();
          }
        }}
      >
        <MdLocalHotel />
        {hotelsEnabled ? (
          <span className="flex w-full items-center gap-1">
            Con hotel | {stars} <AiFillStar className="text-yellow-500" />
          </span>
        ) : (
          "Sin hotel"
        )}
      </button>
      <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box border-[1px] border-zinc-700 bg-zinc-800 p-4">
          <h3 className="mb-4 text-lg font-bold">¿Desea incluir hotel?</h3>
          <div className="grid gap-4 py-4">
            <motion.div
              layout
              className={`flex cursor-pointer flex-col items-start justify-start gap-3 rounded-lg border p-4 transition-colors hover:bg-zinc-800 ${
                hotelsEnabled
                  ? "border-zinc-600 shadow-md"
                  : "border-zinc-700/10"
              }`}
              onClick={() => handleSelect(true)}
              animate={{
                height: hotelsEnabled ? "auto" : "fit-content",
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
            >
              <motion.div layout className="flex items-center gap-3">
                <div
                  className={`rounded-lg border-[1px] p-2 ${
                    hotelsEnabled
                      ? "border-zinc-700 shadow-md"
                      : "border-zinc-700/10"
                  }`}
                >
                  <HiCheck
                    className={`${hotelsEnabled ? "text-green-500" : "text-gray-500"}`}
                    size={20}
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold">Sí, quiero hotel</h4>
                  <p className="text-xs text-gray-400">
                    Incluir hospedaje en mi búsqueda
                  </p>
                </div>
              </motion.div>

              <AnimatePresence>
                {hotelsEnabled && (
                  <motion.div
                    layout
                    className="mt-4 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.h4
                      className="mb-2 text-xs font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Selecciona las estrellas del hotel:
                    </motion.h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((starCount, index) => (
                        <motion.button
                          key={starCount}
                          onClick={() => handleStarSelect(starCount)}
                          onMouseEnter={() => setHoveredStar(starCount)}
                          onMouseLeave={() => setHoveredStar(null)}
                          className="p-2"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.3 + index * 0.1,
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                          whileHover={{
                            scale: 1.2,
                            rotate: [0, -10, 10, 0],
                            transition: { duration: 0.3 },
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <AiFillStar
                            size={24}
                            className={`${
                              hoveredStar
                                ? starCount <= hoveredStar
                                  ? "text-yellow-500"
                                  : "text-zinc-600"
                                : stars >= starCount
                                  ? "text-yellow-500"
                                  : "text-zinc-600"
                            } transition-colors`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div
              className={`flex cursor-pointer items-center justify-start gap-3 rounded-lg border p-4 transition-colors hover:bg-zinc-800 ${
                !hotelsEnabled
                  ? "border-zinc-600 shadow-md"
                  : "border-zinc-700/10"
              }`}
              onClick={() => handleSelect(false)}
            >
              <div
                className={`rounded-lg border-[1px] p-2 ${
                  !hotelsEnabled
                    ? "border-zinc-700 shadow-md"
                    : "border-zinc-700/10"
                }`}
              >
                <HiX
                  className={`${!hotelsEnabled ? "text-red-500" : "text-gray-500"}`}
                  size={20}
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold">No, gracias</h4>
                <p className="text-xs text-gray-400">Buscar solo vuelos</p>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ModalHotels;
