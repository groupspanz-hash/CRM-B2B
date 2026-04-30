
import { ActivityType } from './types';
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Users, 
  ShieldCheck, 
  Trophy, 
  Target, 
  CheckCircle2, 
  Gift, 
  AlertTriangle 
} from 'lucide-react';
import React from 'react';

export const RELATIONSHIP_CATEGORIES = [
  {
    id: 'stranger',
    label: 'Stranger (Orang Asing)',
    definition: 'Belum pernah kenal sama sekali',
    trustLevel: 'Sangat rendah',
    approach: 'Branding, kredibilitas, social proof',
    probabilityRange: [5, 15],
    defaultProbability: 10,
    notes: 'Butuh effort besar (iklan, testimoni, reputasi)'
  },
  {
    id: 'acquaintance',
    label: 'Acquaintance (Kenalan)',
    definition: 'Pernah interaksi ringan (event, sosial media, dll)',
    trustLevel: 'Rendah–sedang',
    approach: 'Edukasi, follow-up, storytelling',
    probabilityRange: [15, 30],
    defaultProbability: 25,
    notes: 'Sudah ada awareness, tinggal bangun trust'
  },
  {
    id: 'warm_contact',
    label: 'Warm Contact (Relasi Hangat)',
    definition: 'Ada hubungan atau dikenalkan oleh pihak ketiga',
    trustLevel: 'Sedang',
    approach: 'Konsultatif, fokus solusi',
    probabilityRange: [30, 60],
    defaultProbability: 45,
    notes: 'Referral sangat kuat di tahap ini'
  },
  {
    id: 'trusted',
    label: 'Trusted Relationship (Relasi Terpercaya)',
    definition: 'Sudah pernah transaksi atau hubungan profesional berjalan',
    trustLevel: 'Tinggi',
    approach: 'Value-based selling, upselling',
    probabilityRange: [60, 85],
    defaultProbability: 75,
    notes: 'Lebih mudah closing, fokus pada kebutuhan lanjutan'
  },
  {
    id: 'inner_circle',
    label: 'Inner Circle (Relasi Dekat)',
    definition: 'Teman dekat, keluarga, partner lama',
    trustLevel: 'Sangat tinggi',
    approach: 'Transparansi + win-win mindset',
    probabilityRange: [80, 95],
    defaultProbability: 90,
    notes: 'Hati-hati—emosi bisa memengaruhi objektivitas'
  }
];

export const ACTIVITY_POINTS: Record<ActivityType, number> = {
  chat_telpon: 5,
  meeting: 10,
  joy_wish: 10,
  non_sales_fu: 6,
  consultation_solusi: 20,
  gift: 25,
  deal_first: 30,
  repeat_order: 40,
  long_term: 60,
  referral: 50,
  no_response_14: -10,
  no_response_30: -25,
  failed_deal: -20,
  complaint: -30,
};

export const RS_LEVELS = [
  { label: 'Loyal', min: 251, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Trusted', min: 151, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Engaged', min: 81, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Warm', min: 31, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Cold', min: -Infinity, color: 'text-slate-400', bg: 'bg-slate-50' },
];

export const BUSINESS_INDUSTRIES = [
  'Teknologi & IT',
  'Pertanian & Agribisnis',
  'Instansi Pemerintahan',
  'Pendidikan',
  'Kesehatan',
  'Manufaktur',
  'F&B (Makanan & Minuman)',
  'Retail & E-commerce',
  'Properti & Konstruksi',
  'Transportasi & Logistik',
  'Lainnya'
];

export const ACTIVITY_GROUPS = [
  {
    label: 'Komunikasi',
    items: [
      { id: 'chat_telpon', label: 'Chat/Telpon', icon: <Phone size={14} />, points: 5 },
      { id: 'meeting', label: 'Meeting / Visit', icon: <Users size={14} />, points: 10 },
    ]
  },
  {
    label: 'Engagement Personal',
    items: [
      { id: 'joy_wish', label: 'Ucapan Suka Cita', icon: <ShieldCheck size={14} />, points: 10 },
      { id: 'non_sales_fu', label: 'Follow-up Personal', icon: <MessageSquare size={14} />, points: 6 },
    ]
  },
  {
    label: 'Value Giving',
    items: [
      { id: 'consultation_solusi', label: 'Konsultasi/ Solusi', icon: <Target size={14} />, points: 20 },
      { id: 'gift', label: 'Memberi Hadiah', icon: <Gift size={14} />, points: 25 },
    ]
  },
  {
    label: 'Transaksi',
    items: [
      { id: 'deal_first', label: 'Deal Pertama', icon: <Trophy size={14} />, points: 30 },
      { id: 'repeat_order', label: 'Repeat Order', icon: <Trophy size={14} />, points: 40 },
      { id: 'long_term', label: 'Kontrak Jangka Panjang', icon: <Trophy size={14} />, points: 60 },
      { id: 'referral', label: 'Referral', icon: <Users size={14} />, points: 50 },
    ]
  },
  {
    label: 'Negative',
    items: [
      { id: 'no_response_14', label: 'Tidak Respon 14 Hari', icon: <AlertTriangle size={14} />, points: -10 },
      { id: 'no_response_30', label: 'Tidak Respon 30 Hari', icon: <AlertTriangle size={14} />, points: -25 },
      { id: 'failed_deal', label: 'Deal Gagal', icon: <AlertTriangle size={14} />, points: -20 },
      { id: 'complaint', label: 'Komplain', icon: <AlertTriangle size={14} />, points: -30 },
    ]
  }
];
