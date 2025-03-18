import React, { useState } from "react";
import { PiCalendarDotsFill } from "react-icons/pi";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { FaPersonRunning, FaBriefcase, FaCrown } from "react-icons/fa6";

function ModalCategory() {
  const [selectedCategory, setSelectedCategory] = useState("Business");

  return (
    <div>
      <label
        className="text-neutral-300 mb-2 block text-xs font-medium"
        htmlFor="password"
      >
        Categoría
      </label>
      <button
        className="input w-[100px] cursor-pointer rounded-r-md bg-zinc-900 text-xs placeholder:text-gray-400"
        onClick={() => {
          const modal = document.getElementById("my_modal_5");
          if (modal) {
            (modal as HTMLDialogElement).showModal();
          }
        }}
      >
        <HiMiniCheckBadge />
        {selectedCategory}
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box border-[1px] border-zinc-700 bg-zinc-800 p-4">
          <h3 className="text-lg font-bold">Selecciona una categoría</h3>
          <div className="grid gap-4 py-4">
            <div
              className={`flex cursor-pointer items-center justify-start gap-3 rounded-lg border p-4 transition-colors hover:bg-zinc-800 ${
                selectedCategory === "Turista" ? "border-zinc-600 shadow-md" : "border-zinc-700/10"
              }`}
              onClick={() => {
                setSelectedCategory("Turista");
                const modal = document.getElementById("my_modal_5");
                if (modal) {
                  (modal as HTMLDialogElement).close();
                }
              }}
            >
              <div className={`rounded-lg border-[1px] p-2 ${
                selectedCategory === "Turista" ? "border-zinc-700 shadow-md" : "border-zinc-700/10"
              }`}>
                <FaPersonRunning />
              </div>
              <div className="flex flex-col">
                {" "}
                <h4 className="text-sm font-semibold">Turista</h4>
                <p className="text-xs text-gray-400">
                  Viaja con comodidad básica
                </p>
              </div>
            </div>

            <div
              className={`flex cursor-pointer items-center justify-start gap-3 rounded-lg border p-4 transition-colors hover:bg-zinc-800 ${
                selectedCategory === "Business" ? "border-zinc-600 shadow-md" : "border-zinc-700/10"
              }`}
              onClick={() => {
                setSelectedCategory("Business");
                const modal = document.getElementById("my_modal_5");
                if (modal) {
                  (modal as HTMLDialogElement).close();
                }
              }}
            >
              <div className={`rounded-lg border-[1px] p-2 ${
                selectedCategory === "Business" ? "border-zinc-700 shadow-md" : "border-zinc-700/10"
              }`}>
                <FaBriefcase size={14}/>
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold">Business</h4>
                <p className="text-xs text-gray-400">
                  Mayor comodidad y servicios exclusivos
                </p>
              </div>
            </div>

            <div
              className={`flex cursor-pointer items-center justify-start gap-3 rounded-lg border p-4 transition-colors hover:bg-zinc-800 ${
                selectedCategory === "Gold" ? "border-zinc-600 shadow-md" : "border-zinc-700/10"
              }`}
              onClick={() => {
                setSelectedCategory("Gold");
                const modal = document.getElementById("my_modal_5");
                if (modal) {
                  (modal as HTMLDialogElement).close();
                }
              }}
            >
              <div className={`rounded-lg border-[1px] p-2 ${
                selectedCategory === "Gold" ? "border-zinc-700 shadow-md" : "border-zinc-700/10"
              }`}>
                <FaCrown size={15}/>
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold">Gold</h4>
                <p className="text-xs text-gray-400">
                  Experiencia premium y atención VIP
                </p>
              </div>
            </div>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn w-[85px] rounded-md bg-blue-700 text-xs">¡Ok!</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ModalCategory;
