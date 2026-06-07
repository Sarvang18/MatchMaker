'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ClientSummary, ClientStatus, Gender } from '@/types';
import {
  calculateAge,
  getInitials,
  getInitialsColor,
  getStatusColor,
  getStatusLabel,
} from '@/lib/client-utils';

interface ClientListProps {
  clients: ClientSummary[];
}

export function ClientList({ clients }: ClientListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<Gender | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        searchQuery === '' ||
        client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.religion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGender = genderFilter === 'ALL' || client.gender === genderFilter;
      const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [clients, searchQuery, genderFilter, statusFilter]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const handleRowClick = (clientId: string) => {
    router.push(`/client/${clientId}`);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, city, or religion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value as Gender | 'ALL')}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ALL">Gender: All</option>
          <option value="MALE">Gender: Male</option>
          <option value="FEMALE">Gender: Female</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'ALL')}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ALL">Status: All</option>
          <option value="ONBOARDED">Status: Onboarded</option>
          <option value="ACTIVE">Status: Active</option>
          <option value="MATCH_SENT">Status: Match Sent</option>
          <option value="MUTUAL_INTEREST">Status: Mutual Interest</option>
          <option value="MEETING_SCHEDULED">Status: Meeting Scheduled</option>
          <option value="CLOSED_WON">Status: Closed Won</option>
          <option value="CLOSED_LOST">Status: Closed Lost</option>
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Client</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Religion</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              paginatedClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => handleRowClick(client.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className={`${getInitialsColor(client.firstName)} text-white`}>
                        <AvatarFallback className="bg-transparent">
                          {getInitials(client.firstName, client.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {client.firstName} {client.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {calculateAge(new Date(client.dateOfBirth))}
                  </TableCell>
                  <TableCell className="text-gray-600">{client.city}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        client.gender === 'MALE'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-pink-50 text-pink-700 border-pink-300'
                      }
                    >
                      {client.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{client.religion}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(client.status)}>
                      {getStatusLabel(client.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(client.id);
                      }}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClients.length)} of{' '}
            {filteredClients.length} clients
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
