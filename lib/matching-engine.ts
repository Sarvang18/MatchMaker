import type { Client, AILabel } from '@prisma/client';

/**
 * Represents a scored candidate with compatibility breakdown
 */
export interface ScoredCandidate {
  client: Client;
  totalScore: number;
  label: AILabel;
  dimensionScores: DimensionScore[];
}

/**
 * Individual dimension score breakdown
 */
export interface DimensionScore {
  name: string;
  weight: number;
  score: number;
  contribution: number;
}

/**
 * List of top-tier educational institutions
 */
const TOP_TIER_COLLEGES = [
  'IIT', 'IIM', 'BITS', 'NIT', 'IIIT', 'ISB', 'XLRI', 'FMS', 'SRCC', 'St. Stephen'
];

/**
 * Checks if a college name is from a top-tier institution
 */
function isTopTierCollege(college: string): boolean {
  return TOP_TIER_COLLEGES.some(tier => college.toUpperCase().includes(tier));
}

/**
 * Calculates education compatibility score (0-1)
 * Both top-tier = 1.0, one top-tier = 0.7, both good = 0.5, else 0.3
 */
function scoreEducation(client: Client, candidate: Client): number {
  const clientTopTier = isTopTierCollege(client.undergradCollege);
  const candidateTopTier = isTopTierCollege(candidate.undergradCollege);

  if (clientTopTier && candidateTopTier) return 1.0;
  if (clientTopTier || candidateTopTier) return 0.7;
  return 0.5;
}

/**
 * Calculates income compatibility score (0-1)
 * For traditional preferences: male earns more, female earns less
 * Within 20% = 1.0, within 50% = 0.7, within 100% = 0.4, else 0.2
 */
function scoreIncome(client: Client, candidate: Client): number {
  const clientIncome = client.income || 0;
  const candidateIncome = candidate.income || 0;

  if (clientIncome === 0 || candidateIncome === 0) return 0.5;

  const ratio = Math.abs(clientIncome - candidateIncome) / Math.max(clientIncome, candidateIncome);

  // Traditional scoring: for male clients, prefer female with lower income
  if (client.gender === 'MALE' && candidate.gender === 'FEMALE') {
    if (candidateIncome <= clientIncome * 0.8) return 1.0;
    if (candidateIncome <= clientIncome * 1.2) return 0.7;
  }

  // For female clients, prefer male with higher or equal income
  if (client.gender === 'FEMALE' && candidate.gender === 'MALE') {
    if (candidateIncome >= clientIncome * 0.8) return 1.0;
    if (candidateIncome >= clientIncome * 0.5) return 0.7;
  }

  // General compatibility based on income difference
  if (ratio <= 0.2) return 1.0;
  if (ratio <= 0.5) return 0.7;
  if (ratio <= 1.0) return 0.4;
  return 0.2;
}

/**
 * Calculates location compatibility score (0-1)
 * Same city = 1.0, both open to relocate = 0.8, one open = 0.5, else 0.1
 */
function scoreLocation(client: Client, candidate: Client): number {
  if (client.city.toLowerCase() === candidate.city.toLowerCase()) return 1.0;
  
  const clientRelocate = String(client.openToRelocate) === 'YES';
  const candidateRelocate = String(candidate.openToRelocate) === 'YES';

  if (clientRelocate && candidateRelocate) return 0.8;
  if (clientRelocate || candidateRelocate) return 0.5;
  return 0.1;
}

/**
 * Calculates family values compatibility score (0-1)
 * Same family type = 1.0, different = 0.4, +0.1 bonus for same sibling count
 */
function scoreFamilyValues(client: Client, candidate: Client): number {
  let score = client.familyType === candidate.familyType ? 1.0 : 0.4;

  // Bonus for similar sibling count
  if (client.siblings === candidate.siblings) {
    score = Math.min(1.0, score + 0.1);
  }

  return score;
}

/**
 * Calculates lifestyle compatibility score (0-1)
 * Compare dietary, drinking, smoking. Each match = 0.33
 */
function scoreLifestyle(client: Client, candidate: Client): number {
  let matches = 0;

  if (client.dietaryPreference === candidate.dietaryPreference) matches++;
  if (client.drinking === candidate.drinking) matches++;
  if (client.smoking === candidate.smoking) matches++;

  return matches / 3;
}

/**
 * Calculates age compatibility score (0-1)
 * 0-2 years = 1.0, 2-4 = 0.8, 4-6 = 0.6, 6-8 = 0.4
 */
function scoreAge(client: Client, candidate: Client): number {
  const clientAge = new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear();
  const candidateAge = new Date().getFullYear() - new Date(candidate.dateOfBirth).getFullYear();
  
  const ageDiff = Math.abs(clientAge - candidateAge);

  if (ageDiff <= 2) return 1.0;
  if (ageDiff <= 4) return 0.8;
  if (ageDiff <= 6) return 0.6;
  if (ageDiff <= 8) return 0.4;
  return 0.2;
}

/**
 * Calculates height compatibility score (0-1)
 * For males: taller than female = 1.0, same = 0.7, shorter = 0.3
 * For females: male taller = 1.0, same = 0.7, female taller = 0.3
 */
