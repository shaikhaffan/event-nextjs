import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {Booking,Event } from "@/schema/index";
import { revalidateTag } from 'next/cache';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventId = body?.eventId;
    const userEmail = body?.userEmail?.toLowerCase()?.trim();

    if (!eventId || !userEmail) {
      return NextResponse.json(
        { error: "eventId and userEmail are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const alreadyBooked = await Booking.findOne({ eventId, userEmail }).lean();
    if (alreadyBooked) {
      return NextResponse.json(
        { error: "You have already booked this event" },
        { status: 400 }
      );
    }

    const booking = await Booking.create({ eventId, userEmail });
   
    return NextResponse.json(booking, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/bookings error:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
