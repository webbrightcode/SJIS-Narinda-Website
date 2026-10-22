'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  GraduationCap,
  Download,
  Eye,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  Printer,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Trash2,
  Sparkles,
  CreditCard,
  Lock,
} from 'lucide-react';
import {
  OnlineApplication,
  ApplicationDocument,
  ApplicationStatus,
  InterviewSlot,
  AdmissionSettings,
} from '@/lib/types';
import {
  listApplications,
  changeApplicationStatus,
  verifyApplicationDocument,
  deleteApplication,
  manualConfirmPayment,
  listInterviewSlots,
  getAdmissionSettings,
} from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PrintableApplicationForm } from '@/components/admission/PrintableApplicationForm';
import { printDocumentElement } from '@/lib/printUtils';

interface Props {
  token: string;
  onToast?: (message: string) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  payment_pending: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  draft: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  submitted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  under_review: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  shortlisted: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  interview_scheduled: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  documents_required: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  enrolled: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  waitlisted: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  withdrawn: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
};

const STATUS_LABELS: Record<string, string> = {
  payment_pending: 'Payment Pending',
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted / Test Scheduled',
  interview_scheduled: 'Interview Scheduled',
  documents_required: 'Documents Required',
  approved: 'Admitted / Approved',
  enrolled: 'Enrolled',
  waitlisted: 'Waitlisted',
  rejected: 'Not Selected',
  withdrawn: 'Withdrawn',
};

