import EventCard from "@/components/EventCard";
import Explore from "@/components/Explore";
import Image from "next/image";
import { upcomingEvents } from "@/lib/constants";
import { Suspense, use } from "react";
import { IEvent } from "@/schema";
import { EventData } from "@/schema/event";
import { cacheLife, cacheTag } from "next/cache";

// This function can be defined outside the component
async function fetchUserData() {
  'use cache';
  cacheLife('hours');
  cacheTag('events'); // we can revalidate this tag from anywhere in the app directory using revalidateTag('events')
  const response = await fetch("http://localhost:3000/api/events");
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
}

export default function Home() {
  const userData = use(fetchUserData());
  return (
    <Suspense fallback={<div>Loading user data...</div>}>
      <section>
        <h1 className="text-center">
          The hub for every dev <br /> Event you can't Miss
        </h1>
        <p className="text-center mt-2">
          Hacton, meetup, conferences, All in one
        </p>
        <Explore />
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>

          <div className="events">
            {userData &&
              userData.length > 0 &&
              userData.map((event: EventData, index: number) => (
                <EventCard
                    key={event.slug}
                  date={event.date}
                  time={event.time}
                  slug={event.slug}
                  title={event.title}
                  image={event.imageUrl}
                  location={event.location}
                  // ...rest
                />
              ))}
          </div>
        </div>
      </section>
    </Suspense>
  );
}
