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
  const { data: session, status } = useSession() as {
    data: { user: { name: string } } | null;
    status: string;
  };
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      console.log(values);

      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        console.error("Failed to sign in:", res.error);
      } else {
        router.push("/");
      }
    },
  });

  if (status === "loading" || status === "authenticated") {
    return <div>Loading...</div>;
  }

  console.log("useSession:", session);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-800">
      <div className="flex w-[430px] max-w-sm flex-col items-center justify-center rounded p-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <PiAirplaneFill size={30} className="text-blue-600" />
          <h2 className="mb-4 text-2xl font-bold">Ingresa a FlyTickets</h2>
        </div>
        <RegisterForm />
        <div className="divider text-xs"></div>
        <button className="btn w-full bg-zinc-700 text-xs">
          Crear Nueva Cuenta
        </button>
      </div>
    </div>
  );
}

export default Auth;
