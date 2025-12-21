'use client';
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import posthog from "posthog-js";
import { IEvent } from "@/schema";
import { EventData } from "@/schema/event";



const EventCard = (props: EventData) => {
  const { title, image, slug, location, date, time } = props;
  
  const handleEventCardClick = () => {
    posthog.capture('event_card_clicked', {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
      event_time: time,
    });
  };

  return (
    <Link href={`/events/${slug}`} id={"event-card"} onClick={handleEventCardClick}>
       <Image src={image} alt={title} width={410} height={300} className="poster"/>
      <div className="flex flex-row gap-2">
        <Image src={'/icons/pin.svg'} alt={title} width={14} height={14} />
        <p>{location}</p>
      </div>
      <p>{title}</p>

       <div className="datetime">
        <div>
           <Image src={'/icons/calendar.svg'} alt={title} width={14} height={14} />
          <p>{date}</p>
        </div>
         <div>
           <Image src={'/icons/clock.svg'} alt={title} width={14} height={14} />
          <p>{time}</p>
        </div>
      </div>

    </Link>
  );
};

export default memo(EventCard);
