'use server'

import { Event } from "@/schema";
import { connectDB } from "../db";





export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();
    } catch {
        return [];
    }
}
// just call this function frim anywhere in the app directory