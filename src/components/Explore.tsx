'use client';
import Image from "next/image";
import { memo } from "react";
import posthog from "posthog-js";

const Explore = () => {
  const handleExploreClick = () => {
    posthog.capture('explore_events_clicked', {
      button_location: 'homepage_hero',
    });
  };

  return <button className="mt-7 mx-auto"  type="button" id="explore-btn" onClick={handleExploreClick}>
    <a href="#events">
        Explore Events
        <Image src="/icons/audience.svg" alt="arrow-down" width={24} height={24} />
    </a>

  </button>
};

export default memo(Explore);
