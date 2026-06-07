'use client';

import { useState } from 'react';
import type { Client } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResponseButtons } from './ResponseButtons';
import { ResponseConfirmation } from './ResponseConfirmation';

interface PortalProfileProps {
  token: string;
  matchId: string;
  clientFirstName: string;
  candidate: Client;
  introEmail: string;
  alreadyResponded: boolean;
  responseStatus: string;
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Format enum values to human-readable
 */
function formatEnum(value: string): string {
  return value
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

export function PortalProfile({
  token,
  matchId,
  clientFirstName,
  candidate,
  introEmail,
  alreadyResponded,
  responseStatus,
}: PortalProfileProps) {
  const [responded, setResponded] = useState(alreadyResponded);
  const [response, setResponse] = useState<'INTERESTED' | 'NOT_INTERESTED' | null>(
    alreadyResponded ? (responseStatus as any) : null
  );

  const age = calculateAge(candidate.dateOfBirth);
  const fullName = `${candidate.firstName} ${candidate.lastName}`;

  const handleResponse = async (responseType: 'INTERESTED' | 'NOT_INTERESTED') => {
    try {
      const res = await fetch(`/api/matches/${matchId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, response: responseType }),
      });

      if (res.ok) {
        setResponded(true);
        setResponse(responseType);
      } else {
        const data = await res.json();
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  if (responded && response) {
    return <ResponseConfirmation response={response} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a1a2e] px-6 py-8 text-center">
        <h1 className="text-white text-2xl font-light tracking-[0.2em] mb-2">
          THE DATE CREW
        </h1>
        <p className="text-[#a0a0b8] text-xs tracking-widest">
          MATCHMAKING · CURATED FOR YOU
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Hi {clientFirstName} 👋
          </h2>
          <p className="text-gray-600">
            Your matchmaker has found a potential match for you
          </p>
        </div>

        {/* Candidate Profile */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-20 h-20 mb-4">
              <AvatarImage src={candidate.photoUrl || undefined} />
              <AvatarFallback className="text-2xl bg-purple-100">
                {candidate.firstName[0]}{candidate.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {fullName}
            </h3>
            <p className="text-gray-600">
              {age} years · {candidate.city}
            </p>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            {/* Profession */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Profession</div>
              <div className="font-medium text-gray-900">
                {candidate.designation}
              </div>
              <div className="text-sm text-gray-600">at {candidate.currentCompany}</div>
            </div>

            {/* Education */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Education</div>
              <div className="font-medium text-gray-900">{candidate.degree}</div>
              <div className="text-sm text-gray-600">{candidate.undergradCollege}</div>
            </div>

            {/* About */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-2">About</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Religion:</span>{' '}
                  <span className="font-medium text-gray-900">{candidate.religion}</span>
                </div>
                <div>
                  <span className="text-gray-600">Caste:</span>{' '}
                  <span className="font-medium text-gray-900">{candidate.caste}</span>
                </div>
                <div>
                  <span className="text-gray-600">Family:</span>{' '}
                  <span className="font-medium text-gray-900">{formatEnum(candidate.familyType)} family</span>
                </div>
                <div>
                  <span className="text-gray-600">Wants kids:</span>{' '}
                  <span className="font-medium text-gray-900">{formatEnum(candidate.wantKids)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Open to relocate:</span>{' '}
                  <span className="font-medium text-gray-900">{formatEnum(candidate.openToRelocate)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Dietary:</span>{' '}
                  <span className="font-medium text-gray-900">{formatEnum(candidate.dietaryPreference)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matchmaker's Note */}
        {introEmail && (
          <div className="mb-8">
            <div className="text-center text-sm text-gray-500 mb-3">
              ── A note from your matchmaker ──
            </div>
            <div className="bg-[#faf8ff] border-l-4 border-purple-500 rounded-r-lg p-6">
              <p className="text-gray-700 italic leading-relaxed whitespace-pre-line">
                {introEmail}
              </p>
            </div>
          </div>
        )}

        {/* Response Section */}
        <div className="mb-8">
          <div className="text-center text-sm text-gray-500 mb-4">
            ── How do you feel? ──
          </div>
          <ResponseButtons onRespond={handleResponse} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a1a2e] px-6 py-6 text-center mt-12">
        <p className="text-gray-500 text-xs">
          © 2025 The Date Crew · Crafting meaningful connections
        </p>
      </div>
    </div>
  );
}
