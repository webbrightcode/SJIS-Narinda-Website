import React from 'react';
import { getLandingBundle } from '@/lib/api';
import { HeroSlider } from '@/components/sections/HeroSlider';
import { StatsBar } from '@/components/sections/StatsBar';
import { WelcomeSection } from '@/components/sections/WelcomeSection';
import { NoticeBoardWidget } from '@/components/sections/NoticeBoardWidget';
import { NewsShowcase } from '@/components/sections/NewsShowcase';
import { ClubsShowcase } from '@/components/sections/ClubsShowcase';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CampusLocation } from '@/components/sections/CampusLocation';
import type { Metadata } from 'next';
import type { SliderSlide } from '@/lib/types';

export const metadata: Metadata = {
  title: { absolute: 'St. Joseph International School, Narinda (SJIS Narinda) | Holy Cross School, Old Dhaka' },
  alternates: { canonical: '/' },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const bundle = await getLandingBundle();

  // Seamlessly incorporate active featured events/stories into the homepage Hero Slider
  const slides: SliderSlide[] = [...(bundle.slides || [])];
  const existingSlideLinks = new Set(
    slides.map((s) => (s.cta_link || '').trim().toLowerCase()).filter(Boolean)
  );
  const existingSlideTitles = new Set(
    slides.map((s) => (s.title || '').trim().toLowerCase()).filter(Boolean)
  );

  if (bundle.news && Array.isArray(bundle.news)) {
    bundle.news
      .filter((n) => n.is_active && n.is_featured)
      .forEach((n) => {
        const link = `/news/${n.slug || n.id}`.toLowerCase();
        const titleKey = (n.title || '').trim().toLowerCase();
        if (!existingSlideLinks.has(link) && !existingSlideTitles.has(titleKey)) {
          const coverImg = n.image_url || (n.gallery_images && n.gallery_images[0]) || '';
          slides.push({
            id: 900000 + n.id,
            title: n.title,
            subtitle: n.summary || '',
            badge: n.category === 'events' ? '⭐ Featured Event' : '⭐ Campus News',
            image_url: coverImg,
            cta_text: 'Read Full Story',
            cta_link: `/news/${n.slug || n.id}`,
            secondary_cta_text: 'All News & Events',
            secondary_cta_link: '/news',
            order: 2,
            is_active: true,
          });
          existingSlideLinks.add(link);
          existingSlideTitles.add(titleKey);
        }
      });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Fullscreen Slider */}
      <HeroSlider slides={slides} />

      {/* 2. Institutional Stats Bar */}
      <StatsBar stats={bundle.about?.stats} />

      {/* 3. Welcome / Principal & Heritage Section */}
      <WelcomeSection about={bundle.about} />

      {/* 4. Notice Board & Official Circulars */}
      <NoticeBoardWidget notices={bundle.notices} />

      {/* 4b. School News & Events (photo stories) */}
      <NewsShowcase news={bundle.news || []} />

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
