import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import Booking from '../../../schema/booking';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, userEmail } = body;

    if (!eventId || !userEmail) {
      return NextResponse.json({ error: 'eventId and userEmail are required' }, { status: 400 });
    }

    await connectDB();

    const booking = await Booking.create({ eventId, userEmail });

    return NextResponse.json(booking, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
