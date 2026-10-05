import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Camera,
  Server,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Privacy Policy | St. Joseph International School, Narinda',
  description:
    'Institutional data privacy policy and protection standards for students, parents, and visitors of St. Joseph International School, Narinda.',
};

export default function PrivacyPolicyPage() {
  const sections = [
    { id: 'scope', title: '1. Scope & Institutional Commitment' },
    { id: 'collection', title: '2. Personal Data We Collect' },
    { id: 'purpose', title: '3. Educational Purpose & Legal Basis' },
    { id: 'minors', title: '4. Student & Minor Privacy Safeguards' },
    { id: 'media', title: '5. Photography, Media & Audio Consent' },
    { id: 'sharing', title: '6. Third-Party Sharing & Academic Boards' },
    { id: 'security', title: '7. Information Security & Storage' },
    { id: 'retention', title: '8. Data Retention & Archival' },
    { id: 'rights', title: '9. Parental Rights & Data Correction' },
    { id: 'contact', title: '10. Contact Our Data Protection Desk' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative py-20 lg:py-24 bg-[#00183F] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C8102E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <Badge variant="gold">Institutional Governance & Transparency</Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-cinzel">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            St. Joseph International School, Narinda is dedicated to safeguarding the personal records, academic transcripts, and digital privacy of our students, parents, guardians, and visitors with utmost integrity.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Effective: Academic Year 2026-2027
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Compliance: Cambridge & National Regulatory Standards
            </span>
          </div>
        </div>
      </section>

      {/* Key Guarantees Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#00183F]">Zero Commercial Selling</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Student and parental contact details are never rented, sold, or shared for third-party commercial advertising.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#00183F] shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#00183F]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#00183F]">Strict Educational Use</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Information gathered is processed solely to administer admissions, academic delivery, pastoral care, and safety.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#C8102E] shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#00183F]">Parental Oversight</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Parents hold full rights to inspect, review, verify, and request corrections to their child&apos;s educational records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sticky Navigation Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00183F]">
              <FileText className="w-4 h-4 text-[#C8102E]" /> Quick Index
            </div>
            <nav className="space-y-1">
              {sections.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-[#00183F] hover:bg-slate-100 transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-[#00183F] block">Need Assistance?</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Questions regarding student records or data processing can be addressed directly to our administrative registrar.
                </p>
                <a
                  href="mailto:privacy@sjis-narinda.edu.bd"
                  className="text-xs font-semibold text-[#C8102E] hover:underline inline-flex items-center gap-1 mt-1"
                >
                  Contact Registrar <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Policy Text Articles */}
          <div className="lg:col-span-8 space-y-12 bg-white p-5 sm:p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm leading-relaxed text-slate-700">
            {/* 1. Scope */}
            <section id="scope" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                1. Scope & Institutional Commitment
              </h2>
              <p className="text-sm leading-relaxed">
                This Privacy Policy establishes how <strong>St. Joseph International School, Narinda</strong> (administered by the Congregation of Holy Cross) collects, manages, processes, archives, and protects personal information gathered through our public website, admissions portal, academic management databases, and physical campus touchpoints.
              </p>
              <p className="text-sm leading-relaxed">
                By accessing our online portals or registering a student with St. Joseph International School, parents, legal guardians, and visitors acknowledge and consent to the data practices delineated in this policy.
              </p>
            </section>

            {/* 2. Collection */}
            <section id="collection" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                2. Personal Data We Collect
              </h2>
              <p className="text-sm">
                In furtherance of our educational mission, the school collects distinct categories of information:
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-[#00183F] uppercase tracking-wider">A. Student Personal & Academic Records</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Legal full name, date of birth, government digital birth registration certificate, nationality, residential address, previous school transcripts, continuous assessment marks, standardized exam credentials, attendance tallies, and behavioral evaluations.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-[#00183F] uppercase tracking-wider">B. Parent & Legal Guardian Credentials</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Full names, National Identification (NID) or passport numbers, contact telephone numbers, email addresses, occupational and employer details, and official emergency contact designations.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-[#00183F] uppercase tracking-wider">C. Health, Safety & Special Needs Information</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Immunization histories, chronic medical diagnoses, dietary restrictions, emergency physician details, and registered learning support requirements. Such data is classified as confidential and restricted solely to campus healthcare staff and designated class advisors.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-[#00183F] uppercase tracking-wider">D. Digital Logs & Admission Submissions</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    IP addresses, browser client fingerprints, timestamped submission logs from the Online Admission Portal, and transaction identifiers associated with school billing.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Purpose */}
            <section id="purpose" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                3. Educational Purpose & Legal Basis
              </h2>
              <p className="text-sm">
                We handle personal information exclusively under recognized educational, statutory, and contractual mandates, including:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <li className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Administering student admissions, enrollment registrations, and grade placements.</span>
                </li>
                <li className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Delivering Cambridge International curriculum learning and classroom management.</span>
                </li>
                <li className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Issuing report cards, certified testimonials, character references, and transfer certificates.</span>
                </li>
                <li className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Notifying guardians regarding academic progress, emergencies, or campus announcements.</span>
                </li>
              </ul>
            </section>

            {/* 4. Minors */}
            <section id="minors" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                4. Student & Minor Privacy Safeguards
              </h2>
              <p className="text-sm">
                As an institution catering primarily to minors, St. Joseph International School applies heightened protective thresholds:
              </p>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950 space-y-2">
                <div className="font-bold flex items-center gap-2 text-[#00183F]">
                  <AlertCircle className="w-4 h-4 text-[#C8102E]" /> Child Safeguarding Mandate
                </div>
                <p className="leading-relaxed">
                  Direct personal contact information of students (such as personal cellular numbers or private emails) is never published publicly on the website or promotional flyers. All academic notifications, digital accounts, and billing communications are routed strictly through authorized parent/guardian credentials.
                </p>
              </div>
            </section>

            {/* 5. Media */}
            <section id="media" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                5. Photography, Media & Audio Consent
              </h2>
              <p className="text-sm leading-relaxed">
                During the academic calendar, photographic and video recordings are captured at co-curricular competitions, science exhibitions, sports galas, and Holy Cross cultural celebrations to highlight student achievements in the school magazine, campus prospectus, and official website.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                <div className="font-bold text-[#00183F] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#D4AF37]" /> Opt-Out Protocol for Parents
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Parents wishing to exclude their child from public photographic spotlights can submit an official <em>Media Opt-Out Declaration</em> to the Administrator&apos;s office during annual registration.
                </p>
              </div>
            </section>

            {/* 6. Sharing */}
            <section id="sharing" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                6. Third-Party Sharing & Academic Boards
              </h2>
              <p className="text-sm">
                We disclose student records solely when required by educational governance, statutory mandates, or contracted educational systems:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2 pt-1">
                <li>
                  <strong>International Examination Syndicates:</strong> Registration data submitted to Cambridge Assessment International Education (CAIE) or British Council partners for checkpoint, IGCSE, and A-Level credentials.
                </li>
                <li>
                  <strong>Ministry of Education & Board of Intermediate and Secondary Education (BISE):</strong> Required statutory submissions, annual census, and education board certifications.
                </li>
                <li>
                  <strong>Emergency Medical Providers:</strong> On-duty clinical physicians or affiliated hospitals in emergency health incidents.
                </li>
                <li>
                  <strong>Authorised IT Infrastructure Hosts:</strong> Cloud providers bound by strict nondisclosure and data encryption contracts.
                </li>
              </ul>
            </section>

            {/* 7. Security */}
            <section id="security" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                7. Information Security & Storage
              </h2>
              <p className="text-sm leading-relaxed">
                The school implements enterprise-grade technical and physical measures to mitigate unauthorized access, disclosure, alteration, or data destruction:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-[#00183F] mb-1">Encrypted Transmission (SSL/TLS)</div>
                  <p className="text-slate-500">All data transmitted through our web portal uses SHA-256 end-to-end cryptographic encryption.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-[#00183F] mb-1">Role-Based Access Control</div>
                  <p className="text-slate-500">Only authorized administrative staff and class advisors possess access to student directories via multi-factor authentication.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-[#00183F] mb-1">Physical Archive Security</div>
                  <p className="text-slate-500">Physical files and birth certificates are secured in fire-resistant, biometric-monitored institutional vaults.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-[#00183F] mb-1">Periodic Security Audits</div>
                  <p className="text-slate-500">Server environments undergo regular vulnerability assessments and daily offsite database backups.</p>
                </div>
              </div>
            </section>

            {/* 8. Retention */}
            <section id="retention" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                8. Data Retention & Archival
              </h2>
              <p className="text-sm leading-relaxed">
                Core academic registers, graduation transcripts, and character certificates are preserved permanently in the school archival ledger to facilitate future alumni verifications and university credential checks. Auxiliary documents (medical clearances, draft admission slips) are securely decommissioned after the mandated retention period.
              </p>
            </section>

            {/* 9. Rights */}
            <section id="rights" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                9. Parental Rights & Data Correction
              </h2>
              <p className="text-sm">
                Parents and legal guardians are entitled to:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                <li>Request formal transcripts and review personal data on record.</li>
                <li>Submit written rectification for outdated addresses, contact numbers, or spelling errors in certificates.</li>
                <li>Obtain clarification regarding third-party examination registrations.</li>
              </ul>
            </section>

            {/* 10. Contact */}
            <section id="contact" className="scroll-mt-28 space-y-6 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                10. Contact Our Data Protection Desk
              </h2>
              <p className="text-sm">
                If you have inquiries, feedback, or verification requests concerning our Privacy Policy, please contact:
              </p>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00183F] to-[#0A2540] text-white space-y-4">
                <div className="font-bold text-base text-amber-300">Office of the Registrar & Records Controller</div>
                <div className="text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>83 Narinda Road, Narinda, Dhaka-1100, Bangladesh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>info@sjis-narinda.edu.bd / registrar@sjis-narinda.edu.bd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>+880 2-47118234 / +880 1711-234567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Sunday – Thursday: 7:30 AM – 3:30 PM (BST)</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
