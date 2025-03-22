"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import { signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PiAirplaneFill } from "react-icons/pi";

import { useSession } from "next-auth/react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

function Auth() {
  const router = useRouter();
  const { mode } = router.query;
  const isRegisterMode = mode === "register";

  const { data: session, status } = useSession() as {
    data: { user: { name: string } } | null;
    status: string;
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-800">
      <div className="flex w-[430px] max-w-sm flex-col items-center justify-center rounded p-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <PiAirplaneFill size={30} className="text-blue-600" />
          <h2 className="mb-4 text-2xl font-bold">Ingresa a FlyTickets</h2>
        </div>
        {isRegisterMode ? <RegisterForm /> : <LoginForm />}
        <div className="divider text-xs"></div>
        <button
          onClick={() => {
            router.push(`/auth?mode=${isRegisterMode ? "login" : "register"}`);
          }}
          className="btn w-full bg-zinc-700 text-xs"
        >
          {isRegisterMode ? "Iniciar Sesión" : "Crear Nueva Cuenta"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
