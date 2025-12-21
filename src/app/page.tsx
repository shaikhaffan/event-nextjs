import EventCard from "@/components/EventCard";
import Explore from "@/components/Explore";
import Image from "next/image";
import { upcomingEvents } from "@/lib/constants";
import { Suspense, use } from "react";
import { IEvent } from "@/schema";
import { EventData } from "@/schema/event";

// This function can be defined outside the component
async function fetchUserData() {
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

          <ul className="events">
            {userData &&
              userData.length > 0 &&
              userData.map((event: EventData, index: number) => (
                <EventCard
                  date={event.date}
                  time={event.time}
                  slug={event.slug}
                  location={event.location}
                  title={event.title}
                  image={event.imageUrl}
                />
              ))}
          </ul>
        </div>
      </section>
    </Suspense>
  );
}
