'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  FileText,
  Download,
  Eye,
  BookOpen,
  GraduationCap,
  Sparkles,
  Calendar,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Info,
  Clock,
  Filter,
  X,
  FileCheck
} from 'lucide-react';
import { SyllabusItem } from '@/lib/types';
import SyllabusViewerModal from './SyllabusViewerModal';
import { incrementSyllabusDownload } from '@/lib/api';

interface SyllabusClientViewProps {
  initialItems: SyllabusItem[];
}

const CURRICULUM_SECTIONS = [
  { id: 'all', label: 'All Grades', desc: 'Playgroup to A Levels' },
  { id: 'cambridge_primary', label: 'Cambridge Primary', desc: 'Playgroup to Grade 5' },
  { id: 'cambridge_lower_sec', label: 'Lower Secondary', desc: 'Grade 6 to Grade 8' },
  { id: 'cambridge_igcse', label: 'Cambridge IGCSE', desc: 'Grade 9 & 10 (O Level)' },
  { id: 'gce_alevel', label: 'International A Level', desc: 'Grade 11 & 12 (AS & A2)' },
];

const GRADE_PILLS = [
  'All',
  'Playgroup',
  'Nursery',
  'Kindergarten',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9 (IGCSE)',
  'Grade 10 (IGCSE)',
  'Grade 11 (AS Level)',
  'Grade 12 (A2 Level)',
];

