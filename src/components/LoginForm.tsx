import React, { useEffect } from "react";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function LoginForm() {
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
    <form
      onSubmit={formik.handleSubmit}
      className="flex w-[430px] max-w-sm flex-col items-center justify-center gap-4 rounded p-6"
    >
      <div className="flex w-full flex-col">
        <label
          className="mb-2 block text-xs font-medium text-neutral-300"
          htmlFor="password"
        >
          Correo electronico*
        </label>
        <label className="input validator w-full bg-zinc-900">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </g>
          </svg>
          <input
            className="input-sm"
            id="email"
            onChange={formik.handleChange}
            type="email"
            name="email"
            placeholder="my@email.com"
            required
          />
        </label>
        <div className="validator-hint hidden text-xs">
          Ingresa un correo valido
        </div>
      </div>

      <div className="w-full">
        <label
          className="mb-2 block text-xs font-medium text-neutral-300"
          htmlFor="password"
        >
          Contraseña*
        </label>
        <label className="input w-full bg-zinc-900">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
            </g>
          </svg>
          <input
            className="input-sm"
            type="password"
            required
            placeholder="*******"
            name="password"
            id="password"
            onChange={formik.handleChange}
            // minLength={8}
            // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            // title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          />
        </label>
        {/* <p className="validator-hint hidden text-xs">
      Must be more than 8 characters, including
      <br />
      At least one number
      <br />
      At least one lowercase letter
      <br />
      At least one uppercase letter
    </p> */}
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <button type="submit" className="btn w-full bg-blue-700 text-xs">
          Ingresar
        </button>
      </div>
      {/* <button onClick={() => signIn("github")}>Sign In with GitHub</button> */}
    </form>
  );
}

export default LoginForm;
