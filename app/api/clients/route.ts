import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createClientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const age = new Date().getFullYear() - dob.getFullYear();
    return age >= 18 && age <= 60;
  }, 'Age must be between 18 and 60'),
  maritalStatus: z.enum(['NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']),
  motherTongue: z.string().min(1),
  country: z.string().default('India'),
  city: z.string().min(1, 'City is required'),
  height: z.number().min(100).max(250),
  nriStatus: z.boolean().default(false),
  languagesKnown: z.array(z.string()).min(1, 'At least one language is required'),
  undergradCollege: z.string().min(1, 'College is required'),
  degree: z.string().min(1, 'Degree is required'),
  currentCompany: z.string().min(1, 'Company is required'),
  designation: z.string().min(1, 'Designation is required'),
  income: z.number().min(0, 'Income must be positive'),
  familyType: z.enum(['NUCLEAR', 'JOINT']),
  siblings: z.number().min(0).default(0),
  caste: z.string().min(1, 'Caste is required'),
  religion: z.string().min(1, 'Religion is required'),
  dietaryPreference: z.enum(['VEG', 'NON_VEG', 'JAIN', 'EGGETARIAN']),
  drinking: z.enum(['YES', 'NO', 'OCCASIONALLY']),
  smoking: z.enum(['YES', 'NO', 'OCCASIONALLY']),
  wantKids: z.enum(['YES', 'NO', 'MAYBE']),
  openToRelocate: z.enum(['YES', 'NO', 'MAYBE']),
  openToPets: z.enum(['YES', 'NO', 'MAYBE']),
  horoscopeRequired: z.boolean().default(false),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  bio: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      where: {
        assignedMatchmakerId: session.user.id,
      },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createClientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create client and assign to the logged-in matchmaker
    const client = await prisma.client.create({
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        status: 'ACTIVE',
        assignedMatchmakerId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, clientId: client.id });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
