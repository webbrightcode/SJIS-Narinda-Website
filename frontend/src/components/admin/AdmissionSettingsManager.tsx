'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Printer,
  FileCheck2,
  Calendar,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  GraduationCap,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  getAdmissionSettings,
  updateAdmissionSettings,
} from '@/lib/api';
import type { AdmissionSettings, DocumentChecklistItem } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface Props {
  token: string;
  onToast?: (message: string) => void;
}

export const AdmissionSettingsManager: React.FC<Props> = ({ token, onToast }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AdmissionSettings | null>(null);
  const [showSecrets, setShowSecrets] = useState(false);
  const [newDocItem, setNewDocItem] = useState('');
  const [newDocRequired, setNewDocRequired] = useState(true);
  const [newGradeInput, setNewGradeInput] = useState('');

  // Form state
  const [formData, setFormData] = useState<{
    payment_required: boolean;
    payment_gateway: 'manual' | 'sslcommerz' | 'bkash' | 'nagad';
    application_fee: string;
    payment_currency: string;
    sslcommerz_store_id: string;
    sslcommerz_store_pass: string;
    sslcommerz_is_sandbox: boolean;
    bkash_app_key: string;
    bkash_app_secret: string;
    bkash_is_sandbox: boolean;
    nagad_merchant_id: string;
    nagad_is_sandbox: boolean;
    print_page_size: 'A4' | 'Legal';
    form_header_note: string;
    available_grades: string[];
    document_checklist: DocumentChecklistItem[];
    reporting_instructions: string;
    interview_mode: 'slot_based' | 'manual';
  }>({
    payment_required: false,
    payment_gateway: 'manual',
    application_fee: '1000.00',
    payment_currency: 'BDT',
    sslcommerz_store_id: '',
    sslcommerz_store_pass: '',
    sslcommerz_is_sandbox: true,
    bkash_app_key: '',
    bkash_app_secret: '',
    bkash_is_sandbox: true,
    nagad_merchant_id: '',
    nagad_is_sandbox: true,
    print_page_size: 'A4',
    form_header_note: '',
    available_grades: [],
    document_checklist: [],
    reporting_instructions: '',
    interview_mode: 'slot_based',
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getAdmissionSettings(token);
      if (data) {
        setSettings(data);
        setFormData({
          payment_required: Boolean(data.payment_required),
          payment_gateway: data.payment_gateway || 'manual',
          application_fee: data.application_fee || '1000.00',
          payment_currency: data.payment_currency || 'BDT',
          sslcommerz_store_id: data.sslcommerz_store_id || '',
          sslcommerz_store_pass: (data as any).sslcommerz_store_pass || '',
          sslcommerz_is_sandbox: data.sslcommerz_is_sandbox !== false,
          bkash_app_key: data.bkash_app_key || '',
          bkash_app_secret: (data as any).bkash_app_secret || '',
          bkash_is_sandbox: data.bkash_is_sandbox !== false,
          nagad_merchant_id: data.nagad_merchant_id || '',
          nagad_is_sandbox: data.nagad_is_sandbox !== false,
          print_page_size: data.print_page_size || 'A4',
          form_header_note: data.form_header_note || '',
          available_grades: Array.isArray(data.available_grades) ? data.available_grades : [],
          document_checklist: Array.isArray(data.document_checklist) ? data.document_checklist : [],
          reporting_instructions: data.reporting_instructions || '',
          interview_mode: data.interview_mode || 'slot_based',
        });
      }
    } catch {
      onToast?.('Failed to load admission settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateAdmissionSettings(formData, token);
      if (res.success && res.data) {
        setSettings(res.data);
        onToast?.('Admission settings updated successfully!');
      } else {
        onToast?.(res.error || 'Failed to update admission settings.');
      }
    } catch {
      onToast?.('Error updating settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Grade management functions
  const addGradeItem = () => {
    const trimmed = newGradeInput.trim();
    if (!trimmed) return;
    if (formData.available_grades.includes(trimmed)) {
      onToast?.('This class/grade is already in the list.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      available_grades: [...prev.available_grades, trimmed],
    }));
    setNewGradeInput('');
  };

  const removeGradeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      available_grades: prev.available_grades.filter((_, i) => i !== index),
    }));
  };

  const moveGradeItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.available_grades.length) return;
    const list = [...formData.available_grades];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);
    setFormData((prev) => ({ ...prev, available_grades: list }));
  };

  const resetGradesToDefault = () => {
    setFormData((prev) => ({
      ...prev,
      available_grades: [
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
      ],
    }));
    onToast?.('Classes/Grades reset to SJIS Cambridge standard.');
  };

  const addChecklistItem = () => {
    if (!newDocItem.trim()) return;
    setFormData((prev) => ({
      ...prev,
      document_checklist: [
        ...prev.document_checklist,
        { item: newDocItem.trim(), required: newDocRequired },
      ],
    }));
    setNewDocItem('');
    setNewDocRequired(true);
  };

  const removeChecklistItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      document_checklist: prev.document_checklist.filter((_, i) => i !== index),
    }));
  };

  const toggleChecklistItemRequired = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      document_checklist: prev.document_checklist.map((item, i) =>
        i === index ? { ...item, required: !item.required } : item
      ),
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#00183F]" />
        <p className="text-xs font-semibold">Loading admission settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00183F] text-[#D4AF37]">
              Admissions Control
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Live Gateway & Print Engine
            </span>
          </div>
          <h2 className="text-xl font-black text-[#00183F]">
            Admission Policy, Payment Gateway & Print Settings
          </h2>
          <p className="text-xs text-slate-500">
            Configure online payment gating, gateway credentials, physical paper sizes (A4/Legal), document checklist and automated interview scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSettings}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Reload
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            icon={<Save className="w-4 h-4" />}
          >
            {saving ? 'Saving Changes...' : 'Save All Settings'}
          </Button>
        </div>
      </div>

      {/* Grid of Settings Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL: Field 7 - Classes & Grades for Online Application */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#00183F]">
                    7. Class/Grade for which application is being made
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                    {formData.available_grades.length} Active Grades
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Configure the exact dropdown choices displayed to parents on Step 2 (Academic Background) of the online application form.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetGradesToDefault}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Reset to SJIS Cambridge standard grades"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Reset SJIS Standard
              </button>
            </div>
          </div>

          {/* Add New Grade Input */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Type new grade / class name (e.g. Playgroup Morning, Grade 10 IGCSE, Grade 12 A-Level)..."
                value={newGradeInput}
                onChange={(e) => setNewGradeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGradeItem();
                  }
                }}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none font-medium text-slate-800"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addGradeItem}
              icon={<Plus className="w-3.5 h-3.5" />}
              className="bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100 font-bold shrink-0"
            >
              Add Class / Grade
            </Button>
          </div>

          {/* List of active grades with reordering & remove */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
              <span>ACTIVE ADMISSION GRADES (IN DISPLAY ORDER)</span>
              <span>Use arrows to reorder in dropdown</span>
            </div>

            {formData.available_grades.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                No classes/grades configured yet. Click &quot;Reset SJIS Standard&quot; or add a custom grade above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {formData.available_grades.map((grade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition-all text-xs group shadow-2xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-800 truncate" title={grade}>
                        {grade}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={() => moveGradeItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveGradeItem(index, 'down')}
                        disabled={index === formData.available_grades.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeGradeItem(index)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Grade"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PANEL 1: Online Payment Gate & Gateway */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#00183F]">Online Payment Gateway</h3>
                <p className="text-[11px] text-slate-400">Control payment requirement & gateways</p>
              </div>
            </div>
            {/* Master Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.payment_required}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, payment_required: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Payment Status Notice */}
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              formData.payment_required
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            {formData.payment_required ? (
              <p>
                <strong>Payment Gating is ACTIVE:</strong> Applicants cannot generate or print their official Form Number or Candidate Admit Card until fee payment is completed online.
              </p>
            ) : (
              <p>
                <strong>Payment Gating is OFF (Test / Free Mode):</strong> Applicants can submit their online form and download/print their completed form with admit card immediately without payment.
              </p>
            )}
          </div>

          {/* Fee & Gateway selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Application Fee Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="50"
                  min="0"
                  value={formData.application_fee}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, application_fee: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#00183F] font-bold text-slate-800"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  {formData.payment_currency}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Active Payment Gateway
              </label>
              <select
                value={formData.payment_gateway}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payment_gateway: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#00183F] font-bold text-slate-800"
              >
                <option value="sslcommerz">SSLCommerz (Cards, bKash, Nagad, Net Banking)</option>
                <option value="bkash">bKash Direct Merchant</option>
                <option value="nagad">Nagad Direct Gateway</option>
                <option value="manual">Manual Counter Payment (Cash / Slip)</option>
              </select>
            </div>
          </div>

          {/* SSLCommerz Credentials */}
          {formData.payment_gateway === 'sslcommerz' && (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#00183F]">SSLCommerz Credentials</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sslcommerz_is_sandbox}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          sslcommerz_is_sandbox: e.target.checked,
                        }))
                      }
                      className="rounded text-[#00183F]"
                    />
                    <span className="text-[11px] font-semibold">Sandbox / Testing Mode</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {showSecrets ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{showSecrets ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Store ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. sjisnarindalive"
                  value={formData.sslcommerz_store_id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sslcommerz_store_id: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Store Password
                </label>
                <input
                  type={showSecrets ? 'text' : 'password'}
                  placeholder="SSLCommerz Store Secret"
                  value={formData.sslcommerz_store_pass}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sslcommerz_store_pass: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* PANEL 2: Print Page Size & Format */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#00183F]">Official Printable Form & Paper Size</h3>
              <p className="text-[11px] text-slate-400">Configure paper dimensions for parent prints</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Default Physical Paper Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  formData.print_page_size === 'A4'
                    ? 'border-[#00183F] bg-blue-50/50 text-[#00183F]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="print_page_size"
                  value="A4"
                  checked={formData.print_page_size === 'A4'}
                  onChange={() => setFormData((prev) => ({ ...prev, print_page_size: 'A4' }))}
                  className="sr-only"
                />
                <span className="text-sm font-black">A4 Standard</span>
                <span className="text-[10px] text-slate-500">210mm × 297mm (Standard Deskjet/Laser)</span>
                {formData.print_page_size === 'A4' && (
                  <span className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#00183F] text-white">
                    Selected
                  </span>
                )}
              </label>

              <label
                className={`p-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  formData.print_page_size === 'Legal'
                    ? 'border-[#00183F] bg-blue-50/50 text-[#00183F]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="print_page_size"
                  value="Legal"
                  checked={formData.print_page_size === 'Legal'}
                  onChange={() => setFormData((prev) => ({ ...prev, print_page_size: 'Legal' }))}
                  className="sr-only"
                />
                <span className="text-sm font-black">Legal (F4) Long</span>
                <span className="text-[10px] text-slate-500">216mm × 356mm (Official Board Size)</span>
                {formData.print_page_size === 'Legal' && (
                  <span className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#00183F] text-white">
                    Selected
                  </span>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Form Header Official Note (Printed at top of form)
            </label>
            <input
              type="text"
              placeholder="e.g. Approved by Ministry of Education & Cambridge Assessment International Education"
              value={formData.form_header_note}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, form_header_note: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#00183F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Interview Slot Scheduling Mode
            </label>
            <select
              value={formData.interview_mode}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, interview_mode: e.target.value as any }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#00183F] font-bold text-slate-800"
            >
              <option value="slot_based">Automated (Auto-assign available interview slot on payment/submit)</option>
              <option value="manual">Manual (Admin assigns interview slot per applicant individually)</option>
            </select>
          </div>
        </div>

        {/* PANEL 3: Document Checklist (What to bring on test day) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#00183F]">
                  Document Checklist (Printed on Candidate Admit Card)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Documents parents/candidates MUST bring to school on the examination day
                </p>
              </div>
            </div>
          </div>

          {/* Add item bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Original Birth Certificate (with photocopy)"
              value={newDocItem}
              onChange={(e) => setNewDocItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#00183F]"
            />
            <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold px-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newDocRequired}
                onChange={(e) => setNewDocRequired(e.target.checked)}
                className="rounded text-[#00183F]"
              />
              <span>Mandatory</span>
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={addChecklistItem}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Item
            </Button>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {formData.document_checklist.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No checklist items added yet. Click "Add Item" above.
              </p>
            ) : (
              formData.document_checklist.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-800 truncate">{item.item}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleChecklistItemRequired(index)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                        item.required
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.required ? 'Mandatory' : 'Optional'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(index)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reporting instructions */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              General Reporting & Exam-Day Instructions (Printed on Admit Card Bottom)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Candidates must arrive in neat attire 15 minutes before reporting time. Only transparent pencil cases permitted in exam halls."
              value={formData.reporting_instructions}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reporting_instructions: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#00183F] leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
