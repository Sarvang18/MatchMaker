'use client';

import { useState, useMemo } from 'react';
import { MatchCard } from './MatchCard';
import type { AILabel } from '@prisma/client';

interface DimensionScore {
  name: string;
  weight: number;
  score: number;
  contribution: number;
}

interface Match {
  matchId: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | Date;
    city: string;
    gender: string;
    religion: string;
    caste: string;
    currentCompany: string;
    designation: string;
    income: number;
    photoUrl: string | null;
  };
  totalScore: number;
  label: AILabel;
  dimensionScores: DimensionScore[];
}

interface MatchGridProps {
  matches: Match[];
  onSendMatch?: (matchId: string) => void;
}

type SortOption = 'best' | 'score-high' | 'score-low' | 'name';
type FilterOption = 'all' | 'DREAM' | 'HIGH' | 'COMPATIBLE';

export function MatchGrid({ matches, onSendMatch }: MatchGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('best');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const filteredAndSorted = useMemo(() => {
    let result = [...matches];

    // Apply filter
    if (filterBy !== 'all') {
      result = result.filter(m => m.label === filterBy);
    }

    // Apply sort
    switch (sortBy) {
      case 'best':
        // Already sorted by score descending from API
        break;
      case 'score-high':
        result.sort((a, b) => b.totalScore - a.totalScore);
        break;
      case 'score-low':
        result.sort((a, b) => a.totalScore - b.totalScore);
        break;
      case 'name':
        result.sort((a, b) =>
          `${a.candidate.firstName} ${a.candidate.lastName}`.localeCompare(
            `${b.candidate.firstName} ${b.candidate.lastName}`
          )
        );
        break;
    }

    return result;
  }, [matches, sortBy, filterBy]);

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No matches found. Try adjusting your criteria.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="best">Best Match</option>
            <option value="score-high">Score: High to Low</option>
            <option value="score-low">Score: Low to High</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Show:</label>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Matches ({matches.length})</option>
            <option value="DREAM">Dream Only ({matches.filter(m => m.label === 'DREAM').length})</option>
            <option value="HIGH">High Potential ({matches.filter(m => m.label === 'HIGH').length})</option>
            <option value="COMPATIBLE">Compatible ({matches.filter(m => m.label === 'COMPATIBLE').length})</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-gray-600">
          Showing {filteredAndSorted.length} of {matches.length} matches
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSorted.map((match) => (
          <MatchCard
            key={match.matchId}
            {...match}
            onSendMatch={() => onSendMatch?.(match.matchId)}
          />
        ))}
      </div>

      {filteredAndSorted.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No matches found with the selected filter.</p>
        </div>
      )}
    </div>
  );
}
