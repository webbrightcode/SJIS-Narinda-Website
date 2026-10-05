'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  LayoutDashboard,
  Sliders,
  Bell,
  Users,
  Image as ImageIcon,
  UserCheck,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  Calendar,
  Save,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Check,
  X,
  Phone,
  Mail,
  HelpCircle,
  Menu,
  Activity,
  Database,
  Server,
  Layers,
  DollarSign,
  Share2,
  Printer,
  Command,
  FileText,
  AlertTriangle,
  UploadCloud,
  RotateCcw,
  Zap,
  Globe,
  Quote,
  Building2,
  Loader2,
  Upload,
} from 'lucide-react';
import {
  SliderSlide,
  Notice,
  Club,
  GalleryItem,
  AdmissionInquiry,
  AboutInfo,
  AdmissionGuide,
  DashboardStats,
  AdminUser,
  StaffMember,
} from '@/lib/types';
import {
  adminLogin,
  getDashboardStats,
  getSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getInquiries,
  updateInquiry,
  updateInquiryStatus,
  deleteInquiry,
  getAboutInfo,
  updateAboutInfo,
  getAdmissionGuide,
  updateAdmissionGuide,
  getSystemDiagnostics,
  getFullDataBackup,
  getFacultyAndStaff,
  uploadMediaFile,
} from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CommandPalette } from '@/components/admin/CommandPalette';
import { AdmissionSlipModal } from '@/components/admin/AdmissionSlipModal';
import { DatabaseRestoreModal } from '@/components/admin/DatabaseRestoreModal';
import { ImageHelper } from '@/components/admin/ImageHelper';
import { SiteSettingsPanel, TestimonialsManager, FaqManager, FacultyManager } from '@/components/admin/SiteContentPanels';

