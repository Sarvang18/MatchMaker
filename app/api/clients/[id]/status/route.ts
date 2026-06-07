import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/clients/[id]/status
 * Lightweight status check for polling
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { id: params.id },
      select: {
        status: true,
        assignedMatchmakerId: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Verify client belongs to this matchmaker
    if (client.assignedMatchmakerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch latest match
    const latestMatch = await prisma.match.findFirst({
      where: { clientId: params.id },
      orderBy: { sentAt: 'desc' },
      include: {
        matchedWith: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: client.status,
      latestMatch: latestMatch ? {
        id: latestMatch.id,
        status: latestMatch.status,
        matchedWith: latestMatch.matchedWith,
        respondedAt: latestMatch.respondedAt?.toISOString() || null,
      } : null,
    });
  } catch (error) {
    console.error('Error fetching client status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
