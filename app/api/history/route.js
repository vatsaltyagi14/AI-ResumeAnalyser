import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/config/database';
import Analysis from '@/models/Analysis';

export async function GET(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const userId = session.user.id;

    const analyses = await Analysis.find({ user: userId }).sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify(analyses), { status: 200 }); //usi user ko dhoondke uska anlysis bhejdiya
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
