'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Sparkles,
  Layers,
  Filter,
  AlertCircle,
  HelpCircle,
  Printer,
} from 'lucide-react';
import {
  listInterviewSlots,
  createInterviewSlot,
  bulkCreateInterviewSlots,
  deleteInterviewSlot,
  getInterviewSlotCandidates,
} from '@/lib/api';
import type { InterviewSlot, OnlineApplication } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface Props {
  token: string;
  onToast?: (message: string) => void;
}

export const InterviewSlotsManager: React.FC<Props> = ({ token, onToast }) => {
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Roster view state
  const [selectedRosterSlot, setSelectedRosterSlot] = useState<InterviewSlot | null>(null);
  const [rosterCandidates, setRosterCandidates] = useState<OnlineApplication[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const handleOpenRoster = async (slot: InterviewSlot) => {
    setSelectedRosterSlot(slot);
    setLoadingRoster(true);
    setRosterCandidates([]);
    try {
      const data = await getInterviewSlotCandidates(slot.id, token);
      if (data && data.candidates) {
        setRosterCandidates(data.candidates);
      }
    } catch {
      onToast?.('Failed to load slot candidates.');
    } finally {
      setLoadingRoster(false);
    }
  };

  // Single slot form state
  const [singleSlot, setSingleSlot] = useState<{
    date: string;
    start_time: string;
    end_time: string;
    label: string;
    grade_filter: string;
    venue: string;
    capacity: number;
    notes: string;
  }>({
    date: '',
    start_time: '09:00',
    end_time: '10:30',
    label: '',
    grade_filter: '',
    venue: 'Campus Auditorium, 32 Shah Shaheb Lane, Narinda, Dhaka-1100',
    capacity: 30,
    notes: '',
  });

  // Bulk slot wizard form state
  const [bulkConfig, setBulkConfig] = useState<{
    start_date: string;
    end_date: string;
    times: Array<{ start_time: string; end_time: string; label: string }>;
    capacity: number;
    grade_filter: string;
    venue: string;
  }>({
    start_date: '',
    end_date: '',
    times: [
      { start_time: '09:00', end_time: '10:30', label: 'Morning Session Batch 1' },
      { start_time: '11:00', end_time: '12:30', label: 'Morning Session Batch 2' },
      { start_time: '14:00', end_time: '15:30', label: 'Afternoon Session Batch 3' },
    ],
    capacity: 30,
    grade_filter: '',
    venue: 'Campus Auditorium, 32 Shah Shaheb Lane, Narinda, Dhaka-1100',
  });

  const loadSlots = async () => {
    setLoading(true);
    try {
      const data = await listInterviewSlots(
        { date: dateFilter || undefined, grade: gradeFilter || undefined },
        token
      );
      setSlots(data);
    } catch {
      onToast?.('Failed to load interview slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, [token, dateFilter, gradeFilter]);

  const handleCreateSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleSlot.date || !singleSlot.start_time || !singleSlot.end_time) {
      onToast?.('Please specify slot date, start time, and end time.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await createInterviewSlot(singleSlot, token);
      if (res.success) {
        onToast?.('Interview slot created successfully!');
        setShowAddModal(false);
        loadSlots();
      } else {
        onToast?.(res.error || 'Failed to create interview slot.');
      }
    } catch {
      onToast?.('Error creating slot.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkConfig.start_date || !bulkConfig.end_date) {
      onToast?.('Please select start and end dates.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await bulkCreateInterviewSlots(bulkConfig, token);
      if (res.success && (res.created || 0) > 0) {
        onToast?.(`Successfully generated ${res.created} interview slots!`);
        setShowBulkModal(false);
        loadSlots();
      } else {
        onToast?.(res.error || 'No slots were created. Check date range.');
      }
    } catch {
      onToast?.('Error in bulk generation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async (id: number) => {
    try {
      const ok = await deleteInterviewSlot(id, token);
      if (ok) {
        onToast?.('Slot removed.');
        setSlots((prev) => prev.filter((s) => s.id !== id));
      } else {
        onToast?.('Failed to delete slot.');
      }
    } catch {
      onToast?.('Error deleting slot.');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const totalSeats = slots.reduce((acc, s) => acc + s.capacity, 0);
  const totalBooked = slots.reduce((acc, s) => acc + s.booked_count, 0);
  const totalAvailable = slots.reduce((acc, s) => acc + s.available_seats, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00183F] text-[#D4AF37]">
              Capacity & Slots
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Assessment Roster
            </span>
          </div>
          <h2 className="text-xl font-black text-[#00183F]">
            Interview & Assessment Slot Management
          </h2>
          <p className="text-xs text-slate-500">
            Define testing dates, batch capacities, and auto-allocate applicants to examination slots.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkModal(true)}
            icon={<Sparkles className="w-4 h-4 text-amber-500" />}
          >
            Bulk Generate Slots
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Single Slot
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Slots
          </span>
          <p className="text-2xl font-black text-[#00183F] mt-1">{slots.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Capacity
          </span>
          <p className="text-2xl font-black text-[#00183F] mt-1">{totalSeats}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            Booked Candidates
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{totalBooked}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
            Available Seats
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">{totalAvailable}</p>
        </div>
      </div>

      {/* Slots Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00183F]" />
            <span className="text-xs font-bold text-slate-800">
              Scheduled Interview Assessment Batches
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-700"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="text-[10px] text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#00183F]" />
            <p className="text-xs">Loading interview slots...</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold">No interview slots defined yet.</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Click <strong>"Bulk Generate Slots"</strong> to create testing dates and times automatically, or add slots manually.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time Window</th>
                  <th className="py-3 px-4">Batch Label</th>
                  <th className="py-3 px-4">Target Grade</th>
                  <th className="py-3 px-4">Venue</th>
                  <th className="py-3 px-4">Capacity / Booked</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slots.map((slot) => {
                  const percent = Math.min(
                    100,
                    Math.round((slot.booked_count / (slot.capacity || 1)) * 100)
                  );
                  return (
                    <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {new Date(slot.date).toLocaleDateString('en-GB', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700 whitespace-nowrap">
                        {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#00183F]">
                        {slot.label || slot.display_label}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {slot.grade_filter ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {slot.grade_filter}
                          </span>
                        ) : (
                          <span className="text-slate-400">All Grades</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={slot.venue}>
                        {slot.venue}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percent >= 100
                                  ? 'bg-rose-500'
                                  : percent >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-slate-800">
                            {slot.booked_count}/{slot.capacity}
                          </span>
                          {slot.is_full && (
                            <span className="text-[9px] font-black uppercase text-rose-600 bg-rose-50 px-1 py-0.5 rounded">
                              Full
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenRoster(slot)}
                            className="px-2.5 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
                            title="View Enrolled Students"
                          >
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                            <span>Roster ({slot.booked_count})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(slot.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Slot"
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

      {/* Add Single Slot Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Interview / Assessment Slot"
        >
          <form onSubmit={handleCreateSingle} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={singleSlot.date}
                  onChange={(e) =>
                    setSingleSlot((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Capacity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={singleSlot.capacity}
                  onChange={(e) =>
                    setSingleSlot((prev) => ({
                      ...prev,
                      capacity: parseInt(e.target.value) || 30,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                <input
                  type="time"
                  required
                  value={singleSlot.start_time}
                  onChange={(e) =>
                    setSingleSlot((prev) => ({ ...prev, start_time: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">End Time</label>
                <input
                  type="time"
                  required
                  value={singleSlot.end_time}
                  onChange={(e) =>
                    setSingleSlot((prev) => ({ ...prev, end_time: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Batch Label (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Morning Assessment Batch A"
                value={singleSlot.label}
                onChange={(e) =>
                  setSingleSlot((prev) => ({ ...prev, label: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Grade Restriction (leave blank for all grades)
              </label>
              <input
                type="text"
                placeholder="e.g. Nursery, Grade 1"
                value={singleSlot.grade_filter}
                onChange={(e) =>
                  setSingleSlot((prev) => ({ ...prev, grade_filter: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Venue / Hall</label>
              <input
                type="text"
                value={singleSlot.venue}
                onChange={(e) =>
                  setSingleSlot((prev) => ({ ...prev, venue: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Slot'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Bulk Generate Wizard Modal */}
      {showBulkModal && (
        <Modal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          title="Bulk Generate Interview Assessment Slots"
        >
          <form onSubmit={handleBulkCreate} className="space-y-4 text-xs">
            <p className="text-slate-500">
              Quickly create slots across multiple dates. A batch of slots with the specified daily schedule will be generated for every day in the date range.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">From Date</label>
                <input
                  type="date"
                  required
                  value={bulkConfig.start_date}
                  onChange={(e) =>
                    setBulkConfig((prev) => ({ ...prev, start_date: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">To Date</label>
                <input
                  type="date"
                  required
                  value={bulkConfig.end_date}
                  onChange={(e) =>
                    setBulkConfig((prev) => ({ ...prev, end_date: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Capacity Per Slot</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={bulkConfig.capacity}
                  onChange={(e) =>
                    setBulkConfig((prev) => ({
                      ...prev,
                      capacity: parseInt(e.target.value) || 30,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Grade (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave blank for All Grades"
                  value={bulkConfig.grade_filter}
                  onChange={(e) =>
                    setBulkConfig((prev) => ({ ...prev, grade_filter: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Venue</label>
              <input
                type="text"
                value={bulkConfig.venue}
                onChange={(e) =>
                  setBulkConfig((prev) => ({ ...prev, venue: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <span className="block font-bold text-slate-700 mb-2">
                Daily Schedule Slots ({bulkConfig.times.length} slots per day)
              </span>
              <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                {bulkConfig.times.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 w-4">#{idx + 1}</span>
                    <input
                      type="time"
                      value={t.start_time}
                      onChange={(e) =>
                        setBulkConfig((prev) => ({
                          ...prev,
                          times: prev.times.map((item, i) =>
                            i === idx ? { ...item, start_time: e.target.value } : item
                          ),
                        }))
                      }
                      className="px-2 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      value={t.end_time}
                      onChange={(e) =>
                        setBulkConfig((prev) => ({
                          ...prev,
                          times: prev.times.map((item, i) =>
                            i === idx ? { ...item, end_time: e.target.value } : item
                          ),
                        }))
                      }
                      className="px-2 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Batch name"
                      value={t.label}
                      onChange={(e) =>
                        setBulkConfig((prev) => ({
                          ...prev,
                          times: prev.times.map((item, i) =>
                            i === idx ? { ...item, label: e.target.value } : item
                          ),
                        }))
                      }
                      className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setBulkConfig((prev) => ({
                          ...prev,
                          times: prev.times.filter((_, i) => i !== idx),
                        }))
                      }
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setBulkConfig((prev) => ({
                      ...prev,
                      times: [
                        ...prev.times,
                        { start_time: '16:00', end_time: '17:30', label: 'Evening Batch' },
                      ],
                    }))
                  }
                  className="text-xs text-[#00183F] font-bold hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3 h-3" /> Add another daily time slot
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setShowBulkModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                {submitting ? 'Generating Slots...' : 'Generate All Slots'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={Boolean(deleteConfirmId)}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirm Slot Removal"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Are you sure you want to remove this interview slot? Any applicants currently assigned to this slot will need to be rescheduled.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => handleDeleteSlot(deleteConfirmId)}
              >
                Delete Slot
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Slot Candidates / Attendance Roster Modal */}
      {selectedRosterSlot && (
        <Modal
          isOpen={Boolean(selectedRosterSlot)}
          onClose={() => setSelectedRosterSlot(null)}
          title={`Slot Roster: ${selectedRosterSlot.label || selectedRosterSlot.display_label}`}
          maxWidth="4xl"
        >
          <div className="p-6 space-y-5">
            {/* Slot Summary Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {new Date(selectedRosterSlot.date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {selectedRosterSlot.start_time.slice(0, 5)} - {selectedRosterSlot.end_time.slice(0, 5)}
                  </span>
                </div>
                <p className="text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedRosterSlot.venue}</span>
                  {selectedRosterSlot.grade_filter && (
                    <span className="ml-2 font-bold text-blue-700">({selectedRosterSlot.grade_filter})</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled Candidates</span>
                  <span className="text-base font-black text-[#00183F]">
                    {selectedRosterSlot.booked_count} / {selectedRosterSlot.capacity}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-[#00183F] text-amber-300 font-bold text-xs hover:bg-[#002257] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Attendance Sheet</span>
                </button>
              </div>
            </div>

            {/* Candidates Table */}
            {loadingRoster ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#00183F]" />
                Loading slot candidate roster...
              </div>
            ) : rosterCandidates.length === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-sm text-slate-600">No students assigned to this slot yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  You can assign candidates from the &quot;Online Applications&quot; desk under the candidate&apos;s Evaluation tab.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#00183F] text-white text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3">SL</th>
                      <th className="py-3 px-3">Form Serial</th>
                      <th className="py-3 px-4">Candidate Information</th>
                      <th className="py-3 px-3">Grade</th>
                      <th className="py-3 px-3">Guardian Contact</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3 text-center">Invigilator Sign</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rosterCandidates.map((c, idx) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {c.form_no ? (
                            <span className="font-mono font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                              #{c.form_no}
                            </span>
                          ) : (
                            <span className="font-mono text-slate-400 text-[11px]">{c.application_id}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{c.student_first_name} {c.student_last_name}</div>
                          {c.student_name_bangla && (
                            <div className="text-[11px] text-slate-500 font-serif">{c.student_name_bangla}</div>
                          )}
                          <div className="text-[10px] text-slate-400">DOB: {c.date_of_birth} • {c.gender}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">{c.grade_applying}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="text-slate-800 font-semibold">{c.contact_phone}</div>
                          <div className="text-slate-400 text-[10px]">{c.contact_email}</div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {c.payment_status === 'completed' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Paid
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {c.payment_status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center border-l border-slate-100">
                          <div className="w-20 h-6 border-b border-dashed border-slate-300 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
