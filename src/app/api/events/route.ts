import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Event } from '@/schema/index';
import { v2 as cloudinary } from 'cloudinary';
import { revalidateTag } from 'next/cache';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request) {
  try {
    await connectDB();
    console.log("Connected to database");
    const events = await Event.find().sort({ date: 1 }).lean().exec();
    return NextResponse.json(events);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const venue = formData.get('venue') as string;
    const category = formData.get('category') as string;
    const capacity = formData.get('capacity') as string;
    const organizer = formData.get('organizer') as string;
    const price = formData.get('price') as string;
    const imageFile = formData.get('image') as File | null;

    if (!title || !description || !date || !time || !location || !venue || !category || !capacity || !organizer) {
      return NextResponse.json({ error: 'Missing required event fields' }, { status: 400 });
    }

    await connectDB();

    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'events' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      imageUrl = (uploadResult as any).secure_url;
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      venue,
      category,
      capacity: parseInt(capacity),
      organizer,
      price: price ? parseFloat(price) : 0,
      image: imageUrl,
    });
    revalidateTag('events', 'hours');
    return NextResponse.json({ event, message: 'Event created successfully' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
