'use client';
import Image from "next/image";
import { memo } from "react";

const Explore = () => {
  return <button className="mt-7 mx-auto"  type="button" id="explore-btn" onClick={() => console.log("CLICK")}>
    <a href="#events">
        Explore Events
        <Image src="/icons/audience.svg" alt="arrow-down" width={24} height={24} />
    </a>

  </button>
};

export default memo(Explore);
