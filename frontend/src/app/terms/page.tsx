import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Scale,
  BookOpen,
  DollarSign,
  GraduationCap,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Laptop,
  CheckCircle,
  FileCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Official academic terms, administrative regulations, student code of conduct, and fee guidelines of St. Joseph International School, Narinda.',
  alternates: { canonical: '/terms' },
};

export default function TermsAndConditionsPage() {
  const sections = [
    { id: 'preamble', title: '1. Preamble & Institutional Governance' },
    { id: 'admissions', title: '2. Admissions & Document Authenticity' },
    { id: 'fees', title: '3. Tuition Fees, Deadlines & Refund Rules' },
    { id: 'academic', title: '4. Cambridge Curriculum & Academic Standards' },
    { id: 'discipline', title: '5. Student Code of Conduct & Anti-Bullying' },
    { id: 'attendance', title: '6. Attendance, Punctuality & Leave' },
    { id: 'safety', title: '7. Campus Safety & Emergency Protocols' },
    { id: 'digital', title: '8. Digital Learning & Acceptable IT Use' },
    { id: 'uniform', title: '9. Uniform, Grooming & Identity Cards' },
    { id: 'withdrawal', title: '10. Withdrawal & Transfer Certificates' },
    { id: 'liability', title: '11. Limitation of Liability & Force Majeure' },
    { id: 'contact', title: '12. Administrative Enquiries & Council' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative py-20 lg:py-24 bg-[#00183F] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C8102E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <Badge variant="gold">Institutional Code & Regulations</Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-cinzel">
            Terms & Conditions
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            These Terms and Conditions establish the foundational expectations, academic rigor, ethical decorum, and financial policies governing all students, parents, and legal guardians enrolled at St. Joseph International School, Narinda.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Applicable: Academic Session 2026-2027
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <Scale className="w-3.5 h-3.5 text-amber-400" /> Binding Agreement upon Enrollment Confirmation
            </span>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D4AF37] shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#00183F]">Holy Cross Values</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Nurturing hearts and minds with moral fortitude, intellectual excellence, and mutual respect for diversity.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#C8102E] shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#00183F]">Zero Bullying Policy</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Absolute zero tolerance toward harassment, discrimination, or physical and verbal aggression on campus.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#00183F] shrink-0">
              <FileCheck className="w-6 h-6 text-[#00183F]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#00183F]">Transparent Operations</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Structured billing timelines, clear academic criteria, and objective grievance review mechanisms.
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
              <Scale className="w-4 h-4 text-[#C8102E]" /> Policy Index
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
                <span className="text-xs font-bold text-[#00183F] block">Admission Queries?</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Refer to the official fee guide and eligibility criteria on our admissions portal.
                </p>
                <Link
                  href="/admission"
                  className="text-xs font-semibold text-[#C8102E] hover:underline inline-flex items-center gap-1 mt-1"
                >
                  Visit Admissions Portal <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Policy Text Articles */}
          <div className="lg:col-span-8 space-y-12 bg-white p-5 sm:p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm leading-relaxed text-slate-700">
            {/* 1. Preamble */}
            <section id="preamble" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                1. Preamble & Institutional Governance
              </h2>
              <p className="text-sm leading-relaxed">
                St. Joseph International School, Narinda operates under the authoritative guidance of the <strong>Congregation of Holy Cross</strong>. Enrollment at the school signifies a voluntary covenant between the school, the student, and their family to uphold holistic education, high academic standards, and moral rectitude.
              </p>
              <p className="text-sm leading-relaxed">
                Submission of an admission inquiry, signing of registration registers, or payment of tuition fees constitutes unreserved acceptance of these Terms & Conditions and all related institutional bylaws.
              </p>
            </section>

            {/* 2. Admissions */}
            <section id="admissions" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                2. Admissions & Document Authenticity
              </h2>
              <p className="text-sm leading-relaxed">
                Admission is granted on merit, entrance diagnostic performance, and seat availability under the discretion of the Admission Committee:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2 pt-1">
                <li>
                  <strong>Verification of Documents:</strong> All academic transcripts, government birth registration certificates, and identification papers submitted must be authentic. Any fraudulent document discovered immediately voids the student&apos;s admission without refund.
                </li>
                <li>
                  <strong>Age Appropriateness:</strong> Students must conform strictly to the minimum age threshold established by the school for Playgroup, Nursery, and Grade 1 entry.
                </li>
                <li>
                  <strong>Probationary Period:</strong> All newly admitted students are subject to a one-term academic and behavioral probation to facilitate smooth assimilation.
                </li>
              </ul>
            </section>

            {/* 3. Fees */}
            <section id="fees" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                3. Tuition Fees, Deadlines & Refund Rules
              </h2>
              <p className="text-sm leading-relaxed">
                Prompt settlement of institutional dues is essential to sustain educational excellence and campus infrastructure:
              </p>
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-[#00183F] mb-1">Billing Schedule & Due Dates</div>
                  <p className="text-slate-600">
                    Tuition fees are billed monthly or quarterly. Invoices must be cleared by the 10th of every calendar month via the designated bank counter or authorized online portal. A late surcharge is levied on accounts overdue past the 15th.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-[#00183F] mb-1">Non-Refundability of Admission Fees</div>
                  <p className="text-slate-600">
                    One-time admission charges, development levies, registration fees, and examination syndicate registration costs are strictly non-refundable under all circumstances once paid.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-[#00183F] mb-1">Suspension for Outstanding Arrears</div>
                  <p className="text-slate-600">
                    Students with tuition dues exceeding two consecutive months may be barred from sitting semester assessments and report cards will be withheld until accounts are fully reconciled.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Academic */}
            <section id="academic" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                4. Cambridge Curriculum & Academic Standards
              </h2>
              <p className="text-sm leading-relaxed">
                St. Joseph International School follows the rigorous Cambridge Assessment International Education pathway:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2 pt-1">
                <li>
                  <strong>Academic Honesty:</strong> Plagiarism, cheating in examinations, unauthorized collaboration, or artificial intelligence misuse in student portfolios constitutes severe academic misconduct punishable by exam invalidation or suspension.
                </li>
                <li>
                  <strong>Promotion Criteria:</strong> Promotion to the subsequent grade level is governed by cumulative grade point averages, continuous diagnostic assessments, and mandatory attendance thresholds (minimum 85%).
                </li>
                <li>
                  <strong>Co-Curricular Participation:</strong> Membership in recognized school clubs, cultural performances, science events, and physical education is an integral requirement for graduation.
                </li>
              </ul>
            </section>

            {/* 5. Discipline */}
            <section id="discipline" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                5. Student Code of Conduct & Anti-Bullying
              </h2>
              <p className="text-sm leading-relaxed">
                We believe character formation is paramount. All Josephites are expected to exhibit decorum, civility, and pride in their institution:
              </p>
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs text-rose-950 space-y-2">
                <div className="font-bold flex items-center gap-2 text-[#C8102E]">
                  <AlertTriangle className="w-4 h-4 text-[#C8102E]" /> Zero-Tolerance Violations
                </div>
                <p className="leading-relaxed">
                  The following infractions result in immediate disciplinary hearing, parental summons, and potential expulsion: physical fighting, cyberbullying, malicious damage to school property, unauthorized departure from campus premises, possession of contraband, or abusive conduct toward teachers and staff.
                </p>
              </div>
            </section>

            {/* 6. Attendance */}
            <section id="attendance" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                6. Attendance, Punctuality & Leave
              </h2>
              <p className="text-sm leading-relaxed">
                School gates close promptly at morning assembly bell. Late arrivals will be recorded and repeated tardiness triggers a parental conference:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2 pt-1">
                <li>
                  <strong>Medical Leave:</strong> Absences exceeding two continuous days require a signed parental explanation and a registered physician&apos;s medical certificate submitted upon return.
                </li>
                <li>
                  <strong>Prior Approval:</strong> Planned leave for travel or family events must be formally sanctioned by the Vice Principal at least 5 business days in advance.
                </li>
              </ul>
            </section>

            {/* 7. Safety */}
            <section id="safety" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                7. Campus Safety & Emergency Protocols
              </h2>
              <p className="text-sm leading-relaxed">
                The school maintains high campus security:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2 pt-1">
                <li>
                  <strong>Closed Campus:</strong> Students may not leave campus grounds during operational hours without a signed security slip from the Administration Office.
                </li>
                <li>
                  <strong>Authorized Pick-Up:</strong> Students are discharged solely to bearers of the official Parent Pick-Up Security Card.
                </li>
                <li>
                  <strong>CCTV Surveillance:</strong> Common campus grounds, hallways, sports fields, and entry gates are under continuous 24/7 digital CCTV recording for student safety.
                </li>
              </ul>
            </section>

            {/* 8. Digital */}
            <section id="digital" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                8. Digital Learning & Acceptable IT Use
              </h2>
              <p className="text-sm leading-relaxed">
                Personal mobile phones, smartwatches with communication capabilities, and unapproved electronic entertainment devices are prohibited during regular school hours. Devices brought to campus must be surrendered at the homeroom depot.
              </p>
              <p className="text-sm leading-relaxed">
                Use of school IT laboratories, STEM robotics centers, and high-speed Wi-Fi is monitored. Accessing inappropriate content or attempting to compromise campus network firewalls constitutes a serious violation.
              </p>
            </section>

            {/* 9. Uniform */}
            <section id="uniform" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                9. Uniform, Grooming & Identity Cards
              </h2>
              <p className="text-sm leading-relaxed">
                Students must arrive in neat, prescribed school uniform complete with polished black shoes, navy socks, and the official school crest badge. The RFID Student ID card must be worn visibly at all times for campus access control and library borrowing.
              </p>
            </section>

            {/* 10. Withdrawal */}
            <section id="withdrawal" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                10. Withdrawal & Transfer Certificates
              </h2>
              <p className="text-sm leading-relaxed">
                To obtain a Transfer Certificate (TC) or final transcript:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2 pt-1">
                <li>
                  A formal written withdrawal application must be submitted by the parent at least one full calendar month before the end of the ongoing term.
                </li>
                <li>
                  All outstanding library books, laboratory equipment, sports uniforms, and tuition dues must be cleared to obtain the official clearance slip.
                </li>
              </ul>
            </section>

            {/* 11. Liability */}
            <section id="liability" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                11. Limitation of Liability & Force Majeure
              </h2>
              <p className="text-sm leading-relaxed">
                While St. Joseph International School exercises rigorous supervision and safety care, the school cannot be held liable for personal belongings lost or damaged on campus.
              </p>
              <p className="text-sm leading-relaxed">
                In instances of force majeure—including natural calamities, severe weather, governmental directives, public health emergencies, or national disruptions—the school reserves the right to transition seamlessly to digital online instruction without fee abatement.
              </p>
            </section>

            {/* 12. Contact */}
            <section id="contact" className="scroll-mt-28 space-y-6 border-t border-slate-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#00183F] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C8102E] rounded-full" />
                12. Administrative Enquiries & Council
              </h2>
              <p className="text-sm">
                For interpretations, formal grievances, or institutional questions regarding these regulations, please direct correspondence to:
              </p>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00183F] to-[#0A2540] text-white space-y-4">
                <div className="font-bold text-base text-amber-300">Office of the Headmaster & Disciplinary Council</div>
                <div className="text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>83 Narinda Road, Narinda, Dhaka-1100, Bangladesh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>administration@sjis-narinda.edu.bd / headmaster@sjis-narinda.edu.bd</span>
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
