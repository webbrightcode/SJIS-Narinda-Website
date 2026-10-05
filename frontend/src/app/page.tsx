import React from 'react';
import { getLandingBundle } from '@/lib/api';
import { HeroSlider } from '@/components/sections/HeroSlider';
import { StatsBar } from '@/components/sections/StatsBar';
import { WelcomeSection } from '@/components/sections/WelcomeSection';
import { NoticeBoardWidget } from '@/components/sections/NoticeBoardWidget';
import { ClubsShowcase } from '@/components/sections/ClubsShowcase';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CampusLocation } from '@/components/sections/CampusLocation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const bundle = await getLandingBundle();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Fullscreen Slider */}
      <HeroSlider slides={bundle.slides} />

      {/* 2. Institutional Stats Bar */}
      <StatsBar stats={bundle.about?.stats} />

      {/* 3. Welcome / Principal & Heritage Section */}
      <WelcomeSection about={bundle.about} />

      {/* 4. Notice Board & Official Circulars */}
      <NoticeBoardWidget notices={bundle.notices} />

      {/* 5. Clubs & Co-curricular Societies */}
      <ClubsShowcase clubs={bundle.clubs} />

      {/* 6. Campus Moments & Gallery Showcase */}
      <GalleryPreview items={bundle.gallery} />

      {/* 7. Voices of the Community: Testimonials */}
      <TestimonialsSection items={bundle.testimonials} />

      {/* 8. Admissions Call-To-Action Banner */}
      <AdmissionCTA />

      {/* 9. Campus Location & Interactive Map */}
      <CampusLocation />
    </div>
  );
}
