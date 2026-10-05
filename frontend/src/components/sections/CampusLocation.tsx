'use client';

import React from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useSiteSettings, telHref } from '@/components/layout/SiteSettingsContext';

export const CampusLocation: React.FC = () => {
  const site = useSiteSettings();
  return (
    <section className="py-20 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={20} duration={600}>
          <SectionHeading
            badge="Visit Our Campus"
            title="Campus Location & Visiting Hours"
            subtitle="Situated in historic Narinda, our secure campus offers modern facilities in the cultural heart of Old Dhaka."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-12">
          {/* Information Dossier */}
          <ScrollReveal direction="right" distance={30} duration={650} className="lg:col-span-5 h-full">
            <div className="h-full flex flex-col justify-between space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#C8102E] shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#00183F]">Campus Address</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                      {site.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#00183F]">Administrative & Visiting Hours</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {site.office_hours}
                      {site.weekend_note && (<><br />{site.weekend_note}</>)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#00183F] shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#00183F]">Telephone & Admissions Desk</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      <a href={telHref(site.phone_primary)} className="hover:text-[#C8102E]">{site.phone_primary}</a>
                      {site.phone_secondary && <> / <a href={telHref(site.phone_secondary)} className="hover:text-[#C8102E]">{site.phone_secondary}</a></>}
                      <br />
                      <a href={`mailto:${site.email}`} className="hover:text-[#C8102E]">{site.email}</a>
                    </p>
                  </div>
                </div>

                {site.security_note && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-xs text-emerald-800 font-medium">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{site.security_note}</span>
                </div>
                )}
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <a
                  href={site.map_link || `https://maps.google.com/?q=${encodeURIComponent(site.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00183F] hover:bg-[#071936] text-white text-xs font-bold shadow-md transition-all"
                >
                  <Navigation className="w-4 h-4 text-[#D4AF37]" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <Button href="/admission" variant="secondary" size="sm">
                  Schedule Physical Tour
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Interactive Map Embed */}
          <ScrollReveal direction="left" distance={30} delay={150} duration={650} className="lg:col-span-7 h-full">
            <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 min-h-[380px] h-full relative bg-slate-100">
              {site.map_embed_url ? (
              <iframe
                title="St. Joseph International School Narinda Map"
                src={site.map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] contrast-[1.05]"
              />
              ) : (
                <div className="w-full h-full min-h-[400px] flex items-center justify-center text-sm text-slate-500">Map not configured.</div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
