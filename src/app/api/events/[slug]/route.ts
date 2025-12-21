import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Event } from '@/schema';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

    await connectDB();

    const event = await Event.findOne({ slug }).lean().exec();
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    return NextResponse.json(event);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
