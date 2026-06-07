import { ClientStatus } from '@/types';

export function getStatusColor(status: ClientStatus): string {
  switch (status) {
    case 'ONBOARDED':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'ACTIVE':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'MATCH_SENT':
      return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'MUTUAL_INTEREST':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'MEETING_SCHEDULED':
      return 'bg-teal-100 text-teal-700 border-teal-300';
    case 'CLOSED_WON':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'CLOSED_LOST':
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

export function getStatusLabel(status: ClientStatus): string {
  return status.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ');
}

export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function getInitialsColor(name: string): string {
  const colors = [
    'bg-purple-500',
    'bg-teal-500',
    'bg-blue-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-indigo-500',
    'bg-cyan-500',
    'bg-rose-500',
  ];
  
  const firstLetter = name.charAt(0).toUpperCase();
  const index = firstLetter.charCodeAt(0) % colors.length;
  return colors[index];
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatIncome(income: number): string {
  const lpa = income / 100000;
  return `₹${lpa} LPA`;
}

export function formatHeight(heightCm: number): string {
  const totalInches = heightCm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${heightCm} cm (${feet}'${inches}")`;
}

export function formatEnum(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}
