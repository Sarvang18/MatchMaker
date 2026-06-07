'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ClientList } from '@/components/dashboard/client-list';
import { KanbanBoard } from '@/components/dashboard/kanban-board';
import { AddClientSheet } from '@/components/client/AddClientSheet';
import type { ClientSummary, ClientStatus } from '@/types';

interface DashboardClientProps {
  clients: Array<Omit<ClientSummary, 'dateOfBirth'> & { dateOfBirth: string }>;
  stats: {
    totalClients: number;
    activeClients: number;
    matchesSent: number;
    closedWon: number;
  };
}

export function DashboardClient({ clients: initialClients, stats }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'kanban'>('list');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clients, setClients] = useState(
    initialClients.map((c) => ({
      ...c,
      dateOfBirth: new Date(c.dateOfBirth),
    }))
  );

  const handleClientUpdate = (clientId: string, newStatus: ClientStatus) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === clientId ? { ...client, status: newStatus } : client
      )
    );
  };

  const handleClientAdded = async () => {
    // Fetch the updated client list from the server
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const clients = await response.json();
        setClients(
          clients.map((c: any) => ({
            ...c,
            dateOfBirth: new Date(c.dateOfBirth),
          }))
        );
      }
    } catch (error) {
      console.error('Failed to refresh clients:', error);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your client relationships
          </p>
        </div>
        <Button 
          onClick={() => setIsAddClientOpen(true)}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <StatsCards
          totalClients={stats.totalClients}
          activeClients={stats.activeClients}
          matchesSent={stats.matchesSent}
          closedWon={stats.closedWon}
        />
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'list'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'kanban'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Kanban
            </button>
          </div>
        </div>

        {activeTab === 'list' && <ClientList clients={clients} />}
        {activeTab === 'kanban' && (
          <KanbanBoard clients={clients} onClientUpdate={handleClientUpdate} />
        )}
      </div>

      {/* Add Client Sheet */}
      <AddClientSheet 
        open={isAddClientOpen} 
        onOpenChange={setIsAddClientOpen}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
