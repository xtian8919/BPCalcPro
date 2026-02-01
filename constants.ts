
import { BPStatus, HRStatus } from './types';

export const BP_RANGES = [
  { status: BPStatus.NORMAL, minSys: 0, maxSys: 119, minDia: 0, maxDia: 79, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-500' },
  { status: BPStatus.ELEVATED, minSys: 120, maxSys: 129, minDia: 0, maxDia: 79, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-500' },
  { status: BPStatus.HYPERTENSION_S1, minSys: 130, maxSys: 139, minDia: 80, maxDia: 89, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-500' },
  { status: BPStatus.HYPERTENSION_S2, minSys: 140, maxSys: 179, minDia: 90, maxDia: 119, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-500' },
  { status: BPStatus.CRISIS, minSys: 180, maxSys: 300, minDia: 120, maxDia: 300, color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-600' }
];

export const HR_RANGES = [
  { status: HRStatus.BRADYCARDIA, min: 0, max: 59, label: 'Low (Bradycardia)', color: 'text-blue-600' },
  { status: HRStatus.NORMAL, min: 60, max: 100, label: 'Normal', color: 'text-green-600' },
  { status: HRStatus.TACHYCARDIA, min: 101, max: 300, label: 'High (Tachycardia)', color: 'text-red-600' }
];

export const BP_CHART_REFERENCE = [
  { category: 'Low', sys: 90, dia: 60, fill: '#bfdbfe' },
  { category: 'Normal', sys: 115, dia: 75, fill: '#bbf7d0' },
  { category: 'Elevated', sys: 125, dia: 78, fill: '#fef08a' },
  { category: 'Stage 1', sys: 135, dia: 85, fill: '#fed7aa' },
  { category: 'Stage 2', sys: 155, dia: 95, fill: '#fecaca' },
  { category: 'Crisis', sys: 190, dia: 125, fill: '#f5d0fe' },
];

export const HR_CHART_REFERENCE = [
  { category: 'Sleep', bpm: 50, fill: '#dbeafe' },
  { category: 'Resting', bpm: 72, fill: '#bbf7d0' },
  { category: 'Walking', bpm: 110, fill: '#fef08a' },
  { category: 'Exercise', bpm: 155, fill: '#fed7aa' },
  { category: 'Peak', bpm: 185, fill: '#fecaca' },
];
