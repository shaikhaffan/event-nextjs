export interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  imageUrl: string;
  attendees: number;
}

export const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Tech Conference 2025",
    slug: "tech-conference-2025",
    date: "2025-01-15",
    time: "09:00 AM",
    location: "San Francisco, CA",
    description: "Annual tech conference featuring keynote speakers and workshops",
    category: "Conference",
    imageUrl: "/images/event1.png",
    attendees: 500,
  },
  {
    id: 2,
    title: "React Workshop",
    slug: "react-workshop",
    date: "2025-01-20",
    time: "02:00 PM",
    location: "New York, NY",
    description: "Hands-on workshop to master React hooks and advanced patterns",
    category: "Workshop",
    imageUrl: "/images/event2.png",
    attendees: 150,
  },
  {
    id: 3,
    title: "Web Development Meetup",
    slug: "web-development-meetup",
    date: "2025-01-25",
    time: "06:30 PM",
    location: "Austin, TX",
    description: "Monthly meetup for web developers to share projects and ideas",
    category: "Meetup",
    imageUrl: "/images/event3.png",
    attendees: 75,
  },
  {
    id: 4,
    title: "JavaScript Summit",
    slug: "javascript-summit",
    date: "2025-02-10",
    time: "10:00 AM",
    location: "Los Angeles, CA",
    description: "Comprehensive summit covering modern JavaScript and frameworks",
    category: "Summit",
    imageUrl: "/images/event4.png",
    attendees: 1000,
  },
  {
    id: 5,
    title: "Next.js Masterclass",
    slug: "nextjs-masterclass",
    date: "2025-02-18",
    time: "01:00 PM",
    location: "Chicago, IL",
    description: "In-depth masterclass on building scalable applications with Next.js",
    category: "Class",
    imageUrl: "/images/event5.png",
    attendees: 200,
  },
];