export default function SyllabusClientView({ initialItems }: SyllabusClientViewProps) {
  const [items, setItems] = useState<SyllabusItem[]>(initialItems);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [previewItem, setPreviewItem] = useState<SyllabusItem | null>(null);

  // Available academic years from items
  const academicYears = useMemo(() => {
    const years = Array.from(new Set(items.map((i) => i.academic_year))).filter(Boolean);
    return ['all', ...years];
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Curriculum Section
      if (activeSection !== 'all' && item.curriculum_section !== activeSection) {
        return false;
      }
      // Grade filter
      if (selectedGrade !== 'All') {
        const itemGrade = item.grade.toLowerCase();
        const selGrade = selectedGrade.toLowerCase();
        if (!itemGrade.includes(selGrade) && !selGrade.includes(itemGrade)) {
          return false;
        }
      }
      // Academic year
      if (selectedYear !== 'all' && item.academic_year !== selectedYear) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchGrade = item.grade.toLowerCase().includes(q);
        const matchSubjects = (item.subjects_included || '').toLowerCase().includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchGrade && !matchSubjects && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [items, activeSection, selectedGrade, selectedYear, searchQuery]);

  const handleDownloadIncrement = (id: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, download_count: it.download_count + 1 } : it))
    );
  };

  const handleQuickDownload = async (item: SyllabusItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await incrementSyllabusDownload(item.id);
      handleDownloadIncrement(item.id);
    } catch {}
    const a = document.createElement('a');
    a.href = item.file_url;
    a.download = `${item.grade.replace(/[^a-zA-Z0-9]/g, '_')}_Consolidated_Syllabus_${item.academic_year}.pdf`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getSectionBadge = (section: string) => {
    switch (section) {
      case 'cambridge_primary':
        return { label: 'Primary Stage', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'cambridge_lower_sec':
        return { label: 'Lower Secondary', color: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'cambridge_igcse':
        return { label: 'Cambridge IGCSE', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'gce_alevel':
        return { label: 'Cambridge A Level', color: 'bg-amber-50 text-amber-900 border-amber-200' };
      default:
        return { label: 'General Framework', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const totalDownloads = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.download_count || 0), 0);
  }, [items]);

  return (
    <div className="space-y-8">
      {/* Cambridge Overview Header Strip */}
      <div className="bg-[#00183F] bg-gradient-to-r from-[#00183F] via-[#070F1E] to-[#0A192F] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                Grade-Wise Consolidated Syllabi
              </span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">&bull; Academic Session 2026&ndash;2027</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Class-Wise Academic Syllabus Booklets
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Each downloadable PDF booklet contains the <strong className="text-white font-semibold">complete syllabus for all subjects</strong> of that specific grade — including prescribed textbooks, term milestones, assessment rubrics, and Cambridge learning objectives in a single packet.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-amber-400">{items.length}</div>
              <div className="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5">Classes</div>
            </div>
            <div className="text-center px-2 border-x border-white/10">
              <div className="text-2xl font-black text-sky-400">100%</div>
              <div className="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5">All Subjects</div>
            </div>
            <div className="text-center px-2">
              <div className="text-2xl font-black text-emerald-400">{totalDownloads}</div>
              <div className="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5">Downloads</div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Stage Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CURRICULUM_SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          const count =
            sec.id === 'all'
              ? items.length
              : items.filter((i) => i.curriculum_section === sec.id).length;
          return (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSection(sec.id);
                setSelectedGrade('All');
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#00183F] text-white shadow-md shadow-black/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{sec.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by class or subject (e.g. Grade 1, Grade 9, Physics, Mathematics, Phonics)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00183F] focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns & View Mode */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Grade Dropdown */}
          <div className="relative min-w-[160px]">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00183F] appearance-none cursor-pointer"
            >
              {GRADE_PILLS.map((g) => (
                <option key={g} value={g}>
                  {g === 'All' ? 'All Classes / Grades' : g}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year Dropdown */}
          {academicYears.length > 2 && (
            <div className="relative min-w-[130px]">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00183F] appearance-none cursor-pointer"
              >
                <option value="all">All Years</option>
                {academicYears
                  .filter((y) => y !== 'all')
                  .map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* View Mode Toggle (Grid vs Table) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-[#00183F] shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-[#00183F] shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      {(searchQuery || selectedGrade !== 'All' || activeSection !== 'all' || selectedYear !== 'all') && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Showing <strong className="text-slate-800">{filteredItems.length}</strong> class syllabus booklets
          </div>
          <button
            onClick={() => {
              setActiveSection('all');
              setSelectedGrade('All');
              setSelectedYear('all');
              setSearchQuery('');
            }}
            className="text-[#00183F] hover:text-[#C8102E] font-semibold underline"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-sm">
          <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No syllabus found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            We couldn&apos;t find any grade syllabus booklet matching your search filters. Try selecting a different stage or clearing the search query.
          </p>
          <button
            onClick={() => {
              setActiveSection('all');
              setSelectedGrade('All');
              setSelectedYear('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-[#00183F] text-white rounded-xl text-xs font-semibold hover:bg-[#070F1E] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW: GRADE BOOKLETS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const badge = getSectionBadge(item.curriculum_section);
            const subjectsList = item.subjects_included
              ? item.subjects_included.split(',').map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Gold Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00183F] via-[#D4AF37] to-[#C8102E]" />

                <div>
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-[#00183F] text-[#D4AF37] shadow-xs">
                      {item.grade}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#00183F] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* All Subjects Guarantee Banner */}
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Single PDF Booklet &bull; All Subjects Included</span>
                  </div>

                  {/* Subjects Included Pill Preview */}
                  {subjectsList.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Subjects in this booklet:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {subjectsList.slice(0, 5).map((subj, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                          >
                            {subj}
                          </span>
                        ))}
                        {subjectsList.length > 5 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                            +{subjectsList.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {item.description && (
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Footer Info & Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 font-mono">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-red-500" />
                      {item.file_size || 'PDF Document'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-slate-400" />
                      {item.download_count} downloads
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#00183F] hover:text-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={(e) => handleQuickDownload(item, e)}
                      className="w-full py-2 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Class / Grade</th>
                  <th className="py-3.5 px-4">Syllabus Booklet Document</th>
                  <th className="py-3.5 px-4">Curriculum Stage</th>
                  <th className="py-3.5 px-4">Covered Subjects</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Downloads</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredItems.map((item) => {
                  const badge = getSectionBadge(item.curriculum_section);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setPreviewItem(item)}
                    >
                      <td className="py-3 px-4 font-black text-[#00183F] whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[#00183F] font-bold border border-slate-200 text-xs">
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#00183F]">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-semibold">
                              All Subjects in 1 PDF Booklet &bull; {item.academic_year}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">
                        {item.subjects_included || 'All Core & Elective Subjects'}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                        {item.file_size || 'PDF'}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                        {item.download_count}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-[#00183F] hover:bg-slate-100"
                            title="Preview online"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleQuickDownload(item, e)}
                            className="p-1.5 rounded-lg text-[#D4AF37] hover:text-[#b8952b] hover:bg-amber-50"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cambridge Academic Framework Guide for Parents */}
      <div className="mt-12 bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-[#00183F]" />
          <h3 className="text-lg font-bold text-slate-900">
            About St. Joseph International School Grade Syllabi
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 mt-4 leading-relaxed">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Consolidated Grade Packets
            </h4>
            <p>
              Parents and students only need to download <strong>one single PDF</strong> for their class. All subject guidelines, term timelines, and weekly topic progressions are systematically gathered inside.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Prescribed Textbooks &amp; Booklists
            </h4>
            <p>
              Each class booklet contains the definitive list of Cambridge-endorsed textbooks, workbooks, exercise note specifications, and required art or lab supplies.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Evaluation &amp; Terminal Rubrics
            </h4>
            <p>
              Diagnostic tests, mid-term assessments, and end-of-year Cambridge checkpoint or board examinations follow structured evaluation rubrics outlined within the booklet.
            </p>
          </div>
        </div>
      </div>

      {/* Modal PDF Viewer */}
      {previewItem && (
        <SyllabusViewerModal
          syllabus={previewItem}
          onClose={() => setPreviewItem(null)}
          onDownloadIncrement={handleDownloadIncrement}
        />
      )}
    </div>
  );
}
