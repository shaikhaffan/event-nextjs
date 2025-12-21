import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {Event} from "@/schema";

// export async function GET(
//   _req: Request,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//      console.log("Fetching1 params with slug:", params);

//     const slug = params?.slug;
//     console.log("Fetching event with slug:", slug);

//     if (!slug) {
//       return NextResponse.json({ error: "Slug required" }, { status: 400 });
//     }

//     await connectDB();

//     const event = await Event.findOne({ slug }).lean();
//     if (!event) {
//       return NextResponse.json({ error: "Event not found" }, { status: 404 });
//     }

//     return NextResponse.json(event);
//   } catch (err: any) {
//     console.error("GET /api/events/[slug] error:", err);
//     return NextResponse.json(
//       { error: err?.message || "Unknown error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;  // ✅ unwrap params

    console.log("Fetching1 event with slug:", slug);

    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    await connectDB();

    const event = await Event.findOne({ slug });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err: any) {
    console.error("GET /api/events/[slug] error:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
