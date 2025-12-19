import EventCard from "@/components/EventCard";
import Explore from "@/components/Explore";
import Image from "next/image";
import {upcomingEvents} from '@/lib/constants'

export default function Home() {
  return (
    <section>
      <h1 className="text-center">
        The hub for every dev <br /> Event you can't Miss
      </h1>
      <p className="text-center mt-2">
        Hacton, meetup, conferences, All in one
      </p>
      <Explore/>
      <div className="mt-20 space-y-7" >
        <h3>Featured Events</h3>

      <ul className="events">
          {upcomingEvents.map((event, index) => (
           <EventCard date={event.date} time={event.time} slug={event.slug} location={event.location} title={event.title} image={event.imageUrl}/>
          ))}
</ul>

      </div>
    </section>
  );
}
