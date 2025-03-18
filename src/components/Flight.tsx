import React from "react";

function Flight() {
  return (
    <div className="flex h-full w-full items-center justify-center border-t-[1px] border-zinc-700 bg-zinc-900 p-4 shadow-inner">
      <div className="flex w-[800px] justify-between rounded-md border-[1px] border-zinc-700 bg-zinc-800 shadow-inner">
        <div className="px-4 py-10">
          <h3 className="text-xl font-semibold"> 12:34</h3>
          <p className="text-xs font-medium">Bogotá, Colombia</p>
        </div>
        <div className="px-4 py-10">
          <h3 className="text-xl font-semibold"> 22:03</h3>
          <p className="text-xs font-medium">Tokyo, Japón</p>
        </div>
        <div className="rounded-r-md flex flex-col justify-center gap-2 border-l-[1px] border-zinc-700 bg-zinc-900 p-2 px-6 py-4">
          <h3 className="text-xl font-bold">
            {" "}
            <p className="text-xs font-semibold">COP</p> 1.350.000
          </h3>
          <button className="btn w-[100px] rounded-md bg-blue-700 text-xs">
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Flight;
