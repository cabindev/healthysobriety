import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phoneNumber = searchParams.get('phoneNumber');

  if (!phoneNumber) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
  }

  try {
    const form = await prisma.form_return.findUnique({
      where: { phoneNumber },
    });

    if (form) {
      return NextResponse.json({ exists: true });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking phone number:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
