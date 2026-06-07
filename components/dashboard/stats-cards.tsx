import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, Send, Trophy } from 'lucide-react';

interface StatsCardsProps {
  totalClients: number;
  activeClients: number;
  matchesSent: number;
  closedWon: number;
}

export function StatsCards({
  totalClients,
  activeClients,
  matchesSent,
  closedWon,
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Clients',
      value: totalClients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active',
      value: activeClients,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Matches Sent',
      value: matchesSent,
      icon: Send,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Closed Won',
      value: closedWon,
      icon: Trophy,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-gray-200 hover:shadow-md transition-shadow duration-150">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
