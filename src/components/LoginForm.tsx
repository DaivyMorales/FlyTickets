import React, { useEffect, useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('failedAttempts') || '0')
    }
    return 0;
  });
  const [lockoutTime, setLockoutTime] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lockoutUntil');
      return stored ? Number(stored) : null;
    }
    return null;
  });
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
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

  // Check if still locked out
  useEffect(() => {
    const checkLockout = () => {
      const now = Date.now();
      if (lockoutTime && now < lockoutTime) {
        const minutesLeft = Math.ceil((lockoutTime - now) / 60000);
        setError(`Demasiados intentos. Espera ${minutesLeft} minutos.`);
      } else if (lockoutTime) {
        setLockoutTime(null);
        localStorage.removeItem('lockoutUntil');
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleFailedAttempt = () => {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    localStorage.setItem('failedAttempts', String(newAttempts));

    if (newAttempts >= 3) {
      const lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      setLockoutTime(lockoutUntil);
      localStorage.setItem('lockoutUntil', String(lockoutUntil));
      setError('Demasiados intentos. Espera 15 minutos.');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      if (lockoutTime && Date.now() < lockoutTime) {
        const minutesLeft = Math.ceil((lockoutTime - Date.now()) / 60000);
        setError(`Demasiados intentos. Espera ${minutesLeft} minutos.`);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        // Check reCAPTCHA if needed
        if (failedAttempts >= 2) {
          const token = recaptchaRef.current?.getValue();
          if (!token) {
            setError("Por favor, complete el captcha");
            setIsLoading(false);
            return;
          }
          // Reset captcha after verification
          recaptchaRef.current?.reset();
        }

        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (res?.error) {
          handleFailedAttempt();
          setError("Tu correo o contraseña son incorrectos. Verifica!");
        } else {
          // Reset counters on successful login
          setFailedAttempts(0);
          setLockoutTime(null);
          localStorage.removeItem('failedAttempts');
          localStorage.removeItem('lockoutUntil');
          router.push("/");
        }
      } catch (error) {
        setError("Error al iniciar sesión");
        handleFailedAttempt();
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (status === "loading" || status === "authenticated") {
    return <div>Loading...</div>;
  }

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
        <label className="input  w-full bg-zinc-900">
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
            disabled={!!(lockoutTime && Date.now() < lockoutTime)}
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
            disabled={!!(lockoutTime && Date.now() < lockoutTime)}
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
      
      {failedAttempts >= 2 && (
        <div className="w-full flex justify-center mb-4">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
            onChange={() => setError("")} // Clear error when captcha is completed
          />
        </div>
      )}

      {error && (
        <div className="w-full text-center text-xs font-semibold text-red-500">
          {error}
        </div>
      )}
      <div className="flex w-full items-center justify-between gap-4">
        <button 
          type="submit" 
          className="btn w-full bg-blue-700 text-xs"
          disabled={isLoading || (lockoutTime ? Date.now() < lockoutTime : false)}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Ingresando...
            </>
          ) : (
            'Ingresar'
          )}
        </button>
      </div>
      {/* <button onClick={() => signIn("github")}>Sign In with GitHub</button> */}
    </form>
  );
}

export default LoginForm;
