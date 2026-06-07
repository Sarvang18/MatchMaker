import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  status: z.enum([
    'ONBOARDED',
    'ACTIVE',
    'MATCH_SENT',
    'MUTUAL_INTEREST',
    'MEETING_SCHEDULED',
    'CLOSED_WON',
    'CLOSED_LOST',
  ]),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get client with notes
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
          include: {
            matchmaker: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Verify client belongs to this matchmaker
    if (client.assignedMatchmakerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error },
        { status: 400 }
      );
    }

    // Check if client belongs to this matchmaker
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      select: { assignedMatchmakerId: true },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (client.assignedMatchmakerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the client status
    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: { status: validation.data.status },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        city: true,
        gender: true,
        religion: true,
        status: true,
        photoUrl: true,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
