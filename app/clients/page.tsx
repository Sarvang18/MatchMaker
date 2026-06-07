import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ClientList } from '@/components/dashboard/client-list';
import { prisma } from '@/lib/db';

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Fetch all clients
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      gender: true,
      city: true,
      religion: true,
      status: true,
      photoUrl: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 pl-60">
      <div className="p-8">
        <ClientList clients={clients} />
      </div>
    </div>
  );
}
