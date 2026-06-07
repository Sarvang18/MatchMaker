import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifyMagicToken } from '@/lib/token';
import { PortalProfile } from '@/components/portal/PortalProfile';
import { ExpiredLink } from '@/components/portal/ExpiredLink';

export default async function MatchPortalPage({ params }: { params: { token: string } }) {
  // Verify token
  const payload = verifyMagicToken(params.token);

  if (!payload) {
    return <ExpiredLink />;
  }

  // Fetch match data
  const match = await prisma.match.findUnique({
    where: { id: payload.matchId },
    include: {
      client: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      matchedWith: true,
    },
  });

  if (!match) {
    return notFound();
  }

  // Check if already responded
  const alreadyResponded = !!match.respondedAt;

  return (
    <PortalProfile
      token={params.token}
      matchId={match.id}
      clientFirstName={match.client.firstName}
      candidate={match.matchedWith}
      introEmail={match.aiIntroEmail || ''}
      alreadyResponded={alreadyResponded}
      responseStatus={match.status}
    />
  );
}
