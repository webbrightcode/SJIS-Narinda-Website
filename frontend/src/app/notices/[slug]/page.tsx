import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Download,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Pin,
  Eye,
  ExternalLink,
  Building2,
  ArrowLeft,
  Share2,
  ChevronRight,
  Clock,
  Bell,
  Mail,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { getNoticeBySlug, getNotices, getAboutInfo } from '@/lib/api';
import { Notice, AboutInfo } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { NoticeActions } from './NoticeActions';

interface NoticeDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: NoticeDetailPageProps) {
  const { slug } = await params;
  const notice = await getNoticeBySlug(slug);

  if (!notice) {
    return {
      title: 'Notice Not Found | St. Joseph International School',
    };
  }

  return {
    title: `${notice.title} | St. Joseph International School, Narinda`,
    description: notice.content.slice(0, 160),
    openGraph: {
      title: notice.title,
      description: notice.content.slice(0, 160),
      type: 'article',
      publishedTime: notice.publish_date,
    },
  };
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { slug } = await params;
  const [notice, allNotices, about] = await Promise.all([
    getNoticeBySlug(slug),
    getNotices('all', '', true),
    getAboutInfo(),
  ]);

  if (!notice) {
    notFound();
  }

  // Filter other latest notices for the sidebar
  const otherNotices = allNotices
    .filter((n) => n.id !== notice.id && n.slug !== notice.slug)
    .slice(0, 6);

