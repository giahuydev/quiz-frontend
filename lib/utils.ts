// File: quiz-frontend/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Logic đơn giản nhất: ghép chuỗi Ngày/Tháng/Năm
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-';
  
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';

  const day = d.getDate();
  const month = d.getMonth() + 1; // Tháng trong JS tính từ 0-11
  const year = d.getFullYear();

  // Thêm số 0 phía trước nếu ngày/tháng < 10
  const dd = day < 10 ? '0' + day : day;
  const mm = month < 10 ? '0' + month : month;

  return dd + '/' + mm + '/' + year;
}

export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  const hh = h < 10 ? '0' + h : h;
  const mm = m < 10 ? '0' + m : m;
  const ss = s < 10 ? '0' + s : s;

  return hh + ':' + mm + ':' + ss;
}
