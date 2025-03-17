import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const isAuthPage = router.pathname.startsWith('/auth');

  return (
    <SessionProvider session={session}>
      <main data-theme="dark" className={inter.className}>
        {isAuthPage ? (
          <Component {...pageProps} />
        ) : (
          <Navbar>
            <Component {...pageProps} />
          </Navbar>
        )}
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