function scoreHeight(client: Client, candidate: Client): number {
  const heightDiff = client.height - candidate.height;

  if (client.gender === 'MALE' && candidate.gender === 'FEMALE') {
    if (heightDiff > 5) return 1.0;
    if (Math.abs(heightDiff) <= 5) return 0.7;
    return 0.3;
  }

  if (client.gender === 'FEMALE' && candidate.gender === 'MALE') {
    if (heightDiff < -5) return 1.0;
    if (Math.abs(heightDiff) <= 5) return 0.7;
    return 0.3;
  }

  return 0.5;
}

/**
 * Calculates religion and caste compatibility score (0-1)
 * Same religion = 0.6 base, same caste = +0.4
 */
function scoreReligionCaste(client: Client, candidate: Client): number {
  if (client.religion !== candidate.religion) return 0.2;
  
  let score = 0.6;
  if (client.caste === candidate.caste) score += 0.4;
  
  return score;
}

/**
 * Assigns a label based on total score
 * 85-100 → DREAM, 70-84 → HIGH, 50-69 → COMPATIBLE, 0-49 → LOW
 */
function assignLabel(score: number): AILabel {
  if (score >= 85) return 'DREAM';
  if (score >= 70) return 'HIGH';
  if (score >= 50) return 'COMPATIBLE';
  return 'LOW';
}

/**
 * Applies hard filters to eliminate dealbreaker candidates
 * Returns true if candidate should be EXCLUDED
 */
export function shouldExcludeCandidate(
  client: Client,
  candidate: Client,
  existingMatchIds: string[]
): boolean {
  // 1. Same gender
  if (client.gender === candidate.gender) return true;

  // 2. Already matched
  if (existingMatchIds.includes(candidate.id)) return true;

  // 3. Religion mismatch for horoscope-required clients
  if (client.horoscopeRequired && client.religion !== candidate.religion) return true;

  // 4. Kids preference clash - convert to string for comparison
  const clientWantsKids = String(client.wantKids);
  const candidateWantsKids = String(candidate.wantKids);
  
  if (clientWantsKids === 'YES' && candidateWantsKids === 'NO') return true;
  if (clientWantsKids === 'NO' && candidateWantsKids === 'YES') return true;

  // 5. Age range filters
  const clientAge = new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear();
  const candidateAge = new Date().getFullYear() - new Date(candidate.dateOfBirth).getFullYear();

  if (client.gender === 'MALE') {
    if (candidateAge < clientAge - 8 || candidateAge > clientAge + 2) return true;
  } else {
    if (candidateAge < clientAge - 2 || candidateAge > clientAge + 8) return true;
  }

  // 6. Marital status filter
  if (client.maritalStatus === 'NEVER_MARRIED' && candidate.maritalStatus !== 'NEVER_MARRIED') {
    return true;
  }

  return false;
}

/**
 * Scores a single candidate against the client
 * Returns a ScoredCandidate with total score, label, and dimension breakdown
 */
export function scoreCandidate(client: Client, candidate: Client): ScoredCandidate {
  const dimensions: DimensionScore[] = [
    { name: 'Education', weight: 0.20, score: scoreEducation(client, candidate), contribution: 0 },
    { name: 'Income', weight: 0.15, score: scoreIncome(client, candidate), contribution: 0 },
    { name: 'Location', weight: 0.15, score: scoreLocation(client, candidate), contribution: 0 },
    { name: 'Family', weight: 0.15, score: scoreFamilyValues(client, candidate), contribution: 0 },
    { name: 'Lifestyle', weight: 0.10, score: scoreLifestyle(client, candidate), contribution: 0 },
    { name: 'Age', weight: 0.10, score: scoreAge(client, candidate), contribution: 0 },
    { name: 'Height', weight: 0.08, score: scoreHeight(client, candidate), contribution: 0 },
    { name: 'Religion', weight: 0.07, score: scoreReligionCaste(client, candidate), contribution: 0 },
  ];

  // Calculate contributions and total score
  let totalScore = 0;
  dimensions.forEach(dim => {
    dim.contribution = parseFloat((dim.weight * dim.score * 100).toFixed(2));
    totalScore += dim.contribution;
  });

  totalScore = parseFloat(totalScore.toFixed(1));
  const label = assignLabel(totalScore);

  return {
    client: candidate,
    totalScore,
    label,
    dimensionScores: dimensions,
  };
}

/**
 * Main matching engine function
 * Filters candidates by hard filters, scores remaining pool, returns top 20
 * 
 * @param client - The client to find matches for
 * @param pool - All potential candidates (should be opposite gender)
 * @param existingMatchIds - IDs of candidates already matched with this client
 * @returns Array of top 20 scored candidates, sorted by score descending
 */
export function runMatchingEngine(
  client: Client,
  pool: Client[],
  existingMatchIds: string[] = []
): ScoredCandidate[] {
  // Apply hard filters
  const filteredPool = pool.filter(
    candidate => !shouldExcludeCandidate(client, candidate, existingMatchIds)
  );

  // Score all candidates
  const scored = filteredPool.map(candidate => scoreCandidate(client, candidate));

  // Sort by score descending and take top 20
  return scored
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 20);
}
