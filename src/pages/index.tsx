import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 space-y-4">
        <p className="text-2xl font-bold text-green-700">
          Welcome, {session.user?.name}!
        </p>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return null; // Remove the unauthenticated state UI since we're redirecting
};

export default HomePage;