export default function AdminDashboardPage() {
  // Authentication State
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Mobile sidebar state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'slides' | 'notices' | 'clubs' | 'gallery' | 'inquiries' | 'admission_guide' | 'settings' | 'site_settings' | 'testimonials' | 'faqs' | 'faculty'
  >('overview');

  // Search & Filter state for lists
  const [noticeSearch, setNoticeSearch] = useState('');
  const [noticeCategoryFilter, setNoticeCategoryFilter] = useState('all');

  const [clubSearch, setClubSearch] = useState('');
  const [clubCategoryFilter, setClubCategoryFilter] = useState('all');

  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');

  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  // Activity Audit Log
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; action: string; time: string; type: string }>>([
    { id: '1', action: 'Admin session initiated', time: 'Just now', type: 'system' },
    { id: '2', action: 'Synchronized with SQLite/PostgreSQL Database', time: '1 min ago', type: 'database' },
  ]);

  const logActivity = (action: string, type: string = 'info') => {
    setActivityLogs((prev) => [
      { id: Date.now().toString(), action, time: 'Just now', type },
      ...prev.slice(0, 15),
    ]);
  };

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    logActivity(text, type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Data States
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [slides, setSlides] = useState<SliderSlide[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>([]);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [adminLeaders, setAdminLeaders] = useState<StaffMember[]>([]);
  const [admissionGuide, setAdmissionGuide] = useState<AdmissionGuide | null>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);

  // Modals
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<SliderSlide> | null>(null);

  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Partial<Notice> | null>(null);

  const [clubModalOpen, setClubModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Partial<Club> | null>(null);

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);

  const [selectedInquiry, setSelectedInquiry] = useState<AdmissionInquiry | null>(null);
  const [staffNotesDraft, setStaffNotesDraft] = useState('');

  // Pro Feature Modals
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [slipInquiry, setSlipInquiry] = useState<AdmissionInquiry | null>(null);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Multi-select bulk state
  const [selectedInquiryIds, setSelectedInquiryIds] = useState<number[]>([]);
  const [selectedNoticeIds, setSelectedNoticeIds] = useState<number[]>([]);

  // Custom Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Administrator Direct Photo Upload State & Handler
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPhotoUrlInput, setShowPhotoUrlInput] = useState(false);

  const handlePrincipalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      showToast('Image file size must be less than 25MB', 'error');
      return;
    }

    setUploadingPhoto(true);
    try {
      const res = await uploadMediaFile(file, token || undefined);
      if (res && res.url) {
        setAboutInfo((prev) => (prev ? { ...prev, principal_image_url: res.url } : prev));
        showToast('Administrator photo uploaded successfully!');
        setUploadingPhoto(false);
        return;
      }
    } catch (err) {
      console.warn('Backend upload failed, encoding locally:', err);
    }

    // Fallback: encode as Base64 Data URL so upload never fails even offline
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAboutInfo((prev) => (prev ? { ...prev, principal_image_url: dataUrl } : prev));
        showToast('Administrator photo attached successfully!');
      }
      setUploadingPhoto(false);
    };
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  // Check stored auth
  useEffect(() => {
    const savedToken = localStorage.getItem('sjis_admin_token');
    const savedUser = localStorage.getItem('sjis_admin_user');
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }
    }
  }, []);

  // Sync staff notes draft when selected inquiry changes
  useEffect(() => {
    if (selectedInquiry) {
      setStaffNotesDraft(selectedInquiry.admin_notes || '');
    }
  }, [selectedInquiry]);

  // Global Hotkey Listener: Cmd+K / Ctrl+K and ?
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }
      if (!isInput) {
        if (e.key === '?') {
          e.preventDefault();
          setShortcutsModalOpen((prev) => !prev);
        } else if (e.key >= '1' && e.key <= '8') {
          const tabMap: Array<typeof activeTab> = [
            'overview',
            'slides',
            'notices',
            'clubs',
            'gallery',
            'inquiries',
            'admission_guide',
            'settings',
          ];
          const target = tabMap[parseInt(e.key) - 1];
          if (target) setActiveTab(target);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch all data
  const refreshAllData = useCallback(async (authToken?: string) => {
    const currentToken = authToken || token || undefined;
    setLoading(true);
    try {
      const [
        dashStats,
        allSlides,
        allNotices,
        allClubs,
        allGallery,
        allInquiries,
        aboutData,
        guideData,
        diagData,
        staffData,
      ] = await Promise.all([
        getDashboardStats(currentToken),
        getSlides(false),
        getNotices('all', '', false),
        getClubs('all', false),
        getGallery('all'),
        getInquiries('all', '', currentToken),
        getAboutInfo(),
        getAdmissionGuide(),
        getSystemDiagnostics(currentToken),
        getFacultyAndStaff(false, 'admin'),
      ]);

      setStats(dashStats);
      setSlides(allSlides);
      setNotices(allNotices);
      setClubs(allClubs);
      setGallery(allGallery);
      setInquiries(allInquiries);
      setAboutInfo(aboutData);
      setAdmissionGuide(guideData);
      setDiagnostics(diagData);
      setAdminLeaders(staffData || []);
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      refreshAllData(token);
    }
  }, [token, refreshAllData]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const res = await adminLogin(usernameInput, passwordInput);
    setLoginLoading(false);

    if (res.success && res.token) {
      setToken(res.token);
      localStorage.setItem('sjis_admin_token', res.token);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('sjis_admin_user', JSON.stringify(res.user));
      }
      showToast('Welcome to SJIS Professional Control Center');
      refreshAllData(res.token);
    } else {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sjis_admin_token');
    localStorage.removeItem('sjis_admin_user');
    setToken(null);
    setUser(null);
    showToast('Logged out securely.', 'info');
  };

  // ---------------- CRUD HANDLERS ---------------- //

  // --- Slides ---
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    if (editingSlide.id) {
      const updated = await updateSlide(editingSlide.id, editingSlide, token || undefined);
      if (updated) {
        setSlides(slides.map((s) => (s.id === updated.id ? updated : s)));
        showToast('Hero slide updated successfully!');
      }
    } else {
      const created = await createSlide(editingSlide, token || undefined);
      if (created) {
        setSlides([created, ...slides]);
        showToast('New hero slide published live!');
      }
    }
    setSlideModalOpen(false);
    setEditingSlide(null);
  };

  const confirmDeleteSlide = (id: number, title: string) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Delete Hero Slide',
      message: `Are you sure you want to permanently remove "${title}"?`,
      onConfirm: async () => {
        setSlides((prev) => prev.filter((s) => s.id !== id));
        setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
        const ok = await deleteSlide(id, token || undefined);
        if (ok) {
          showToast('Hero slide deleted successfully.');
        } else {
          showToast('Could not delete hero slide. Refreshing data...', 'error');
          refreshAllData();
        }
      },
    });
  };

  // --- Notices ---
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;

    if (editingNotice.id) {
      const updated = await updateNotice(editingNotice.id, editingNotice, token || undefined);
      if (updated) {
        setNotices(notices.map((n) => (n.id === updated.id ? updated : n)));
        showToast('Notice circular updated!');
      }
    } else {
      const created = await createNotice(editingNotice, token || undefined);
      if (created) {
        setNotices([created, ...notices]);
        showToast('New official notice broadcasted!');
      }
    }
    setNoticeModalOpen(false);
    setEditingNotice(null);
  };

  const confirmDeleteNotice = (id: number, title: string) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Delete Notice Circular',
      message: `Are you sure you want to delete notice "${title}"?`,
      onConfirm: async () => {
        setNotices((prev) => prev.filter((n) => n.id !== id));
        setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
        const ok = await deleteNotice(id, token || undefined);
        if (ok) {
          showToast('Notice removed.');
        } else {
          showToast('Could not delete notice circular.', 'error');
          refreshAllData();
        }
      },
    });
  };

  // --- Clubs ---
  const handleSaveClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClub) return;

    if (editingClub.id) {
      const updated = await updateClub(editingClub.id, editingClub, token || undefined);
      if (updated) {
        setClubs(clubs.map((c) => (c.id === updated.id ? updated : c)));
        showToast('Club details updated!');
      }
    } else {
      const created = await createClub(editingClub, token || undefined);
      if (created) {
        setClubs([...clubs, created]);
        showToast('New student club registered!');
      }
    }
    setClubModalOpen(false);
    setEditingClub(null);
  };

  const confirmDeleteClub = (id: number, name: string) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Remove Student Club',
      message: `Are you sure you want to remove "${name}" from co-curricular guilds?`,
      onConfirm: async () => {
        setClubs((prev) => prev.filter((c) => c.id !== id));
        setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
        const ok = await deleteClub(id, token || undefined);
        if (ok) {
          showToast('Club removed.');
        } else {
          showToast('Could not remove club. Refreshing data...', 'error');
          refreshAllData();
        }
      },
    });
  };

  // --- Gallery ---
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;

    if (editingGallery.id) {
      const updated = await updateGalleryItem(editingGallery.id, editingGallery, token || undefined);
      if (updated) {
        setGallery(gallery.map((g) => (g.id === updated.id ? updated : g)));
        showToast('Media entry updated!');
      }
    } else {
      const created = await createGalleryItem(editingGallery, token || undefined);
      if (created) {
        setGallery([created, ...gallery]);
        showToast('New media added to gallery!');
      }
    }
    setGalleryModalOpen(false);
    setEditingGallery(null);
  };

  const confirmDeleteGallery = (id: number, title: string) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Delete Media',
      message: `Delete "${title}" from the school gallery?`,
      onConfirm: async () => {
        setGallery((prev) => prev.filter((g) => g.id !== id));
        setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
        const ok = await deleteGalleryItem(id, token || undefined);
        if (ok) {
          showToast('Media removed from gallery.');
        } else {
          showToast('Could not remove gallery item. Refreshing data...', 'error');
          refreshAllData();
        }
      },
    });
  };

  // --- Inquiries ---
  const handleStatusChange = async (id: number, newStatus: string) => {
    const updated = await updateInquiryStatus(id, newStatus, token || undefined);
    if (updated) {
      setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status: updated.status } : inq)));
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: updated.status });
      }
      showToast(`Inquiry status updated to ${newStatus}`);
    }
  };

  const confirmDeleteInquiry = (id: number, student: string) => {
    setDeleteDialog({
      isOpen: true,
      title: 'Delete Inquiry Record',
      message: `Permanently delete application record for student "${student}"?`,
      onConfirm: async () => {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
        const ok = await deleteInquiry(id, token || undefined);
        if (ok) {
          showToast('Inquiry record deleted.');
        } else {
          showToast('Could not delete inquiry record. Refreshing data...', 'error');
          refreshAllData();
        }
      },
    });
  };

  // Save Staff Internal Notes
  const handleSaveInquiryNotes = async (id: number) => {
    const updated = await updateInquiry(id, { admin_notes: staffNotesDraft }, token || undefined);
    if (updated) {
      setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, admin_notes: staffNotesDraft } : inq)));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, admin_notes: staffNotesDraft });
      }
      showToast('Evaluation notes saved securely.');
    }
  };

  // Bulk Inquiry Operations
  const handleBulkInquiryStatus = async (status: string) => {
    if (selectedInquiryIds.length === 0) return;
    setLoading(true);
    await Promise.all(
      selectedInquiryIds.map((id) => updateInquiryStatus(id, status, token || undefined))
    );
    setInquiries(
      inquiries.map((inq) =>
        selectedInquiryIds.includes(inq.id) ? { ...inq, status: status as any } : inq
      )
    );
    const count = selectedInquiryIds.length;
    setSelectedInquiryIds([]);
    setLoading(false);
    showToast(`Updated status to "${status}" for ${count} candidates!`);
  };

  const handleBulkDeleteInquiries = () => {
    if (selectedInquiryIds.length === 0) return;
    setDeleteDialog({
      isOpen: true,
      title: 'Bulk Delete Candidate Records',
      message: `Permanently delete ${selectedInquiryIds.length} candidate applications? This action cannot be undone.`,
      onConfirm: async () => {
        setLoading(true);
        await Promise.all(selectedInquiryIds.map((id) => deleteInquiry(id, token || undefined)));
        setInquiries(inquiries.filter((inq) => !selectedInquiryIds.includes(inq.id)));
        const count = selectedInquiryIds.length;
        setSelectedInquiryIds([]);
        setLoading(false);
        showToast(`Deleted ${count} candidate records.`);
        setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Bulk Notice Operations
  const handleBulkNoticeAction = async (action: 'pin' | 'unpin' | 'delete') => {
    if (selectedNoticeIds.length === 0) return;
    if (action === 'delete') {
      setDeleteDialog({
        isOpen: true,
        title: 'Bulk Delete Circular Notices',
        message: `Permanently delete ${selectedNoticeIds.length} circular notices?`,
        onConfirm: async () => {
          setLoading(true);
          await Promise.all(selectedNoticeIds.map((id) => deleteNotice(id, token || undefined)));
          setNotices(notices.filter((n) => !selectedNoticeIds.includes(n.id)));
          const count = selectedNoticeIds.length;
          setSelectedNoticeIds([]);
          setLoading(false);
          showToast(`Deleted ${count} circular notices.`);
          setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
      return;
    }
    const isPinned = action === 'pin';
    setLoading(true);
    await Promise.all(
      selectedNoticeIds.map((id) => updateNotice(id, { is_pinned: isPinned }, token || undefined))
    );
    setNotices(
      notices.map((n) =>
        selectedNoticeIds.includes(n.id) ? { ...n, is_pinned: isPinned } : n
      )
    );
    const count = selectedNoticeIds.length;
    setSelectedNoticeIds([]);
    setLoading(false);
    showToast(`Notices ${isPinned ? 'pinned' : 'unpinned'} for ${count} circulars.`);
  };

  // Command Palette Action Handler
  const handleCommandAction = (actionKey: string) => {
    switch (actionKey) {
      case 'new_notice':
        setEditingNotice({
          title: '',
          category: 'academic',
          content: '',
          attachment_url: '',
          publish_date: new Date().toISOString().split('T')[0],
          is_pinned: false,
          is_active: true,
        });
        setNoticeModalOpen(true);
        break;
      case 'new_slide':
        setEditingSlide({
          title: '',
          subtitle: '',
          badge: 'St. Joseph Narinda',
          image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
          cta_text: 'Apply For 2026-27',
          cta_link: '/admission',
          secondary_cta_text: 'Explore Campus',
          secondary_cta_link: '/about',
          order: slides.length + 1,
          is_active: true,
        });
        setSlideModalOpen(true);
        break;
      case 'new_club':
        setEditingClub({
          name: '',
          category: 'stem',
          motto: '',
          description: '',
          icon_name: 'Cpu',
          image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
          moderator_name: '',
          schedule: 'Every Thursday, 3:30 PM',
          key_activities: ['Weekly workshops', 'Field visits'],
          achievements: ['National Merit Award'],
          order: clubs.length + 1,
          is_active: true,
        });
        setClubModalOpen(true);
        break;
      case 'new_gallery':
        setEditingGallery({
          title: '',
          category: 'campus',
          media_type: 'image',
          image_url: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop',
          caption: '',
          is_featured: true,
          order: gallery.length + 1,
        });
        setGalleryModalOpen(true);
        break;
      case 'export_csv':
        handleExportInquiriesCSV();
        break;
      case 'backup_json':
        handleDownloadFullBackup();
        break;
      case 'restore_json':
        setRestoreModalOpen(true);
        break;
      case 'emergency_alert':
        setActiveTab('settings');
        break;
      default:
        break;
    }
  };

  // Export Inquiries to CSV
  const handleExportInquiriesCSV = () => {
    if (inquiries.length === 0) {
      showToast('No inquiries to export.', 'info');
      return;
    }
    const headers = ['ID', 'Student Name', 'Parent Name', 'Grade', 'Phone', 'Email', 'Previous School', 'Status', 'Submitted At'];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.student_name}"`,
      `"${i.parent_name}"`,
      `"${i.grade_applying}"`,
      `"${i.phone}"`,
      `"${i.email}"`,
      `"${i.previous_school || ''}"`,
      `"${i.status}"`,
      `"${i.created_at}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sjis_admissions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported admissions list to CSV');
  };

  // Full Database JSON Backup Export
  const handleDownloadFullBackup = async () => {
    showToast('Generating complete school database backup...', 'info');
    const data = await getFullDataBackup(token || undefined);
    if (!data) {
      showToast('Backup generation failed.', 'error');
      return;
    }
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `sjis_narinda_full_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Database backup downloaded successfully!');
  };

  // Save Admission Guide & Tuition Matrix
  const handleSaveAdmissionGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionGuide) return;
    const updated = await updateAdmissionGuide(admissionGuide, token || undefined);
    if (updated) {
      setAdmissionGuide(updated);
      showToast('Admission Guide & Tuition Matrix updated!');
    }
  };

  // --- About Info ---
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutInfo) return;
    const updated = await updateAboutInfo(aboutInfo, token || undefined);
    if (updated) {
      setAboutInfo(updated);
      showToast('School profile & settings saved!');
    }
  };

  // Filtered lists for instant live search
  const filteredNotices = notices.filter((n) => {
    const matchCat = noticeCategoryFilter === 'all' || n.category === noticeCategoryFilter;
    const matchSearch =
      noticeSearch === '' ||
      n.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(noticeSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredClubs = clubs.filter((c) => {
    const matchCat = clubCategoryFilter === 'all' || c.category === clubCategoryFilter;
    const matchSearch =
      clubSearch === '' ||
      c.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(clubSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredGallery = gallery.filter((g) => {
    return galleryCategoryFilter === 'all' || g.category === galleryCategoryFilter;
  });

  const filteredInquiries = inquiries.filter((inq) => {
    const matchStatus = inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
    const matchSearch =
      inquirySearch === '' ||
      inq.student_name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.parent_name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.phone.includes(inquirySearch) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  // ---------------- RENDER: LOGIN VIEW ---------------- //
  if (!token) {
    return (
      <div className="min-h-screen bg-[#070F1E] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C8102E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C8102E] p-1 mx-auto shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-[#00183F] rounded-xl flex items-center justify-center">
              <GraduationCap className="w-9 h-9 text-[#D4AF37]" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
            SJIS Control Center
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            St. Joseph International School, Narinda • Admin Authentication
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-[#00183F]/90 border border-white/15 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl backdrop-blur-xl">
            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Staff Username
                </label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white text-sm outline-none transition-all placeholder-slate-500"
                  placeholder="Enter staff username"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-black/40 border border-white/15 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white text-sm outline-none transition-all placeholder-slate-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loginLoading}
                  variant="gold"
                  size="lg"
                  className="w-full justify-center font-bold shadow-lg"
                  icon={<Lock className="w-4 h-4" />}
                >
                  {loginLoading ? 'Authenticating...' : 'Sign In to Control Center'}
                </Button>
              </div>

              <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Authorized SJIS Personnel Only • TLS Encrypted</span>
              </div>

              <div className="pt-4 border-t border-white/10 text-center">
                <Link
                  href="/"
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1"
                >
                  ← Return to Public Website
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- RENDER: PRO SAAS DASHBOARD VIEW ---------------- //
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#00183F] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D4AF37]/50 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. PROFESSIONAL SIDEBAR NAVIGATION (Desktop + Mobile Drawer) */}
      <aside
        className={`w-64 bg-[#00183F] text-white shrink-0 flex flex-col justify-between border-r border-white/10 select-none z-50 transition-all duration-300 ${
          mobileSidebarOpen
            ? 'fixed inset-y-0 left-0 flex shadow-2xl'
            : 'hidden md:flex md:sticky md:top-0 md:h-screen'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C8102E] p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#00183F] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
                </div>
              </div>
              <div className="overflow-hidden">
                <h2 className="font-extrabold text-sm tracking-tight text-white truncate">
                  SJIS Console
                </h2>
                <span className="text-[10px] block font-semibold text-[#D4AF37] uppercase tracking-wider truncate">
                  St. Joseph Narinda
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Content & Operations
            </div>

            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'slides', label: 'Hero Sliders', icon: Sliders, count: slides.length },
              { id: 'notices', label: 'Notice Board', icon: Bell, count: notices.length },
              { id: 'faculty', label: 'Faculty & Staff Body', icon: GraduationCap },
              { id: 'clubs', label: 'Clubs & Guilds', icon: Users, count: clubs.length },
              { id: 'gallery', label: 'Media Gallery', icon: ImageIcon, count: gallery.length },
              {
                id: 'inquiries',
                label: 'Admissions Pipeline',
                icon: UserCheck,
                badge: inquiries.filter((i) => i.status === 'pending').length,
                count: inquiries.length,
              },
              { id: 'admission_guide', label: 'Fees & Criteria Matrix', icon: DollarSign },
              { id: 'faqs', label: 'Admission FAQs', icon: HelpCircle },
              { id: 'testimonials', label: 'Testimonials', icon: Quote },
              { id: 'site_settings', label: 'Website & Contact Info', icon: Globe },
              { id: 'settings', label: 'School Settings & Diagnostics', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5A823] text-[#00183F] shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#00183F]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge !== undefined && tab.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#C8102E] text-white shadow-sm">
                      {tab.badge}
                    </span>
                  ) : tab.count !== undefined ? (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        isActive ? 'bg-[#00183F]/20 text-[#00183F]' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User Profile card in sidebar */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C8102E] p-0.5">
                <div className="w-full h-full bg-[#00183F] rounded-[10px] flex items-center justify-center font-bold text-xs text-[#D4AF37]">
                  AD
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold text-white">{user?.username || 'admin'}</span>
                <span className="block text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Super Admin
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-white/5 hover:bg-rose-600/30 text-slate-300 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operational Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-400 hidden sm:inline">Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <span className="font-bold text-[#00183F] capitalize">
                {activeTab.replace('_', ' ')}
              </span>
              <span className="hidden lg:inline-flex ml-3 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                ● Connected to {diagnostics?.system?.db_engine || 'SQLite (Dev) / PostgreSQL (Prod)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs transition-colors"
              title="Global Command Palette (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search or Jump to...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded shadow-2xs text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Campus Flash Alert live badge */}
            {aboutInfo?.emergency_alert?.is_active && (
              <button
                onClick={() => setActiveTab('settings')}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-[11px] font-bold border border-red-300 transition-colors shadow-2xs"
                title="Click to manage Campus Emergency Alert"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                <span>Flash Alert Active</span>
              </button>
            )}

            <button
              onClick={() => setRestoreModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              title="Disaster Recovery: Restore Database from JSON"
            >
              <UploadCloud className="w-3.5 h-3.5 text-sky-600" />
              <span>Restore DB</span>
            </button>

            <button
              onClick={handleDownloadFullBackup}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              title="Download Full Database JSON Backup"
            >
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span>Backup JSON</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-[#00183F] hover:bg-[#0D2852] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Live Website</span>
            </Link>

            <button
              onClick={() => setShortcutsModalOpen(true)}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => refreshAllData()}
              disabled={loading}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh all data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="p-4 sm:p-8 space-y-8 flex-1">
          {activeTab === 'site_settings' && <SiteSettingsPanel token={token || undefined} />}
          {activeTab === 'testimonials' && <TestimonialsManager token={token || undefined} />}
          {activeTab === 'faqs' && <FaqManager token={token || undefined} />}
          {activeTab === 'faculty' && <FacultyManager token={token || undefined} />}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Hero Slides', count: slides.length, icon: Sliders, color: 'text-amber-500' },
                  { label: 'Notice Circulars', count: notices.length, icon: Bell, color: 'text-rose-500' },
                  { label: 'Student Clubs', count: clubs.length, icon: Users, color: 'text-sky-500' },
                  { label: 'Media Gallery', count: gallery.length, icon: ImageIcon, color: 'text-purple-500' },
                  { label: 'Total Inquiries', count: inquiries.length, icon: UserCheck, color: 'text-emerald-500' },
                  {
                    label: 'Pending Inquiries',
                    count: inquiries.filter((i) => i.status === 'pending').length,
                    icon: AlertCircle,
                    color: 'text-red-500',
                  },
                ].map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">{m.label}</span>
                        <Icon className={`w-4 h-4 ${m.color}`} />
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-[#00183F] mt-3">
                        {m.count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Admissions Pipeline Conversion Funnel & Demographics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#00183F] flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        Admissions Pipeline Conversion Funnel
                      </h3>
                      <p className="text-xs text-slate-500">Real-time candidate transition rate through enrollment stages</p>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {inquiries.length > 0 ? `${Math.round((inquiries.filter((i) => i.status === 'admitted').length / inquiries.length) * 100)}% Conversion` : 'Admissions Open'}
                    </span>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {/* Stage 1: Received */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Stage 1: Applications Received</span>
                        <span>{inquiries.length} (100%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full w-full transition-all duration-500" />
                      </div>
                    </div>

                    {/* Stage 2: Screened & Interviewed */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Stage 2: Screened & Contacted</span>
                        <span>
                          {inquiries.filter((i) => i.status === 'contacted' || i.status === 'admitted').length} (
                          {inquiries.length > 0 ? Math.round(((inquiries.filter((i) => i.status === 'contacted' || i.status === 'admitted').length) / inquiries.length) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-[#D4AF37] rounded-full transition-all duration-500"
                          style={{ width: `${inquiries.length > 0 ? Math.max(12, Math.round(((inquiries.filter((i) => i.status === 'contacted' || i.status === 'admitted').length) / inquiries.length) * 100)) : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Stage 3: Admitted & Enrolled */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Stage 3: Admitted & Enrolled</span>
                        <span>
                          {inquiries.filter((i) => i.status === 'admitted').length} (
                          {inquiries.length > 0 ? Math.round(((inquiries.filter((i) => i.status === 'admitted').length) / inquiries.length) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full transition-all duration-500"
                          style={{ width: `${inquiries.length > 0 ? Math.max(8, Math.round(((inquiries.filter((i) => i.status === 'admitted').length) / inquiries.length) * 100)) : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-[#00183F] flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#C8102E]" />
                    Applicant Grade Distribution
                  </h3>
                  <div className="space-y-2.5 text-xs pt-1">
                    {[
                      { label: 'Playgroup & KG', count: inquiries.filter((i) => i.grade_applying?.toLowerCase().includes('play') || i.grade_applying?.toLowerCase().includes('kg') || i.grade_applying?.toLowerCase().includes('nursery')).length, color: 'bg-indigo-500' },
                      { label: 'Junior School (Class 1-5)', count: inquiries.filter((i) => ['1', '2', '3', '4', '5'].some((g) => i.grade_applying?.includes(g))).length, color: 'bg-sky-500' },
                      { label: 'Middle School (Class 6-8)', count: inquiries.filter((i) => ['6', '7', '8'].some((g) => i.grade_applying?.includes(g))).length, color: 'bg-amber-500' },
                      { label: 'High School & O/A Level', count: inquiries.filter((i) => ['9', '10', '11', '12', 'o', 'a'].some((g) => i.grade_applying?.toLowerCase().includes(g))).length, color: 'bg-emerald-500' },
                    ].map((g, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${g.color}`} />
                          <span className="font-semibold text-slate-700">{g.label}</span>
                        </div>
                        <span className="font-bold text-[#00183F]">{g.count} candidates</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Center & Recent Activity & Inquiries Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Fast Action Center */}
                <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-[#00183F] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Fast Content Actions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instantly deploy content updates and announcements directly to the live website.
                  </p>

                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        setEditingNotice({
                          title: '',
                          category: 'academic',
                          content: '',
                          attachment_url: '',
                          publish_date: new Date().toISOString().split('T')[0],
                          is_pinned: false,
                          is_active: true,
                        });
                        setNoticeModalOpen(true);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-[#C8102E] group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="block text-xs font-bold text-slate-800">Add Circular Notice</span>
                          <span className="block text-[10px] text-slate-500">Broadcast official circular</span>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingSlide({
                          title: '',
                          subtitle: '',
                          badge: 'Excellence in Narinda',
                          image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
                          cta_text: 'Apply Online',
                          cta_link: '/admission',
                          secondary_cta_text: 'Explore Campus',
                          secondary_cta_link: '/about',
                          order: slides.length + 1,
                          is_active: true,
                        });
                        setSlideModalOpen(true);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <Sliders className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="block text-xs font-bold text-slate-800">Create Hero Slide</span>
                          <span className="block text-[10px] text-slate-500">Homepage banner studio</span>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingClub({
                          name: '',
                          category: 'stem',
                          motto: '',
                          description: '',
                          icon_name: 'Cpu',
                          image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
                          moderator_name: '',
                          schedule: 'Every Thursday, 3:30 PM',
                          key_activities: ['Weekly workshops', 'Annual carnival'],
                          achievements: ['Regional First Prize'],
                          order: clubs.length + 1,
                          is_active: true,
                        });
                        setClubModalOpen(true);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="block text-xs font-bold text-slate-800">Register Club</span>
                          <span className="block text-[10px] text-slate-500">Student co-curricular guild</span>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingGallery({
                          title: '',
                          category: 'campus',
                          media_type: 'image',
                          image_url: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop',
                          caption: '',
                          is_featured: true,
                          order: gallery.length + 1,
                        });
                        setGalleryModalOpen(true);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="block text-xs font-bold text-slate-800">Upload Media</span>
                          <span className="block text-[10px] text-slate-500">Add to photo gallery</span>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Admission Intake Pipeline & Recent Applicants */}
                <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#00183F]">
                        Live Admission Applications
                      </h3>
                      <p className="text-xs text-slate-500">
                        Recent candidate forms submitted through the public admissions portal.
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('inquiries')}
                    >
                      Full Pipeline ({inquiries.length})
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {inquiries.slice(0, 5).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4 hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="cursor-pointer" onClick={() => setSelectedInquiry(inq)}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#00183F]">{inq.student_name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C8102E]/10 text-[#C8102E]">
                              {inq.grade_applying}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Parent: <span className="font-semibold text-slate-700">{inq.parent_name}</span> • Phone: {inq.phone}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-white"
                          >
                            <option value="pending">Pending Review</option>
                            <option value="contacted">Contacted</option>
                            <option value="admitted">Admitted</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                    ))}

                    {inquiries.length === 0 && (
                      <div className="text-center py-10 text-slate-400 text-xs">
                        No admission applications received yet. Parents can apply from the public /admission page.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity Audit Trail & System Diagnostics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Audit Trail */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-[#00183F] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Session Activity Audit Log
                  </h3>
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-slate-800">{log.action}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Diagnostics Card */}
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-[#00183F] flex items-center gap-2">
                    <Server className="w-4 h-4 text-sky-600" />
                    Infrastructure Diagnostics
                  </h3>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Framework Engine:</span>
                      <span className="font-bold text-[#00183F]">Django {diagnostics?.system?.django_version || '6.1.1'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Runtime:</span>
                      <span className="font-bold text-[#00183F]">Python {diagnostics?.system?.python_version || '3.14.2'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Database Adapter:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {diagnostics?.system?.db_engine || 'SQLite / PostgreSQL'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">API Health Status:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Operational
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    icon={<Download className="w-4 h-4" />}
                    onClick={handleDownloadFullBackup}
                  >
                    Export Full School Data (JSON)
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SLIDES MANAGER */}
          {activeTab === 'slides' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-[#00183F]">Hero Slider Studio</h3>
                  <p className="text-xs text-slate-500">
                    Control high-impact banners, captions, badges, order, and destination links.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setEditingSlide({
                      title: '',
                      subtitle: '',
                      badge: 'St. Joseph Narinda',
                      image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
                      cta_text: 'Apply For 2026-27',
                      cta_link: '/admission',
                      secondary_cta_text: 'Explore Campus',
                      secondary_cta_link: '/about',
                      order: slides.length + 1,
                      is_active: true,
                    });
                    setSlideModalOpen(true);
                  }}
                >
                  Create Slide
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative h-48 w-full bg-slate-900">
                      <Image
                        src={slide.image_url}
                        alt={slide.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#D4AF37] text-[#00183F] shadow-sm">
                          Order #{slide.order}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-sm ${
                            slide.is_active ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {slide.is_active ? 'Active on Home' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-[#C8102E] tracking-wider">
                        {slide.badge || 'Slide Badge'}
                      </span>
                      <h4 className="text-base font-bold text-[#00183F] line-clamp-1">
                        {slide.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{slide.subtitle}</p>

                      <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                        <span>Action: &quot;{slide.cta_text}&quot; → {slide.cta_link}</span>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setEditingSlide(slide);
                          setSlideModalOpen(true);
                        }}
                        className="text-xs font-bold text-[#00183F] hover:text-[#C8102E] flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit Slide
                      </button>

                      <button
                        onClick={() => confirmDeleteSlide(slide.id, slide.title)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NOTICES MANAGER (With Search & Category Filter) */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-[#00183F]">Notice Board & Circulars</h3>
                  <p className="text-xs text-slate-500">
                    Publish exam schedules, parent-teacher conferences, and academic closures.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setEditingNotice({
                      title: '',
                      category: 'academic',
                      content: '',
                      attachment_url: '',
                      publish_date: new Date().toISOString().split('T')[0],
                      is_pinned: false,
                      is_active: true,
                    });
                    setNoticeModalOpen(true);
                  }}
                >
                  Publish Circular
                </Button>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search circulars..."
                    value={noticeSearch}
                    onChange={(e) => setNoticeSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#00183F] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={noticeCategoryFilter}
                    onChange={(e) => setNoticeCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="academic">Academic</option>
                    <option value="admission">Admission</option>
                    <option value="exams">Examinations</option>
                    <option value="events">Events & Celebrations</option>
                    <option value="holidays">Holidays & Closures</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-[#00183F] text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="w-10 px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredNotices.length > 0 &&
                              selectedNoticeIds.length === filteredNotices.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedNoticeIds(filteredNotices.map((n) => n.id));
                              } else {
                                setSelectedNoticeIds([]);
                              }
                            }}
                            className="w-4 h-4 rounded text-[#00183F] cursor-pointer"
                          />
                        </th>
                        <th className="px-4 py-4">Title & Details</th>
                        <th className="px-4 py-4">Category</th>
                        <th className="px-4 py-4">Date</th>
                        <th className="px-4 py-4">Pin Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredNotices.map((n) => {
                        const isSelected = selectedNoticeIds.includes(n.id);
                        return (
                          <tr
                            key={n.id}
                            className={`hover:bg-slate-50 transition-colors ${
                              isSelected ? 'bg-amber-50/50' : ''
                            }`}
                          >
                            <td className="w-10 px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedNoticeIds([...selectedNoticeIds, n.id]);
                                  } else {
                                    setSelectedNoticeIds(selectedNoticeIds.filter((id) => id !== n.id));
                                  }
                                }}
                                className="w-4 h-4 rounded text-[#00183F] cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-4 max-w-md">
                              <span className="font-bold text-sm text-[#00183F] block leading-snug">
                                {n.title}
                              </span>
                              <span className="text-slate-500 line-clamp-1 mt-0.5">{n.content}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                                {n.category_display || n.category}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-slate-600 font-medium">
                              {n.publish_date}
                            </td>
                            <td className="px-4 py-4">
                              {n.is_pinned ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                  Pinned
                                </span>
                              ) : (
                                <span className="text-slate-400">Regular</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                              <button
                                onClick={() => {
                                  setEditingNotice(n);
                                  setNoticeModalOpen(true);
                                }}
                                className="font-bold text-[#00183F] hover:text-[#C8102E]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => confirmDeleteNotice(n.id, n.title)}
                                className="font-bold text-rose-600 hover:text-rose-800"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredNotices.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-slate-400">
                            No notices match the filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Floating Notice Bulk Action Dock */}
              {selectedNoticeIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#00183F] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                  <span className="text-xs font-bold text-[#D4AF37]">
                    {selectedNoticeIds.length} circular(s) selected
                  </span>
                  <div className="h-4 w-px bg-white/20" />
                  <button
                    onClick={() => handleBulkNoticeAction('pin')}
                    className="text-xs font-bold hover:text-[#D4AF37] transition-colors"
                  >
                    Pin Selected
                  </button>
                  <button
                    onClick={() => handleBulkNoticeAction('unpin')}
                    className="text-xs font-bold hover:text-slate-300 transition-colors"
                  >
                    Unpin Selected
                  </button>
                  <button
                    onClick={() => handleBulkNoticeAction('delete')}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedNoticeIds([])}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CLUBS MANAGER */}
          {activeTab === 'clubs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-[#00183F]">Co-Curricular Clubs & Societies</h3>
                  <p className="text-xs text-slate-500">
                    Manage student guilds, assign moderators, configure weekly schedules, and record accolades.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setEditingClub({
                      name: '',
                      category: 'stem',
                      motto: '',
                      description: '',
                      icon_name: 'Cpu',
                      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
                      moderator_name: '',
                      schedule: 'Every Thursday, 3:30 PM',
                      key_activities: ['Weekly workshops', 'Field visits'],
                      achievements: ['National Merit Award'],
                      order: clubs.length + 1,
                      is_active: true,
                    });
                    setClubModalOpen(true);
                  }}
                >
                  Register Club
                </Button>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search clubs & guilds..."
                    value={clubSearch}
                    onChange={(e) => setClubSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#00183F] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={clubCategoryFilter}
                    onChange={(e) => setClubCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="all">All Guild Types</option>
                    <option value="stem">STEM & Innovation</option>
                    <option value="debate">Debate & Oratory</option>
                    <option value="arts">Cultural & Fine Arts</option>
                    <option value="sports">Sports & Athletics</option>
                    <option value="service">Leadership & Welfare</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative h-40 w-full bg-slate-900">
                      <Image
                        src={c.image_url}
                        alt={c.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#C8102E] text-white">
                          {c.category_display || c.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="text-base font-bold text-[#00183F] leading-snug line-clamp-1">
                        {c.name}
                      </h4>
                      <p className="text-xs text-amber-700 italic font-medium">&quot;{c.motto}&quot;</p>
                      <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                      <div className="text-[11px] text-slate-500 pt-1">
                        Moderator: <span className="font-semibold text-slate-700">{c.moderator_name}</span>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setEditingClub(c);
                          setClubModalOpen(true);
                        }}
                        className="font-bold text-[#00183F] hover:text-[#C8102E] flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit Guild
                      </button>
                      <button
                        onClick={() => confirmDeleteClub(c.id, c.name)}
                        className="font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GALLERY MANAGER */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-[#00183F]">Media & Photo Gallery</h3>
                  <p className="text-xs text-slate-500">
                    Upload and manage high-resolution photos and moments across campus and events.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setEditingGallery({
                      title: '',
                      category: 'campus',
                      media_type: 'image',
                      image_url: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop',
                      caption: '',
                      is_featured: true,
                      order: gallery.length + 1,
                    });
                    setGalleryModalOpen(true);
                  }}
                >
                  Upload Media
                </Button>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['all', 'campus', 'academics', 'sports', 'cultural', 'events'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                      galleryCategoryFilter === cat
                        ? 'bg-[#00183F] text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Photos' : cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGallery.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full bg-slate-900">
                      <Image
                        src={g.image_url}
                        alt={g.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-black/70 text-white backdrop-blur-md">
                          {g.category_display || g.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-3">
                      <h5 className="font-bold text-xs text-[#00183F] line-clamp-1">{g.title}</h5>
                      {g.caption && <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{g.caption}</p>}
                    </div>

                    <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => {
                          setEditingGallery(g);
                          setGalleryModalOpen(true);
                        }}
                        className="font-bold text-[#00183F] hover:text-[#C8102E]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDeleteGallery(g.id, g.title)}
                        className="font-bold text-rose-600 hover:text-rose-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: INQUIRIES & ADMISSIONS PIPELINE */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-[#00183F]">
                    Admission Inquiries & Application Tracker
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review parent applications, update evaluation statuses, and export candidate registers.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportInquiriesCSV}
                    icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
                  >
                    Export to CSV
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => refreshAllData()}
                    icon={<RefreshCw className="w-4 h-4" />}
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Inquiry Search & Status Filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search applicant name, phone, email..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#00183F] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => setInquiryStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="all">All Application Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="contacted">Contacted / Interview</option>
                    <option value="admitted">Admitted / Enrolled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Inquiry Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-[#00183F] text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="w-10 px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredInquiries.length > 0 &&
                              selectedInquiryIds.length === filteredInquiries.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedInquiryIds(filteredInquiries.map((i) => i.id));
                              } else {
                                setSelectedInquiryIds([]);
                              }
                            }}
                            className="w-4 h-4 rounded text-[#00183F] cursor-pointer"
                          />
                        </th>
                        <th className="px-4 py-4">Student & Grade</th>
                        <th className="px-4 py-4">Parent Details</th>
                        <th className="px-4 py-4">Contact Info</th>
                        <th className="px-4 py-4">Status Workflow</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInquiries.map((inq) => {
                        const isSelected = selectedInquiryIds.includes(inq.id);
                        return (
                          <tr
                            key={inq.id}
                            className={`hover:bg-slate-50 transition-colors ${
                              isSelected ? 'bg-amber-50/50' : ''
                            }`}
                          >
                            <td className="w-10 px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedInquiryIds([...selectedInquiryIds, inq.id]);
                                  } else {
                                    setSelectedInquiryIds(selectedInquiryIds.filter((id) => id !== inq.id));
                                  }
                                }}
                                className="w-4 h-4 rounded text-[#00183F] cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <span className="font-bold text-sm text-[#00183F] block">
                                {inq.student_name}
                              </span>
                              <span className="text-xs font-semibold text-[#C8102E]">
                                Applying for: {inq.grade_applying}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="font-semibold text-slate-800">{inq.parent_name}</span>
                              {inq.previous_school && (
                                <span className="block text-[11px] text-slate-400">
                                  Prev: {inq.previous_school}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span className="block font-medium text-slate-800">{inq.phone}</span>
                              <span className="block text-slate-500">{inq.email}</span>
                            </td>
                            <td className="px-4 py-4">
                              <select
                                value={inq.status}
                                onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white"
                              >
                                <option value="pending">Pending Review</option>
                                <option value="contacted">Contacted / Interview</option>
                                <option value="admitted">Admitted</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                              <button
                                onClick={() => setSelectedInquiry(inq)}
                                className="font-bold text-[#00183F] hover:text-[#C8102E]"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => confirmDeleteInquiry(inq.id, inq.student_name)}
                                className="font-bold text-rose-600 hover:text-rose-800"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredInquiries.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-400">
                            No admission inquiries match the search filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Floating Inquiry Bulk Action Dock */}
              {selectedInquiryIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#00183F] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                  <span className="text-xs font-bold text-[#D4AF37]">
                    {selectedInquiryIds.length} candidate(s) selected
                  </span>
                  <div className="h-4 w-px bg-white/20" />
                  <button
                    onClick={() => handleBulkInquiryStatus('contacted')}
                    className="text-xs font-bold hover:text-amber-300 transition-colors"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleBulkInquiryStatus('admitted')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Mark Admitted
                  </button>
                  <button
                    onClick={() => handleBulkInquiryStatus('archived')}
                    className="text-xs font-bold hover:text-slate-300 transition-colors"
                  >
                    Archive
                  </button>
                  <button
                    onClick={handleBulkDeleteInquiries}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedInquiryIds([])}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ADMISSION GUIDE & FEES MATRIX */}
          {activeTab === 'admission_guide' && admissionGuide && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-[#00183F]">
                    Admission Guide & Fee Schedule Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure official admission session year, open/close status, and tuition tiers.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Admissions Status:</label>
                  <button
                    type="button"
                    onClick={() =>
                      setAdmissionGuide({ ...admissionGuide, is_open: !admissionGuide.is_open })
                    }
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      admissionGuide.is_open
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {admissionGuide.is_open ? 'Currently Open' : 'Closed'}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveAdmissionGuide} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Academic Session Year
                    </label>
                    <input
                      type="text"
                      value={admissionGuide.academic_year}
                      onChange={(e) =>
                        setAdmissionGuide({ ...admissionGuide, academic_year: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Portal Announcement Headline
                    </label>
                    <input
                      type="text"
                      value={admissionGuide.title}
                      onChange={(e) =>
                        setAdmissionGuide({ ...admissionGuide, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Admission Overview Message
                  </label>
                  <textarea
                    rows={3}
                    value={admissionGuide.overview}
                    onChange={(e) =>
                      setAdmissionGuide({ ...admissionGuide, overview: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                  />
                </div>

                {/* Tuition Fee Breakdown List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tuition & Fee Structure (Editable Tiers)
                  </h4>
                  <div className="space-y-3">
                    {admissionGuide.fee_structure?.map((fee, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
                      >
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Section</label>
                          <input
                            type="text"
                            value={fee.section}
                            onChange={(e) => {
                              const newFee = [...admissionGuide.fee_structure];
                              newFee[idx].section = e.target.value;
                              setAdmissionGuide({ ...admissionGuide, fee_structure: newFee });
                            }}
                            className="w-full px-2.5 py-1 rounded-lg border border-slate-200 font-bold text-[#00183F]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Admission Fee</label>
                          <input
                            type="text"
                            value={fee.admission_fee}
                            onChange={(e) => {
                              const newFee = [...admissionGuide.fee_structure];
                              newFee[idx].admission_fee = e.target.value;
                              setAdmissionGuide({ ...admissionGuide, fee_structure: newFee });
                            }}
                            className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-[#C8102E] font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Monthly Tuition</label>
                          <input
                            type="text"
                            value={fee.monthly_tuition}
                            onChange={(e) => {
                              const newFee = [...admissionGuide.fee_structure];
                              newFee[idx].monthly_tuition = e.target.value;
                              setAdmissionGuide({ ...admissionGuide, fee_structure: newFee });
                            }}
                            className="w-full px-2.5 py-1 rounded-lg border border-slate-200 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Session Charge</label>
                          <input
                            type="text"
                            value={fee.annual_session_charge}
                            onChange={(e) => {
                              const newFee = [...admissionGuide.fee_structure];
                              newFee[idx].annual_session_charge = e.target.value;
                              setAdmissionGuide({ ...admissionGuide, fee_structure: newFee });
                            }}
                            className="w-full px-2.5 py-1 rounded-lg border border-slate-200"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={<Save className="w-4 h-4 text-[#D4AF37]" />}
                  >
                    Save Admission Matrix
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: SETTINGS & ABOUT INFO */}
          {activeTab === 'settings' && aboutInfo && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-4xl mx-auto space-y-8">
              {/* 1. CAMPUS FLASH ALERT BROADCAST CONTROLLER */}
              <div className="p-6 rounded-3xl border border-red-200 bg-red-50/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-red-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#00183F]">
                        Campus Flash Alert & Emergency Broadcast
                      </h4>
                      <p className="text-xs text-slate-500">
                        Broadcast a top-of-page emergency announcement across all public pages instantly.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={aboutInfo.emergency_alert?.is_active ?? false}
                      onChange={(e) =>
                        setAboutInfo({
                          ...aboutInfo,
                          emergency_alert: {
                            ...(aboutInfo.emergency_alert || {
                              message: 'Admissions for 2026-2027 are closing soon. Apply online today!',
                              type: 'urgent',
                              link_text: 'Read Circular',
                              link_url: '/notices',
                            }),
                            is_active: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    <span className="ml-2.5 text-xs font-bold text-slate-700">
                      {aboutInfo.emergency_alert?.is_active ? 'BROADCAST ACTIVE' : 'INACTIVE'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Alert Urgency Level
                    </label>
                    <select
                      value={aboutInfo.emergency_alert?.type || 'urgent'}
                      onChange={(e) =>
                        setAboutInfo({
                          ...aboutInfo,
                          emergency_alert: {
                            ...(aboutInfo.emergency_alert || { message: '', is_active: false }),
                            type: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                    >
                      <option value="urgent">🔴 Critical Emergency / Closures</option>
                      <option value="warning">🟡 Important Notice / Schedule Change</option>
                      <option value="info">🔵 Campus Bulletin / Announcement</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Broadcast Message *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Campus closed on Monday Oct 5 due to weather advisory."
                      value={aboutInfo.emergency_alert?.message || ''}
                      onChange={(e) =>
                        setAboutInfo({
                          ...aboutInfo,
                          emergency_alert: {
                            ...(aboutInfo.emergency_alert || { type: 'urgent', is_active: false }),
                            message: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Action Button Label (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Read Circular"
                      value={aboutInfo.emergency_alert?.link_text || ''}
                      onChange={(e) =>
                        setAboutInfo({
                          ...aboutInfo,
                          emergency_alert: {
                            ...(aboutInfo.emergency_alert || { type: 'urgent', is_active: false, message: '' }),
                            link_text: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Action Destination URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /notices or https://..."
                      value={aboutInfo.emergency_alert?.link_url || ''}
                      onChange={(e) =>
                        setAboutInfo({
                          ...aboutInfo,
                          emergency_alert: {
                            ...(aboutInfo.emergency_alert || { type: 'urgent', is_active: false, message: '' }),
                            link_url: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Live Preview */}
                {aboutInfo.emergency_alert?.message && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Live Public Visitor Preview:
                    </span>
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs ${
                        aboutInfo.emergency_alert.type === 'urgent'
                          ? 'bg-gradient-to-r from-red-700 via-[#C8102E] to-red-800 text-white'
                          : aboutInfo.emergency_alert.type === 'warning'
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                          : 'bg-gradient-to-r from-[#00183F] to-[#0D2852] text-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
                        <span className="truncate">
                          <strong>{aboutInfo.emergency_alert.type.toUpperCase()}:</strong> {aboutInfo.emergency_alert.message}
                        </span>
                      </div>
                      {aboutInfo.emergency_alert.link_text && (
                        <span className="px-2 py-0.5 rounded bg-white text-[#00183F] text-[10px] font-bold shrink-0 ml-2">
                          {aboutInfo.emergency_alert.link_text} →
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-[#00183F]">Institutional Information & Settings</h3>
                <p className="text-xs text-slate-500">
                  Update school identity, administrator leadership, homepage welcome & heritage showcase, and metrics.
                </p>
              </div>

              <form onSubmit={handleSaveAbout} className="space-y-6">
                {/* 1. Basic Identity */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#00183F]" />
                    Basic School Identity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Institution Name
                      </label>
                      <input
                        type="text"
                        value={aboutInfo.title}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Motto / Tagline
                      </label>
                      <input
                        type="text"
                        value={aboutInfo.tagline}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, tagline: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Head of Institution (Administrator) Card */}
                <div className="bg-gradient-to-br from-amber-50/50 via-white to-slate-50 p-6 rounded-2xl border-2 border-amber-200/80 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-[#00183F] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        Head of Institution Profile
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        In St. Joseph Narinda, the <strong>Administrator</strong> is the Head of Institution.
                      </p>
                    </div>

                    {/* Quick Sync from Administration Body & Governing Council */}
                    {adminLeaders && adminLeaders.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 shrink-0">⚡ Quick Sync:</span>
                        <select
                          className="text-xs font-medium bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 shadow-2xs focus:ring-2 focus:ring-[#00183F] outline-none text-[#00183F]"
                          onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const member = adminLeaders.find((m) => m.id === selectedId);
                            if (member) {
                              setAboutInfo({
                                ...aboutInfo,
                                principal_name: member.name,
                                principal_title: member.designation || 'Administrator',
                                principal_image_url: member.image_url || aboutInfo.principal_image_url,
                                head_role_badge: 'Head of Institution',
                              });
                              showToast(`Synced Head of Institution with "${member.name}"!`);
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>Sync from Administration Body...</option>
                          {adminLeaders.map((leader) => (
                            <option key={leader.id} value={leader.id}>
                              {leader.name} ({leader.designation})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Designation / Official Title
                      </label>
                      <input
                        type="text"
                        placeholder="Administrator"
                        value={aboutInfo.principal_title || ''}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, principal_title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none font-semibold text-[#00183F]"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Official designation (e.g. Administrator, Head of School).
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Head of Institution Name
                      </label>
                      <input
                        type="text"
                        placeholder="Brother Roktim Chiran, CSC"
                        value={aboutInfo.principal_name}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, principal_name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Role Badge Text
                      </label>
                      <input
                        type="text"
                        placeholder="Head of Institution"
                        value={aboutInfo.head_role_badge || 'Head of Institution'}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, head_role_badge: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                    </div>
                  </div>

                  {/* Photo Upload Section */}
                  <div className="space-y-3 pt-3 border-t border-amber-200/60">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Administrator Official Portrait Photo
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPhotoUrlInput(!showPhotoUrlInput)}
                        className="text-[11px] font-bold text-[#00183F] hover:text-[#C8102E] underline cursor-pointer"
                      >
                        {showPhotoUrlInput ? 'Hide Web URL Option' : 'Or enter web URL manually'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                      {/* Left: Active Photo Preview */}
                      <div className="md:col-span-5 flex items-center gap-4">
                        <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 border-amber-300 shadow-md">
                          {aboutInfo.principal_image_url ? (
                            <img
                              src={aboutInfo.principal_image_url}
                              alt={aboutInfo.principal_name || 'Administrator'}
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                (e.target as any).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-400">
                              <ImageIcon className="w-8 h-8 mb-1 text-slate-300" />
                              <span className="text-[10px] font-semibold">No Photo</span>
                            </div>
                          )}
                          {uploadingPhoto && (
                            <div className="absolute inset-0 bg-[#00183F]/80 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                              <Loader2 className="w-6 h-6 animate-spin text-amber-400 mb-1" />
                              <span className="text-[10px] font-bold">Uploading...</span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Official Head Portrait
                          </span>
                          <h5 className="font-black text-sm text-[#00183F] truncate">
                            {aboutInfo.principal_name || 'Administrator'}
                          </h5>
                          <p className="text-xs font-bold text-[#C8102E] truncate">
                            {aboutInfo.principal_title || 'Administrator'}
                          </p>
                          {aboutInfo.principal_image_url && (
                            <button
                              type="button"
                              onClick={() => setAboutInfo({ ...aboutInfo, principal_image_url: '' })}
                              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 pt-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove Photo</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right: Direct File Upload Dropzone */}
                      <div className="md:col-span-7">
                        <label
                          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                            uploadingPhoto
                              ? 'border-amber-400 bg-amber-50/50 pointer-events-none'
                              : 'border-slate-300 bg-slate-50/80 hover:bg-amber-50/40 hover:border-amber-400'
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePrincipalImageUpload}
                            disabled={uploadingPhoto}
                            className="hidden"
                          />
                          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#00183F] flex items-center justify-center mb-2 shadow-xs">
                            <UploadCloud className="w-6 h-6 text-[#00183F]" />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-xs sm:text-sm font-bold text-[#00183F]">
                              <span>Click to choose photo from device</span> or drag here
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Supports JPG, PNG, WEBP (stored directly to server media storage)
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Optional URL Input */}
                    {showPhotoUrlInput && (
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 transition-all">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          External Web Image URL
                        </label>
                        <input
                          type="text"
                          value={aboutInfo.principal_image_url}
                          placeholder="https://... or /media/uploads/..."
                          onChange={(e) => setAboutInfo({ ...aboutInfo, principal_image_url: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Welcome Message & Quotation
                    </label>
                    <textarea
                      rows={4}
                      value={aboutInfo.principal_message}
                      onChange={(e) => setAboutInfo({ ...aboutInfo, principal_message: e.target.value })}
                      placeholder="Welcome statement displayed in quotes on the homepage and about page..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                    />
                  </div>
                </div>

                {/* 3. Homepage Welcome Section Visual Customizer */}
                <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 space-y-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C8102E]" />
                    Homepage Welcome & Heritage Section Customizer
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Eyebrow Tagline
                      </label>
                      <input
                        type="text"
                        placeholder="WELCOME TO ST. JOSEPH NARINDA"
                        value={aboutInfo.welcome_tag || ''}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, welcome_tag: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Main Section Heading
                      </label>
                      <input
                        type="text"
                        placeholder="Educating Hearts & Minds for Generations."
                        value={aboutInfo.welcome_title || ''}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, welcome_title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none font-bold text-[#00183F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Heritage Badge Counter
                      </label>
                      <input
                        type="text"
                        placeholder="70+"
                        value={aboutInfo.heritage_years || ''}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, heritage_years: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Heritage Badge Label
                      </label>
                      <input
                        type="text"
                        placeholder="Years of Heritage"
                        value={aboutInfo.heritage_label || ''}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, heritage_label: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      School History & Heritage Overview
                    </label>
                    <textarea
                      rows={4}
                      value={aboutInfo.history}
                      onChange={(e) => setAboutInfo({ ...aboutInfo, history: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                    />
                  </div>

                  {/* Dynamic Pillars (Highlights) */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Core Pillars / Checklist Highlights
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentPillars = aboutInfo.pillars && aboutInfo.pillars.length > 0
                            ? [...aboutInfo.pillars]
                            : [
                                'Cambridge Assessment International Education (CAIE)',
                                'Dedicated Congregation of Holy Cross Mentorship',
                                'Comprehensive STEM & Robotics Laboratories',
                                'Champion Debating & Co-Curricular Guilds',
                              ];
                          setAboutInfo({
                            ...aboutInfo,
                            pillars: [...currentPillars, 'New Institution Feature or Pillar'],
                          });
                        }}
                        className="text-xs font-bold text-[#00183F] hover:text-[#C8102E] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Pillar
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(aboutInfo.pillars && aboutInfo.pillars.length > 0
                        ? aboutInfo.pillars
                        : [
                            'Cambridge Assessment International Education (CAIE)',
                            'Dedicated Congregation of Holy Cross Mentorship',
                            'Comprehensive STEM & Robotics Laboratories',
                            'Champion Debating & Co-Curricular Guilds',
                          ]
                      ).map((pillar, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0" />
                          <input
                            type="text"
                            value={pillar}
                            onChange={(e) => {
                              const list = aboutInfo.pillars && aboutInfo.pillars.length > 0
                                ? [...aboutInfo.pillars]
                                : [
                                    'Cambridge Assessment International Education (CAIE)',
                                    'Dedicated Congregation of Holy Cross Mentorship',
                                    'Comprehensive STEM & Robotics Laboratories',
                                    'Champion Debating & Co-Curricular Guilds',
                                  ];
                              list[idx] = e.target.value;
                              setAboutInfo({ ...aboutInfo, pillars: list });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = aboutInfo.pillars && aboutInfo.pillars.length > 0
                                ? [...aboutInfo.pillars]
                                : [
                                    'Cambridge Assessment International Education (CAIE)',
                                    'Dedicated Congregation of Holy Cross Mentorship',
                                    'Comprehensive STEM & Robotics Laboratories',
                                    'Champion Debating & Co-Curricular Guilds',
                                  ];
                              list.splice(idx, 1);
                              setAboutInfo({ ...aboutInfo, pillars: list });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove Pillar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons Customizer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-[#00183F]">Primary Action Button</div>
                      <input
                        type="text"
                        placeholder="Button Text e.g. Read Full School History"
                        value={aboutInfo.primary_button_text || ''}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, primary_button_text: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                      <input
                        type="text"
                        placeholder="URL e.g. /about"
                        value={aboutInfo.primary_button_url || ''}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, primary_button_url: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none font-mono"
                      />
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-[#00183F]">Secondary Action Button</div>
                      <input
                        type="text"
                        placeholder="Button Text e.g. Admission Information"
                        value={aboutInfo.secondary_button_text || ''}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, secondary_button_text: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                      <input
                        type="text"
                        placeholder="URL e.g. /admission"
                        value={aboutInfo.secondary_button_url || ''}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, secondary_button_url: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      School Mission
                    </label>
                    <textarea
                      rows={3}
                      value={aboutInfo.mission}
                      onChange={(e) => setAboutInfo({ ...aboutInfo, mission: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      School Vision
                    </label>
                    <textarea
                      rows={3}
                      value={aboutInfo.vision}
                      onChange={(e) => setAboutInfo({ ...aboutInfo, vision: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                    />
                  </div>
                </div>

                {/* Counter Statistics */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Institutional Counter Metrics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Students</label>
                      <input
                        type="text"
                        value={aboutInfo.stats?.students || '3,200+'}
                        onChange={(e) =>
                          setAboutInfo({
                            ...aboutInfo,
                            stats: { ...aboutInfo.stats, students: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#00183F]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Faculty</label>
                      <input
                        type="text"
                        value={aboutInfo.stats?.faculty || '140+'}
                        onChange={(e) =>
                          setAboutInfo({
                            ...aboutInfo,
                            stats: { ...aboutInfo.stats, faculty: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#00183F]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Pass Rate</label>
                      <input
                        type="text"
                        value={aboutInfo.stats?.pass_rate || '100%'}
                        onChange={(e) =>
                          setAboutInfo({
                            ...aboutInfo,
                            stats: { ...aboutInfo.stats, pass_rate: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#00183F]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Clubs</label>
                      <input
                        type="text"
                        value={aboutInfo.stats?.clubs || '24+'}
                        onChange={(e) =>
                          setAboutInfo({
                            ...aboutInfo,
                            stats: { ...aboutInfo.stats, clubs: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#00183F]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={<Save className="w-4 h-4 text-[#D4AF37]" />}
                  >
                    Save Institutional Profile
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- MODAL: SLIDE CRUD (With Live Image Preview) ---------------- */}
      {slideModalOpen && editingSlide && (
        <Modal
          isOpen={slideModalOpen}
          onClose={() => {
            setSlideModalOpen(false);
            setEditingSlide(null);
          }}
          title={editingSlide.id ? 'Edit Hero Slide' : 'Create New Hero Slide'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveSlide} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Headline Title *
              </label>
              <input
                type="text"
                required
                value={editingSlide.title || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                placeholder="e.g. Nurturing Excellence, Inspiring Leadership"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={editingSlide.subtitle || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                placeholder="Detailed description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tag Badge
                </label>
                <input
                  type="text"
                  value={editingSlide.badge || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  placeholder="e.g. Excellence in Education"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingSlide.order ?? 1}
                  onChange={(e) => setEditingSlide({ ...editingSlide, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <ImageHelper
              value={editingSlide.image_url || ''}
              onChange={(url) => setEditingSlide({ ...editingSlide, image_url: url })}
              label="Background Banner Image"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={editingSlide.cta_text || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, cta_text: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  placeholder="Apply Online"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={editingSlide.cta_link || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, cta_link: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  placeholder="/admission"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="slide-active"
                checked={editingSlide.is_active ?? true}
                onChange={(e) => setEditingSlide({ ...editingSlide, is_active: e.target.checked })}
                className="w-4 h-4 rounded text-[#00183F]"
              />
              <label htmlFor="slide-active" className="text-xs font-bold text-slate-700">
                Active & Visible on Public Homepage
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSlideModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Slide
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------------- MODAL: NOTICE CRUD ---------------- */}
      {noticeModalOpen && editingNotice && (
        <Modal
          isOpen={noticeModalOpen}
          onClose={() => {
            setNoticeModalOpen(false);
            setEditingNotice(null);
          }}
          title={editingNotice.id ? 'Edit Circular Notice' : 'Publish New Circular Notice'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveNotice} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Notice Title *
              </label>
              <input
                type="text"
                required
                value={editingNotice.title || ''}
                onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                placeholder="e.g. Schedule for Cambridge IGCSE Mock Examinations"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={editingNotice.category || 'general'}
                  onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="academic">Academic</option>
                  <option value="admission">Admission</option>
                  <option value="exams">Examinations</option>
                  <option value="events">Events & Celebrations</option>
                  <option value="holidays">Holidays & Closures</option>
                  <option value="general">General Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Publish Date *
                </label>
                <input
                  type="date"
                  required
                  value={editingNotice.publish_date || ''}
                  onChange={(e) => setEditingNotice({ ...editingNotice, publish_date: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Detailed Notice Content *
              </label>
              <textarea
                rows={5}
                required
                value={editingNotice.content || ''}
                onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                placeholder="Full text of the circular notice..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Attachment URL (Optional PDF)
              </label>
              <input
                type="text"
                value={editingNotice.attachment_url || ''}
                onChange={(e) => setEditingNotice({ ...editingNotice, attachment_url: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                placeholder="https://.../notice.pdf"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={editingNotice.is_pinned ?? false}
                  onChange={(e) => setEditingNotice({ ...editingNotice, is_pinned: e.target.checked })}
                  className="w-4 h-4 rounded text-[#C8102E]"
                />
                Pin Notice to Top
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={editingNotice.is_active ?? true}
                  onChange={(e) => setEditingNotice({ ...editingNotice, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#00183F]"
                />
                Published (Active)
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setNoticeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Circular
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------------- MODAL: CLUB CRUD (With Live Preview) ---------------- */}
      {clubModalOpen && editingClub && (
        <Modal
          isOpen={clubModalOpen}
          onClose={() => {
            setClubModalOpen(false);
            setEditingClub(null);
          }}
          title={editingClub.id ? 'Edit Student Club' : 'Register New Student Club'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveClub} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Club Name *
              </label>
              <input
                type="text"
                required
                value={editingClub.name || ''}
                onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                placeholder="e.g. Josephite Robotics Club"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={editingClub.category || 'stem'}
                  onChange={(e) => setEditingClub({ ...editingClub, category: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="stem">STEM & Innovation</option>
                  <option value="debate">Debate & Public Speaking</option>
                  <option value="arts">Cultural & Fine Arts</option>
                  <option value="sports">Sports & Athletics</option>
                  <option value="service">Leadership & Social Welfare</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Motto
                </label>
                <input
                  type="text"
                  value={editingClub.motto || ''}
                  onChange={(e) => setEditingClub({ ...editingClub, motto: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  placeholder="e.g. Curiosity Unveils Tomorrow"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Guild Description *
              </label>
              <textarea
                rows={3}
                required
                value={editingClub.description || ''}
                onChange={(e) => setEditingClub({ ...editingClub, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                placeholder="About club objectives..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Faculty Moderator
                </label>
                <input
                  type="text"
                  value={editingClub.moderator_name || ''}
                  onChange={(e) => setEditingClub({ ...editingClub, moderator_name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  placeholder="Faculty Advisor Name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Meeting Schedule
                </label>
                <input
                  type="text"
                  value={editingClub.schedule || ''}
                  onChange={(e) => setEditingClub({ ...editingClub, schedule: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  placeholder="Thursdays, 3:30 PM"
                />
              </div>
            </div>

            <ImageHelper
              value={editingClub.image_url || ''}
              onChange={(url) => setEditingClub({ ...editingClub, image_url: url })}
              label="Club Cover Photo"
              required
            />

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setClubModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Club
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------------- MODAL: GALLERY CRUD (With Live Preview) ---------------- */}
      {galleryModalOpen && editingGallery && (
        <Modal
          isOpen={galleryModalOpen}
          onClose={() => {
            setGalleryModalOpen(false);
            setEditingGallery(null);
          }}
          title={editingGallery.id ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
          maxWidth="md"
        >
          <form onSubmit={handleSaveGallery} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Media Title *
              </label>
              <input
                type="text"
                required
                value={editingGallery.title || ''}
                onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                placeholder="e.g. Historic Quadrangle Lawn"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={editingGallery.category || 'campus'}
                onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="campus">Campus & Heritage</option>
                <option value="academics">Academics & Labs</option>
                <option value="sports">Sports & Athletics</option>
                <option value="cultural">Arts & Culture</option>
                <option value="events">Annual Celebrations</option>
              </select>
            </div>

            <ImageHelper
              value={editingGallery.image_url || ''}
              onChange={(url) => setEditingGallery({ ...editingGallery, image_url: url })}
              label="Gallery Photo / Asset"
              required
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Caption / Description
              </label>
              <textarea
                rows={2}
                value={editingGallery.caption || ''}
                onChange={(e) => setEditingGallery({ ...editingGallery, caption: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                placeholder="Brief description..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="gallery-feat"
                checked={editingGallery.is_featured ?? true}
                onChange={(e) => setEditingGallery({ ...editingGallery, is_featured: e.target.checked })}
                className="w-4 h-4 rounded text-[#00183F]"
              />
              <label htmlFor="gallery-feat" className="text-xs font-bold text-slate-700">
                Feature on Homepage Moments Section
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setGalleryModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Media
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------------- MODAL: INQUIRY DETAILS INSPECTOR ---------------- */}
      {selectedInquiry && (
        <Modal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          title={`Admission Application #${selectedInquiry.id}`}
          maxWidth="md"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Candidate Name</span>
                <h4 className="text-lg font-black text-[#00183F]">{selectedInquiry.student_name}</h4>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#C8102E]/10 text-[#C8102E]">
                {selectedInquiry.grade_applying}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Parent/Guardian</span>
                <span className="font-bold text-slate-800 text-sm">{selectedInquiry.parent_name}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Previous School</span>
                <span className="font-bold text-slate-800 text-sm">{selectedInquiry.previous_school || 'None'}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">{selectedInquiry.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">{selectedInquiry.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Submitted at: {selectedInquiry.created_at}</span>
              </div>
            </div>

            {/* Quick Action Dispatch Toolbar */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Instant Communication & Candidate Dossier
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00183F] hover:bg-[#0D2852] text-white text-xs font-bold transition-transform active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Call Phone</span>
                </a>

                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                    `St. Joseph International School - Admissions Update: ${selectedInquiry.student_name}`
                  )}&body=${encodeURIComponent(
                    `Dear ${selectedInquiry.parent_name},\n\nThank you for applying to St. Joseph International School, Narinda for ${selectedInquiry.student_name} (${selectedInquiry.grade_applying}).\n\nAdmissions Committee,\nSt. Joseph International School, Narinda`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>Send Email</span>
                </a>

                <a
                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSlipInquiry(selectedInquiry)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-amber-500 text-[#00183F] text-xs font-bold transition-transform active:scale-95 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Slip</span>
                </button>
              </div>
            </div>

            {selectedInquiry.message && (
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs">
                <span className="font-bold text-[#00183F] block mb-1">Parent Note / Message:</span>
                <p className="text-slate-700 leading-relaxed">{selectedInquiry.message}</p>
              </div>
            )}

            {/* Staff Internal Evaluation Notes */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Staff Evaluation & Internal Administrative Notes
                </label>
                <button
                  type="button"
                  onClick={() => handleSaveInquiryNotes(selectedInquiry.id)}
                  className="text-[11px] font-bold text-[#00183F] hover:text-[#C8102E] flex items-center gap-1"
                >
                  <Save className="w-3 h-3 text-[#D4AF37]" />
                  <span>Save Notes</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={staffNotesDraft}
                onChange={(e) => setStaffNotesDraft(e.target.value)}
                placeholder="Record interview notes, document verification checks, fee receipt status..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Workflow Application Status
              </label>
              <select
                value={selectedInquiry.status}
                onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
              >
                <option value="pending">Pending Review</option>
                <option value="contacted">Contacted / Interview Scheduled</option>
                <option value="admitted">Admitted / Enrolled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* ---------------- CUSTOM DELETE CONFIRMATION DIALOG ---------------- */}
      {deleteDialog.isOpen && (
        <Modal
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
          title={deleteDialog.title}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-800 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="leading-relaxed">{deleteDialog.message}</span>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={deleteDialog.onConfirm}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ---------------- SPOTLIGHT COMMAND PALETTE (Cmd+K) ---------------- */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onAction={handleCommandAction}
        notices={notices}
        clubs={clubs}
        inquiries={inquiries}
        gallery={gallery}
        slides={slides}
        onSelectInquiry={(inq) => setSelectedInquiry(inq)}
        onEditNotice={(n) => {
          setEditingNotice(n);
          setNoticeModalOpen(true);
        }}
        onEditClub={(c) => {
          setEditingClub(c);
          setClubModalOpen(true);
        }}
      />

      {/* ---------------- OFFICIAL ADMISSION REGISTRATION SLIP MODAL ---------------- */}
      <AdmissionSlipModal
        inquiry={slipInquiry}
        onClose={() => setSlipInquiry(null)}
      />

      {/* ---------------- DISASTER RECOVERY: DATABASE RESTORE MODAL ---------------- */}
      <DatabaseRestoreModal
        isOpen={restoreModalOpen}
        onClose={() => setRestoreModalOpen(false)}
        token={token || undefined}
        onRestoreSuccess={() => {
          showToast('Database restore completed. Refreshing records...');
          refreshAllData(token || undefined);
        }}
      />

      {/* ---------------- KEYBOARD SHORTCUTS REFERENCE MODAL ---------------- */}
      {shortcutsModalOpen && (
        <Modal
          isOpen={shortcutsModalOpen}
          onClose={() => setShortcutsModalOpen(false)}
          title="Control Center Keyboard Shortcuts"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <p className="text-[11px] text-slate-500">
              Boost your daily administrative productivity using built-in keyboard hotkeys:
            </p>

            <div className="space-y-2 divide-y divide-slate-100">
              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold">Global Command Palette</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-[10px]">
                  ⌘ K / Ctrl + K
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold">Switch Tabs</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-[10px]">
                  Keys 1 through 8
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold">Close Active Modal / Palette</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-[10px]">
                  Escape (Esc)
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold">Keyboard Cheat Sheet</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-[10px]">
                  ? Key
                </kbd>
              </div>
            </div>

            <div className="pt-2 text-right">
              <Button variant="ghost" size="sm" onClick={() => setShortcutsModalOpen(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
