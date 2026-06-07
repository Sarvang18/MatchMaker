import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateIntroEmail } from '@/lib/gemini';

/**
 * POST /api/matches/[matchId]/prepare-send
 * Generates AI intro email for a match
 */
export async function POST(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { matchId } = params;

    // Fetch the match with full client and candidate data
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        client: true,
        matchedWith: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Verify the match belongs to a client of this matchmaker
    if (match.client.assignedMatchmakerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate intro email via Gemini
    const introEmail = await generateIntroEmail(match.client, match.matchedWith);

    // Save the generated email to the match record
    await prisma.match.update({
      where: { id: matchId },
      data: { aiIntroEmail: introEmail },
    });

    return NextResponse.json({
      matchId,
      introEmail,
    });
  } catch (error) {
    console.error('Error generating intro email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
