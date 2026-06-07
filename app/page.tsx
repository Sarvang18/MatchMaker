import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          TDC Matchmaker Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Phase 1 Complete ✅
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-4">Setup Status</h2>
          <ul className="text-left space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Next.js 14 with TypeScript
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Tailwind CSS + shadcn/ui
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Prisma ORM configured
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Database schema ready
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Seed script with 100 profiles
            </li>
          </ul>
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-700">
              <strong>Get started:</strong> Sign in to access the dashboard
            </p>
            <a
              href="/login"
              className="block mt-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-pink-700 hover:to-purple-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