export const OnlineApplicationsManager: React.FC<Props> = ({ token, onToast }) => {
  const [applications, setApplications] = useState<OnlineApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<OnlineApplication | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'profile' | 'documents' | 'workflow' | 'slip'>('profile');
  const [updating, setUpdating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Slots, payment, and settings state
  const [availableSlots, setAvailableSlots] = useState<InterviewSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | ''>('');
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [manualTranId, setManualTranId] = useState('');
  const [admSettings, setAdmSettings] = useState<AdmissionSettings | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'completed' | 'pending' | 'not_required'>('all');
  const [slotFilter, setSlotFilter] = useState('all');
  const [printPageSize, setPrintPageSize] = useState<'A4' | 'Legal'>('A4');

  // Workflow update form state
  const [workflowState, setWorkflowState] = useState<{
    status: ApplicationStatus;
    entrance_exam_date: string;
    entrance_exam_venue: string;
    admin_notes: string;
    documents_verified: boolean;
    offer_letter_sent: boolean;
  }>({
    status: 'submitted',
    entrance_exam_date: '',
    entrance_exam_venue: '',
    admin_notes: '',
    documents_verified: false,
    offer_letter_sent: false,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsData, slotsData, settingsData] = await Promise.all([
        listApplications(token),
        listInterviewSlots({}, token).catch(() => []),
        getAdmissionSettings(token).catch(() => null),
      ]);
      setApplications(appsData);
      setAvailableSlots(slotsData);
      if (settingsData) {
        setAdmSettings(settingsData);
        if (settingsData.print_page_size) {
          setPrintPageSize(settingsData.print_page_size);
        }
      }
    } catch {
      if (onToast) onToast('Failed to load online applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  // Sync workflow state when an application is opened
  useEffect(() => {
    if (selectedApp) {
      setWorkflowState({
        status: selectedApp.status,
        entrance_exam_date: selectedApp.entrance_exam_date || '',
        entrance_exam_venue: selectedApp.entrance_exam_venue || '',
        admin_notes: selectedApp.admin_notes || '',
        documents_verified: selectedApp.documents_verified || false,
        offer_letter_sent: selectedApp.offer_letter_sent || false,
      });
      setSelectedSlotId(selectedApp.interview_slot || '');
      setManualTranId('');
    }
  }, [selectedApp]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        app.application_id?.toLowerCase().includes(q) ||
        `${app.student_first_name} ${app.student_last_name}`.toLowerCase().includes(q) ||
        app.contact_phone?.toLowerCase().includes(q) ||
        app.contact_email?.toLowerCase().includes(q) ||
        app.father_name?.toLowerCase().includes(q) ||
        app.mother_name?.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchGrade =
        gradeFilter === 'all' ||
        app.grade_applying === gradeFilter ||
        (Boolean(app.grade_applying) && app.grade_applying.toLowerCase().includes(gradeFilter.toLowerCase()));
      const matchPayment = paymentFilter === 'all' || app.payment_status === paymentFilter;
      const matchSlot =
        slotFilter === 'all' ||
        (slotFilter === 'unassigned' ? !app.interview_slot : String(app.interview_slot) === slotFilter);

      return matchSearch && matchStatus && matchGrade && matchPayment && matchSlot;
    });
  }, [applications, search, statusFilter, gradeFilter, paymentFilter, slotFilter]);

  // Summary counts
  const stats = useMemo(() => {
    const total = applications.length;
    const submitted = applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;
    const testScheduled = applications.filter((a) => a.status === 'shortlisted' || a.status === 'interview_scheduled').length;
    const approved = applications.filter((a) => a.status === 'approved' || a.status === 'enrolled').length;
    const verifiedDocs = applications.filter((a) => a.documents_verified).length;
    const paidCount = applications.filter((a) => a.payment_status === 'completed').length;
    const pendingPaymentCount = applications.filter((a) => a.payment_status === 'pending').length;
    return { total, submitted, testScheduled, approved, verifiedDocs, paidCount, pendingPaymentCount };
  }, [applications]);

  // Save workflow status
  const handleSaveWorkflow = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    const res = await changeApplicationStatus(selectedApp.id, token, {
      ...workflowState,
      interview_slot: selectedSlotId ? Number(selectedSlotId) : null,
    } as any);
    setUpdating(false);

    if (res.success && res.data) {
      if (onToast) onToast(`Application #${selectedApp.application_id} updated.`);
      setSelectedApp(res.data);
      setApplications((prev) => prev.map((a) => (a.id === selectedApp.id ? (res.data as OnlineApplication) : a)));
    } else {
      if (onToast) onToast(res.error || 'Failed to update application.');
    }
  };

  const handleManualConfirmPayment = async () => {
    if (!selectedApp) return;
    const tranId = manualTranId.trim() || `MANUAL-${Date.now().toString().slice(-6)}`;
    setConfirmingPayment(true);
    const res = await manualConfirmPayment(token, selectedApp.application_id, tranId);
    setConfirmingPayment(false);
    if (res.success) {
      onToast?.(`Payment confirmed! Form No. ${res.form_no} assigned to ${selectedApp.application_id}.`);
      setSelectedApp((prev) =>
        prev
          ? {
              ...prev,
              payment_status: 'completed',
              form_no: res.form_no || prev.form_no,
              status: prev.status === 'payment_pending' ? 'submitted' : prev.status,
            }
          : null
      );
      setApplications((prev) =>
        prev.map((a) =>
          a.id === selectedApp.id
            ? {
                ...a,
                payment_status: 'completed',
                form_no: res.form_no || a.form_no,
                status: a.status === 'payment_pending' ? 'submitted' : a.status,
              }
            : a
        )
      );
    } else {
      onToast?.(res.error || 'Failed to confirm payment.');
    }
  };

  // Toggle document verified
  const handleToggleDocVerify = async (doc: ApplicationDocument) => {
    if (!selectedApp) return;
    const nextVal = !doc.verified;
    const res = await verifyApplicationDocument(doc.id, nextVal, token);
    if (res.success) {
      const updatedDocs = (selectedApp.documents || []).map((d) =>
        d.id === doc.id ? { ...d, verified: nextVal } : d
      );
      const allVerified = updatedDocs.length > 0 && updatedDocs.every((d) => d.verified);
      const updatedApp = {
        ...selectedApp,
        documents: updatedDocs,
        verified_docs_count: updatedDocs.filter((d) => d.verified).length,
        documents_verified: allVerified,
      };
      setSelectedApp(updatedApp);
      setApplications((prev) => prev.map((a) => (a.id === selectedApp.id ? updatedApp : a)));
      if (onToast) onToast(`Document "${doc.doc_type_display || doc.doc_type}" marked as ${nextVal ? 'Verified' : 'Pending'}.`);
    } else {
      if (onToast) onToast(res.error || 'Failed to update document status.');
    }
  };

  // Delete application
  const handleDeleteApp = async (id: number) => {
    const success = await deleteApplication(id, token);
    if (success) {
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
      setDeleteConfirmId(null);
      if (onToast) onToast('Application permanently deleted.');
    } else {
      if (onToast) onToast('Failed to delete application.');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) {
      if (onToast) onToast('No applications to export.');
      return;
    }
    const headers = [
      'Application ID',
      'Student Name',
      'Bangla Name',
      'Grade Applying',
      'Date of Birth',
      'Gender',
      'Religion',
      'Blood Group',
      'Father Name',
      'Father Phone',
      'Mother Name',
      'Mother Phone',
      'Contact Email',
      'Contact Phone',
      'Present Address',
      'Previous School',
      'Last Grade Result',
      'Status',
      'Documents Verified',
      'Entrance Exam Date',
      'Entrance Exam Venue',
      'Submitted At',
    ];

    const rows = filteredApps.map((a) => [
      `"${a.application_id || ''}"`,
      `"${a.student_first_name} ${a.student_last_name}"`,
      `"${a.student_name_bangla || ''}"`,
      `"${a.grade_applying}"`,
      `"${a.date_of_birth}"`,
      `"${a.gender}"`,
      `"${a.religion || ''}"`,
      `"${a.blood_group || ''}"`,
      `"${a.father_name || ''}"`,
      `"${a.father_phone || ''}"`,
      `"${a.mother_name || ''}"`,
      `"${a.mother_phone || ''}"`,
      `"${a.contact_email || ''}"`,
      `"${a.contact_phone || ''}"`,
      `"${(a.present_address || '').replace(/"/g, '""')}"`,
      `"${(a.previous_school_name || '').replace(/"/g, '""')}"`,
      `"${a.last_grade_result || ''}"`,
      `"${a.status_display || a.status}"`,
      `"${a.documents_verified ? 'Yes' : 'No'}"`,
      `"${a.entrance_exam_date || ''}"`,
      `"${a.entrance_exam_venue || ''}"`,
      `"${a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SJIS_Admission_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#00183F]">
              Online Admission Applications
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00183F] text-amber-300 text-xs font-bold">
              {applications.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive digital admissions portal: verify uploaded student documents, update review statuses, and issue admit slips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-4 h-4 text-emerald-600" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={loadData}
            icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Received</span>
          <span className="text-2xl font-black text-[#00183F] mt-1 block">{stats.total}</span>
          <span className="text-[10px] text-slate-500">Academic Year 2026-27</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">In Review</span>
          <span className="text-2xl font-black text-blue-800 mt-1 block">{stats.submitted}</span>
          <span className="text-[10px] text-blue-500">Stage 1 & 2</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">Test Scheduled</span>
          <span className="text-2xl font-black text-indigo-800 mt-1 block">{stats.testScheduled}</span>
          <span className="text-[10px] text-indigo-500">Assessment Active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">Admitted</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{stats.approved}</span>
          <span className="text-[10px] text-emerald-600">Selected Candidates</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Paid & Verified</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{stats.paidCount}</span>
          <span className="text-[10px] text-emerald-600">Form No Assigned</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">Pending Fee</span>
          <span className="text-2xl font-black text-amber-800 mt-1 block">{stats.pendingPaymentCount}</span>
          <span className="text-[10px] text-amber-600">Awaiting Payment</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, Application ID (SJIS-...), phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 outline-none"
          >
            <option value="all">All Statuses ({applications.length})</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted / Test</option>
            <option value="interview_scheduled">Interview</option>
            <option value="documents_required">Docs Required</option>
            <option value="approved">Approved</option>
            <option value="enrolled">Enrolled</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 outline-none"
          >
            <option value="all">All Payments</option>
            <option value="completed">Paid ({stats.paidCount})</option>
            <option value="pending">Pending Fee ({stats.pendingPaymentCount})</option>
            <option value="not_required">Fee Waived / Free</option>
          </select>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 outline-none"
          >
            <option value="all">All Grades</option>
            {((admSettings?.available_grades && admSettings.available_grades.length > 0)
              ? admSettings.available_grades
              : [
                  'Playgroup (Age 3.5+)',
                  'Nursery (Age 4.5+)',
                  'Kindergarten (Age 5.5+)',
                  'Grade 1',
                  'Grade 2',
                  'Grade 3',
                  'Grade 4',
                  'Grade 5',
                  'Grade 6 (Junior)',
                  'Grade 7',
                  'Grade 8',
                  'Grade 9 (Cambridge IGCSE)',
                  'Grade 11 (Cambridge A-Level)',
                ]
            ).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={slotFilter}
            onChange={(e) => setSlotFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 outline-none max-w-[190px] truncate"
            title="Filter by Assigned Interview Slot"
          >
            <option value="all">All Interview Slots</option>
            <option value="unassigned">No Slot Assigned</option>
            {availableSlots.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.label || s.display_label || `${s.date} ${s.start_time.slice(0, 5)}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#00183F]" />
            Loading online applications...
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm space-y-2">
            <GraduationCap className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No applications found matching criteria.</p>
            <p className="text-xs text-slate-400">Parents can apply online from the public portal at /admission/apply</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#00183F] text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">App ID</th>
                  <th className="px-5 py-4">Form No & Payment</th>
                  <th className="px-5 py-4">Candidate Information</th>
                  <th className="px-5 py-4">Grade & Year</th>
                  <th className="px-5 py-4">Guardian Contact</th>
                  <th className="px-5 py-4">Documents</th>
                  <th className="px-5 py-4">Admission Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const statusMeta = STATUS_COLORS[app.status] || {
                    bg: 'bg-slate-100',
                    text: 'text-slate-700',
                    border: 'border-slate-200',
                  };

                  return (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      {/* App ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-xs text-[#00183F] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {app.application_id || `#${app.id}`}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          {app.created_at ? new Date(app.created_at).toLocaleDateString() : ''}
                        </span>
                      </td>

                      {/* Form No & Payment Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {app.form_no ? (
                          <div>
                            <span className="font-mono font-black text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md inline-block">
                              #{app.form_no}
                            </span>
                            <div className="mt-1">
                              {app.payment_status === 'completed' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Paid {app.payment_amount ? `৳${app.payment_amount}` : ''}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                  Fee Waived
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Lock className="w-3 h-3 text-amber-600" />
                              No Form No
                            </span>
                            <span className="block text-[10px] text-amber-600 mt-1 font-medium">Payment Pending</span>
                          </div>
                        )}
                      </td>

                      {/* Candidate Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            {app.student_photo_url ? (
                              <img
                                src={app.student_photo_url}
                                alt={app.student_first_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {app.student_first_name} {app.student_last_name}
                            </div>
                            {app.student_name_bangla && (
                              <div className="text-xs text-slate-500 font-serif">
                                {app.student_name_bangla}
                              </div>
                            )}
                            <div className="text-[11px] text-slate-400 capitalize">
                              DOB: {app.date_of_birth} • {app.gender}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Grade & Year */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 text-xs block">
                          {app.grade_applying}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {app.academic_year || '2026-2027'}
                        </span>
                        {app.section_preference && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600">
                            {app.section_preference}
                          </span>
                        )}
                      </td>

                      {/* Guardian Contact */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 text-xs block truncate max-w-[180px]">
                            {app.father_name || app.mother_name || 'Guardian'}
                          </span>
                          <span className="text-[11px] text-slate-600 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {app.contact_phone}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 truncate max-w-[180px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {app.contact_email}
                          </span>
                        </div>
                      </td>

                      {/* Documents Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {app.documents_verified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Verified ({app.verified_docs_count || 0})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            Pending ({app.verified_docs_count || 0}/{app.documents_count || 0})
                          </span>
                        )}
                      </td>

                      {/* Admission Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          {app.status_display || STATUS_LABELS[app.status] || app.status}
                        </span>
                        {app.entrance_exam_date && (
                          <span className="block text-[10px] text-indigo-600 mt-1 font-semibold">
                            Test: {app.entrance_exam_date}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setActiveModalTab('profile');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#00183F] text-amber-300 hover:bg-[#002257] text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(app.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={Boolean(deleteConfirmId)}
          onClose={() => setDeleteConfirmId(null)}
          title="Delete Online Application"
        >
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to permanently delete this application record? This will delete the student profile, academic background, and attached documents.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={() => deleteConfirmId && handleDeleteApp(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Application Detail & Workflow Modal */}
      {selectedApp && (
        <Modal
          isOpen={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          title={`Application Details · ${selectedApp.application_id}`}
          maxWidth="4xl"
        >
          <div className="flex flex-col max-h-[85vh]">
            {/* Modal Header Card */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  {selectedApp.student_photo_url ? (
                    <img
                      src={selectedApp.student_photo_url}
                      alt={selectedApp.student_first_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-[#00183F]">
                      {selectedApp.student_first_name} {selectedApp.student_last_name}
                    </h4>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                      {selectedApp.application_id}
                    </span>
                  </div>
                  {selectedApp.student_name_bangla && (
                    <p className="text-xs text-slate-500 font-serif">{selectedApp.student_name_bangla}</p>
                  )}
                  <p className="text-xs text-slate-600 mt-0.5">
                    Applying for <strong className="text-[#C8102E]">{selectedApp.grade_applying}</strong> • Session {selectedApp.academic_year || '2026-2027'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    STATUS_COLORS[selectedApp.status]?.bg || 'bg-slate-100'
                  } ${STATUS_COLORS[selectedApp.status]?.text || 'text-slate-700'} ${
                    STATUS_COLORS[selectedApp.status]?.border || 'border-slate-200'
                  }`}
                >
                  {selectedApp.status_display || STATUS_LABELS[selectedApp.status]}
                </span>
                {selectedApp.documents_verified && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-6 gap-2 shrink-0">
              {[
                { id: 'profile', label: 'Candidate Bio & Academics', icon: User },
                { id: 'documents', label: `Documents (${selectedApp.documents?.length || 0})`, icon: FileText },
                { id: 'workflow', label: 'Evaluation & Decision', icon: ShieldCheck },
                { id: 'slip', label: 'Admission Slip / Admit Card', icon: Printer },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeModalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModalTab(tab.id as any)}
                    className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                      isActive
                        ? 'border-[#00183F] text-[#00183F]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* TAB 1: Profile & Academics */}
              {activeModalTab === 'profile' && (
                <div className="space-y-6">
                  {/* Student Details Grid */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Personal Details
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Date of Birth</span>
                        <span className="font-semibold text-slate-800">{selectedApp.date_of_birth}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Gender</span>
                        <span className="font-semibold text-slate-800 capitalize">{selectedApp.gender}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Blood Group</span>
                        <span className="font-semibold text-slate-800">{selectedApp.blood_group || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Religion</span>
                        <span className="font-semibold text-slate-800 capitalize">{selectedApp.religion || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Nationality</span>
                        <span className="font-semibold text-slate-800">{selectedApp.nationality}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Birth Reg No</span>
                        <span className="font-semibold text-slate-800 font-mono">{selectedApp.birth_certificate_no || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Passport No</span>
                        <span className="font-semibold text-slate-800 font-mono">{selectedApp.passport_no || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Curriculum Preference</span>
                        <span className="font-semibold text-slate-800">{selectedApp.section_preference || 'English Medium'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Background */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Previous Academic Record
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Previous School</span>
                        <span className="font-semibold text-slate-800">{selectedApp.previous_school_name || 'None / First Admission'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">City / Location</span>
                        <span className="font-semibold text-slate-800">{selectedApp.previous_school_city || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Last Grade Result</span>
                        <span className="font-semibold text-slate-800">{selectedApp.last_grade_result || '—'}</span>
                      </div>
                      {selectedApp.special_needs_or_conditions && (
                        <div className="col-span-3">
                          <span className="text-slate-400 block text-[10px] uppercase">Special Needs / Health Notes</span>
                          <span className="font-semibold text-amber-700">{selectedApp.special_needs_or_conditions}</span>
                        </div>
                      )}
                      {selectedApp.extracurricular_interests && (
                        <div className="col-span-3">
                          <span className="text-slate-400 block text-[10px] uppercase">Co-Curricular Talents / Clubs</span>
                          <span className="text-slate-700">{selectedApp.extracurricular_interests}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parents Information */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Parents & Guardian Particulars
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Father */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                        <div className="font-bold text-[#00183F] border-b border-slate-200 pb-1">Father's Information</div>
                        <div>Name: <span className="font-semibold">{selectedApp.father_name || '—'}</span></div>
                        <div>Profession: <span className="font-semibold">{selectedApp.father_profession || '—'}</span></div>
                        <div>Organization: <span className="font-semibold">{selectedApp.father_organization || '—'}</span></div>
                        <div>Phone: <span className="font-semibold">{selectedApp.father_phone || '—'}</span></div>
                        <div>NID: <span className="font-semibold font-mono">{selectedApp.father_nid || '—'}</span></div>
                      </div>

                      {/* Mother */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                        <div className="font-bold text-[#00183F] border-b border-slate-200 pb-1">Mother's Information</div>
                        <div>Name: <span className="font-semibold">{selectedApp.mother_name || '—'}</span></div>
                        <div>Profession: <span className="font-semibold">{selectedApp.mother_profession || '—'}</span></div>
                        <div>Organization: <span className="font-semibold">{selectedApp.mother_organization || '—'}</span></div>
                        <div>Phone: <span className="font-semibold">{selectedApp.mother_phone || '—'}</span></div>
                        <div>NID: <span className="font-semibold font-mono">{selectedApp.mother_nid || '—'}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Address & Emergency */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Address & Emergency Contact
                    </h5>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                      <div>Present Address: <span className="font-semibold">{selectedApp.present_address}</span></div>
                      {selectedApp.permanent_address && (
                        <div>Permanent Address: <span className="font-semibold">{selectedApp.permanent_address}</span></div>
                      )}
                      <div>Primary Contact Phone: <span className="font-semibold">{selectedApp.contact_phone}</span></div>
                      <div>Primary Contact Email: <span className="font-semibold">{selectedApp.contact_email}</span></div>
                      {selectedApp.emergency_contact_name && (
                        <div className="pt-2 border-t border-slate-200 text-rose-700">
                          Emergency Contact: <span className="font-semibold">{selectedApp.emergency_contact_name}</span> ({selectedApp.emergency_contact_relation}) • {selectedApp.emergency_contact_phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Uploaded Documents Verification */}
              {activeModalTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-[#00183F]">Submitted Verification Documents</h5>
                      <p className="text-xs text-slate-500">
                        Inspect official birth certificates, past transcripts, and parent identity cards. Mark each as verified.
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {selectedApp.verified_docs_count || 0} / {selectedApp.documents?.length || 0} Verified
                    </span>
                  </div>

                  {(!selectedApp.documents || selectedApp.documents.length === 0) ? (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-sm">No documents attached yet.</p>
                      <p className="text-xs">Candidate can upload documents via their application tracker link.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedApp.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            doc.verified
                              ? 'bg-emerald-50/60 border-emerald-200'
                              : 'bg-white border-slate-200 shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                {doc.doc_type_display || doc.doc_type}
                              </span>
                              <p className="text-xs font-bold text-slate-800 truncate mt-0.5" title={doc.original_filename}>
                                {doc.original_filename || 'Uploaded Document'}
                              </p>
                              {doc.file_size && (
                                <span className="text-[10px] text-slate-400 block">{doc.file_size}</span>
                              )}
                            </div>

                            {doc.verified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Pending
                              </span>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-[#00183F] hover:text-[#C8102E] inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>View File</span>
                            </a>

                            <button
                              onClick={() => handleToggleDocVerify(doc)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                doc.verified
                                  ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                              }`}
                            >
                              {doc.verified ? 'Revoke Verification' : 'Mark Verified'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Workflow & Evaluation Decision */}
              {activeModalTab === 'workflow' && (
                <div className="space-y-6">
                  {/* Payment Status & Manual Confirmation Section */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    selectedApp.payment_status === 'completed'
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-amber-50/70 border-amber-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          selectedApp.payment_status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-slate-800">Application Fee & Form Serial Number</h5>
                            {selectedApp.payment_status === 'completed' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Paid & Form Assigned
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                Payment Pending (Form Locked)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {selectedApp.payment_status === 'completed' ? (
                              <span>
                                Fee Amount: <strong>৳{selectedApp.payment_amount || admSettings?.application_fee || 500}</strong> • Tran ID: <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-mono text-emerald-900">{selectedApp.payment_transaction_id || 'COUNTER-CASH'}</code> • Assigned Form No: <strong className="text-red-600 font-mono text-sm ml-1">#{selectedApp.form_no}</strong>
                              </span>
                            ) : (
                              <span>
                                Expected Fee: <strong>৳{selectedApp.payment_amount || admSettings?.application_fee || 500}</strong>. Online payment has not been received. The candidate cannot access or print their Form & Admit card until payment is confirmed.
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {selectedApp.payment_status !== 'completed' && (
                        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                          <input
                            type="text"
                            placeholder="Counter Receipt / Tran ID"
                            value={manualTranId}
                            onChange={(e) => setManualTranId(e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-mono outline-none focus:ring-2 focus:ring-[#00183F] bg-white w-full sm:w-44"
                          />
                          <Button
                            variant="gold"
                            size="sm"
                            onClick={handleManualConfirmPayment}
                            disabled={confirmingPayment}
                            icon={<CheckCircle2 className="w-4 h-4 text-[#00183F]" />}
                          >
                            {confirmingPayment ? 'Confirming...' : 'Confirm Paid & Issue Form #'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-blue-900">Admission Evaluation Desk</h5>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Update candidate status across the admission lifecycle. When you assign an interview slot or change status, the change immediately reflects on the parent portal.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Application Status *
                      </label>
                      <select
                        value={workflowState.status}
                        onChange={(e) => setWorkflowState({ ...workflowState, status: e.target.value as ApplicationStatus })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#00183F] outline-none"
                      >
                        <option value="payment_pending">0. Payment Pending</option>
                        <option value="submitted">1. Submitted (Pending Review)</option>
                        <option value="under_review">2. Under Review by Admissions Officer</option>
                        <option value="documents_required">3. Documents Required / Re-upload</option>
                        <option value="shortlisted">4. Shortlisted / Entrance Exam Scheduled</option>
                        <option value="interview_scheduled">5. Parent & Candidate Interview Scheduled</option>
                        <option value="approved">6. Approved / Offer Letter Ready</option>
                        <option value="enrolled">7. Enrolled / Admission Confirmed</option>
                        <option value="waitlisted">8. Waitlisted</option>
                        <option value="rejected">9. Not Selected</option>
                        <option value="withdrawn">10. Withdrawn</option>
                      </select>
                    </div>

                    {/* Pre-Scheduled Interview Slot Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Interview / Assessment Slot
                      </label>
                      <select
                        value={selectedSlotId}
                        onChange={(e) => {
                          const slotId = e.target.value ? Number(e.target.value) : '';
                          setSelectedSlotId(slotId);
                          const slot = availableSlots.find((s) => s.id === slotId);
                          if (slot) {
                            setWorkflowState((prev) => ({
                              ...prev,
                              entrance_exam_date: slot.date,
                              entrance_exam_venue: `${slot.venue} (${slot.start_time} - ${slot.end_time})`,
                            }));
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#00183F] outline-none"
                      >
                        <option value="">-- Manual Schedule (No Slot) --</option>
                        {availableSlots.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.label} • {slot.date} ({slot.start_time}-{slot.end_time}) [{slot.booked_count}/{slot.capacity} booked] {slot.grade_filter ? `(${slot.grade_filter})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Entrance Exam Date
                      </label>
                      <input
                        type="date"
                        value={workflowState.entrance_exam_date}
                        onChange={(e) => setWorkflowState({ ...workflowState, entrance_exam_date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Exam Venue & Room Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SJIS Narinda Campus, Building 2, Room 304"
                        value={workflowState.entrance_exam_venue}
                        onChange={(e) => setWorkflowState({ ...workflowState, entrance_exam_venue: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                    </div>

                    <div className="flex flex-col justify-end space-y-2 col-span-1 sm:col-span-2">
                      <div className="flex flex-wrap gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={workflowState.documents_verified}
                            onChange={(e) => setWorkflowState({ ...workflowState, documents_verified: e.target.checked })}
                            className="w-4 h-4 rounded text-[#00183F] cursor-pointer"
                          />
                          <span>All Physical & Uploaded Documents Verified</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={workflowState.offer_letter_sent}
                            onChange={(e) => setWorkflowState({ ...workflowState, offer_letter_sent: e.target.checked })}
                            className="w-4 h-4 rounded text-[#00183F] cursor-pointer"
                          />
                          <span>Official Admission Offer Letter Issued</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Internal Evaluator Remarks & Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Add internal notes on exam score, interview observations, discount eligibility..."
                        value={workflowState.admin_notes}
                        onChange={(e) => setWorkflowState({ ...workflowState, admin_notes: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={handleSaveWorkflow}
                      disabled={updating}
                      icon={<Check className="w-4 h-4" />}
                    >
                      {updating ? 'Saving Changes...' : 'Update Application Status'}
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 4: Official Admission Form & Detachable Admit Card */}
              {activeModalTab === 'slip' && (
                <div className="space-y-4">
                  {!selectedApp.form_no && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          <strong>Note:</strong> Online payment has not been confirmed for this applicant yet. The Form Serial number is currently unassigned. You can confirm payment manually in the "Evaluation & Decision" tab to generate an official form serial.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveModalTab('workflow')}
                        className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-lg text-xs whitespace-nowrap cursor-pointer"
                      >
                        Go to Payment
                      </button>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <h5 className="text-sm font-black text-[#00183F]">
                        Official Admission Test Form & Detachable Admit Card
                      </h5>
                      <p className="text-slate-600 mt-0.5">
                        Matches physical school admission form stationery (Form Serial:{' '}
                        <strong className="font-mono text-red-600">
                          {selectedApp.form_no ? `#${selectedApp.form_no}` : 'UNASSIGNED (PAYMENT PENDING)'}
                        </strong>).
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white rounded-xl p-0.5 border border-amber-200">
                        <button
                          type="button"
                          onClick={() => setPrintPageSize('A4')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            printPageSize === 'A4' ? 'bg-[#00183F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          A4 Format
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrintPageSize('Legal')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            printPageSize === 'Legal' ? 'bg-[#00183F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Legal / F4 Format
                        </button>
                      </div>

                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => printDocumentElement('physical-admission-document', printPageSize)}
                        icon={<Printer className="w-4 h-4 text-[#00183F]" />}
                      >
                        Print Form & Admit Card ({printPageSize})
                      </Button>
                    </div>
                  </div>

                  {/* High-Fidelity Physical Document Viewer */}
                  <div className="p-2 sm:p-4 bg-slate-100/70 rounded-2xl border border-slate-200 overflow-x-auto">
                    <PrintableApplicationForm
                      form={selectedApp}
                      applicationId={selectedApp.application_id}
                      formNo={selectedApp.form_no}
                      submittedAt={selectedApp.submitted_at || selectedApp.created_at}
                      documents={selectedApp.documents?.map((d) => ({
                        doc_type: d.doc_type,
                        file_url: d.file_url,
                        original_filename: d.original_filename,
                        file_size: d.file_size,
                      }))}
                      pageSize={printPageSize}
                      documentChecklist={admSettings?.document_checklist}
                      reportingInstructions={admSettings?.reporting_instructions}
                      defaultYellowPaper={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
