'use client';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import posthog from 'posthog-js';

const Navbar = () => {
  const handleLogoClick = () => {
    posthog.capture('logo_clicked', {
      nav_location: 'header',
    });
  };

  const handleNavHomeClick = () => {
    posthog.capture('nav_home_clicked', {
      nav_location: 'header',
    });
  };

  const handleNavEventsClick = () => {
    posthog.capture('nav_events_clicked', {
      nav_location: 'header',
    });
  };

  const handleNavCreateEventsClick = () => {
    posthog.capture('nav_create_events_clicked', {
      nav_location: 'header',
    });
  };

  return (
    <header>
      <nav>
        <Link href='/' className='logo' onClick={handleLogoClick}>
        <Image src="/icons/logo.png" alt='logo' width={24} height={24}/>
        <p>DevEvent</p>

        </Link>
         <ul>
            <Link href="/" onClick={handleNavHomeClick}>Home</Link>
            <Link  href="/" onClick={handleNavEventsClick}>Events</Link>
            <Link  href="/" onClick={handleNavCreateEventsClick}>Create Events</Link>
        </ul>
      </nav>
    </header>
  );
};

export default memo(Navbar);