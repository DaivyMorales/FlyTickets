import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-800 space-y-4">
        <p className="text-xs font-bold text-white">
          Bienvenido, {session.user?.name}!
        </p>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-white rounded-md text-xs  transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  

  return null; // Remove the unauthenticated state UI since we're redirecting
};

export default HomePage;