import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createNoteSchema = z.object({
  clientId: z.string(),
  content: z.string().min(1, 'Note content is required'),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createNoteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error },
        { status: 400 }
      );
    }

    const { clientId, content } = validation.data;

    // Verify client belongs to this matchmaker
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { assignedMatchmakerId: true },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (client.assignedMatchmakerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create note
    const note = await prisma.note.create({
      data: {
        clientId,
        matchmakerId: session.user.id,
        content,
      },
      include: {
        matchmaker: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
