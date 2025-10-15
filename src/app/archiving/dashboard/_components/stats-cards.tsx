import { Activity, Archive, BarChart3, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalAppointments: number; // Total de arquivamentos
  totalClients: number; // Total de usuários ativos
  totalConferenceActions: number; // Total de outras ações
  averageTreatmentDuration: number; // Média de arquivamentos por usuário
}

const StatsCards = ({
  totalAppointments,
  totalClients,
  totalConferenceActions,
  averageTreatmentDuration,
}: StatsCardsProps) => {
  const stats = [
    {
      title: "Arquivamentos realizados",
      value: totalAppointments.toString(),
      icon: Archive,
    },
    {
      title: "Arquivamentos conferidos",
      value: totalConferenceActions.toString(),
      icon: Activity,
    },
    {
      title: "Média de arquivamentos por usuário",
      value: `${averageTreatmentDuration}`,
      icon: BarChart3,
    },
    {
      title: "Usuários ativos",
      value: totalClients.toString(),
      icon: Users,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="w-full">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0">
                <Icon className="text-primary h-4 w-4" />
              </div>
              <CardTitle className="text-muted-foreground text-xs font-medium leading-tight sm:text-sm">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold sm:text-2xl">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