  const rawAttachmentUrl = notice.attachment_url || '';
  // Sanitize any blocked dummy external links (such as w3.org) that trigger Firefox X-Frame-Options errors
  const safeAttachmentUrl = rawAttachmentUrl.includes('w3.org') || rawAttachmentUrl.includes('dummy.pdf')
    ? '/circulars/sjis-official-circular.pdf'
    : rawAttachmentUrl;
  const isImageAttachment = safeAttachmentUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(safeAttachmentUrl);
  const headTitle = about?.principal_title || 'Administrator';
  const headName = about?.principal_name || 'Brother Leo Pereira, CSC';

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link href="/" className="hover:text-[#00183F] font-semibold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <Link href="/notices" className="hover:text-[#00183F] font-semibold transition-colors">
              Notice Board
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-800 font-bold truncate max-w-xs sm:max-w-md">
              {notice.title}
            </span>
          </div>

          <Link
            href="/notices"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#00183F] hover:text-white text-slate-700 font-bold transition-all text-xs shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Circulars</span>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: Main Circular Document Body (8 Cols) */}
          <main className="lg:col-span-8 space-y-6">
            <article className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 relative overflow-hidden">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#00183F] via-[#D4AF37] to-[#C8102E]" />

              {notice.is_pinned && (
                <div className="pt-2 pb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8102E] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                    <Pin className="w-3.5 h-3.5 fill-current" />
                    Pinned Circular
                  </span>
                </div>
              )}

              {/* Circular Title & Publish Meta */}
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-[#C8102E]" />
                    <span>Issue Date: <strong className="text-slate-800 font-bold">{notice.publish_date}</strong></span>
                  </span>

                  <span className="text-slate-300">•</span>

                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Official Circular</span>
                  </span>

                  {typeof notice.views_count === 'number' && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1.5 font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
                        <Eye className="w-3.5 h-3.5 text-sky-600" />
                        <span>{notice.views_count.toLocaleString()} Total Reads</span>
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#00183F] leading-tight tracking-tight">
                  {notice.title}
                </h1>

                {/* Formal Recipient / Scope Strip */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <strong className="text-slate-800">Distribution:</strong> Concerned Students, Parents, Faculty Members, and General Notice Board.
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Status: <span className="text-emerald-700 font-bold">Active Circular</span>
                  </div>
                </div>
              </div>

              {/* Main Notice Content Body */}
              <div className="py-8 prose prose-slate max-w-none text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line border-b border-slate-200">
                {notice.content}
              </div>

              {/* Official Seal & Authorizing Sign-Off */}
              <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Authorizing Authority
                  </div>
                  <div className="text-base sm:text-lg font-black text-[#00183F]">
                    {headName}
                  </div>
                  <div className="text-xs font-semibold text-[#C8102E]">
                    {headTitle} & Head of Institution
                  </div>
                  <div className="text-xs text-slate-500">
                    St. Joseph International School, Narinda
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    SJ
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-[#00183F]">Verified Academic Circular</div>
                    <div className="text-slate-500 text-[11px]">Congregation of Holy Cross</div>
                  </div>
                </div>
              </div>

              {/* Client Interactive Action Buttons (Print, Copy, Share, Counter) */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <NoticeActions
                  noticeId={notice.id}
                  noticeTitle={notice.title}
                  initialViewsCount={notice.views_count || 0}
                  attachmentUrl={safeAttachmentUrl}
                />
              </div>
            </article>

            {/* ATTACHMENT SECTION: Pro Document Viewer & Direct Download */}
            {safeAttachmentUrl && (
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#C8102E] shrink-0 font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#00183F]">
                        Official Signed Document Attachment
                      </h3>
                      <p className="text-xs text-slate-500">
                        Certified institutional copy with stamps and authorized signatures.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={safeAttachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#00183F]" />
                      <span>Open in New Tab</span>
                    </a>

                    <a
                      href={safeAttachmentUrl}
                      download
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00183F] hover:bg-[#C8102E] text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>

                {/* Interactive Document Preview Container */}
                <div className="rounded-2xl border-2 border-slate-200 overflow-hidden shadow-inner bg-slate-900">
                  {isImageAttachment ? (
                    <div className="p-4 flex items-center justify-center bg-slate-100 min-h-[400px]">
                      <img
                        src={safeAttachmentUrl}
                        alt={notice.title}
                        className="max-h-[600px] w-auto object-contain rounded-xl shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-[650px] sm:h-[750px] bg-slate-800">
                      {/* Robust PDF Viewer with Object Embed & Direct Interactive Fallback */}
                      <object
                        data={`${safeAttachmentUrl}#toolbar=1&navpanes=0`}
                        type="application/pdf"
                        className="w-full h-full border-0 bg-white"
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 text-center space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
                            <FileText className="w-8 h-8" />
                          </div>
                          <h4 className="text-white font-bold text-lg">Official Certified Circular Document</h4>
                          <p className="text-slate-300 text-xs max-w-md leading-relaxed">
                            Click below to open the complete signed institutional document in high resolution or download a copy to your device.
                          </p>
                          <div className="flex items-center gap-3 pt-2">
                            <a
                              href={safeAttachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Open Document</span>
                            </a>
                            <a
                              href={safeAttachmentUrl}
                              download
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#00183F] font-bold text-xs transition-colors shadow-md"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download PDF</span>
                            </a>
                          </div>
                        </div>
                      </object>
                    </div>
                  )}

                  {/* Document Footer Strip */}
                  <div className="bg-slate-900 px-5 py-3 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Digital Document Verification • Official St. Joseph Narinda Seal</span>
                    </span>

                    <a
                      href={safeAttachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Direct Document Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Helpful Document Note */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>
                    Having difficulty viewing in your browser? You can always{' '}
                    <a
                      href={notice.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-[#00183F] hover:text-[#C8102E]"
                    >
                      open the document in a new window
                    </a>{' '}
                    or{' '}
                    <a
                      href={notice.attachment_url}
                      download
                      className="font-bold underline text-[#00183F] hover:text-[#C8102E]"
                    >
                      download the official copy
                    </a>{' '}
                    directly to your device.
                  </span>
                </div>
              </section>
            )}
          </main>

          {/* RIGHT COLUMN: Sidebar with Latest Other Notices (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6 sticky top-20">
            {/* 1. Other Latest Notices Cards */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wider">
                      Latest Circulars
                    </h3>
                    <p className="text-[11px] text-slate-500">Other recent official updates</p>
                  </div>
                </div>

                <Link
                  href="/notices"
                  className="text-xs font-bold text-[#C8102E] hover:underline"
                >
                  View All
                </Link>
              </div>

              {/* Compact Clickable Notice Cards */}
              <div className="space-y-3">
                {otherNotices.map((item) => (
                  <Link
                    key={item.id}
                    href={`/notices/${item.slug || item.id}`}
                    className="block group p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-[#D4AF37] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {item.category_display || item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.publish_date}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-[#00183F] group-hover:text-[#C8102E] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      {item.attachment_url ? (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          PDF Attached
                        </span>
                      ) : (
                        <span className="text-slate-400">Circular Memo</span>
                      )}

                      <span className="font-bold text-[#00183F] group-hover:text-[#C8102E] flex items-center gap-0.5">
                        Read
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}

                {otherNotices.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">
                    No other circulars published currently.
                  </p>
                )}
              </div>
            </div>

            {/* 2. Administrative Assistance & Inquiries Box */}
            <div className="bg-[#00183F] text-white rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Helpdesk & Administration
              </div>

              <div>
                <h4 className="text-base font-black text-white">Need Official Assistance?</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  For circular inquiries, exam timetables, or admissions assistance, contact our campus office:
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>+880 2-47118234 / +880 1711-234567</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>info@sjis-narinda.edu.bd</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Sunday – Thursday: 8:00 AM – 3:30 PM</span>
                </div>
              </div>

              <div className="pt-2">
                <Button href="/admission" variant="primary" size="sm" className="w-full justify-center">
                  Admissions Inquiry Form
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
