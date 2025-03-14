import React from "react";
import { useFormik } from "formik";
import { signIn, useSession, signOut } from "next-auth/react";
import axios from "axios";
import router from "next/router";

function RegisterForm() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      console.log(values);

      const body = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      const response = await axios.post("/api/user", body);

      const res = await signIn("credentials", {
        email: response.data.email,
        password: values.password,
        redirect: false,
      });

      console.log("res", res);

      if (res?.ok) return router.push("/");

      console.log(response);
    },
  });

  //   const { data: session, status } = useSession();
  //   console.log("useSession:", session, status);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {/* <div>{session?.user.name}</div> */}
      <button onClick={() => signOut()}>Log Out</button>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-sm rounded bg-white p-6"
      >
        <h2 className="mb-4 text-2xl font-bold">Registra una cuenta</h2>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="name"
          >
            Nombre
          </label>
          <input
            className="focus:-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            id="name"
            onChange={formik.handleChange}
            type="text"
            name="name"
            placeholder="Jhon Doe"
          />
        </div>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="focus:-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            id="email"
            onChange={formik.handleChange}
            type="email"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className="mb-6">
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            name="password"
            onChange={formik.handleChange}
            className="focus:-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            id="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="focus:-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
