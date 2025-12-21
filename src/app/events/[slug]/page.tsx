import { use } from "react";

// This function can be defined outside the component
async function fetchEventDetails(slug: string) {
  const response = await fetch(`http://localhost:3000/api/events/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
}

const EventDetailsPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const eventDetailsBySlug = use(fetchEventDetails(slug));
  return (
    <div>
      <h2>Page</h2>
    </div>
  );
};

export default EventDetailsPage;
