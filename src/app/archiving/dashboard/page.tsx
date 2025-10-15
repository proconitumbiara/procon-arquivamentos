import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/ui/access-denied";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import getDashboard from "@/data/get-dashboard";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import ReportGenerator from "./_components/report-generator";
import StatsCards from "./_components/stats-cards";
import TopProfessionals from "./_components/top-professionals";

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/");
  }

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, session.user.id),
  });

  if (user?.role !== "administrator") {
    return <AccessDenied />;
  }

  const dashboard = await getDashboard();

  // Filtrar usuários com id e name válidos para arquivamentos
  const users = dashboard.topUsers
    .filter((u) => !!u.userId && !!u.name)
    .map((u) => ({
      id: u.userId as string,
      name: u.name as string,
      avatarImageUrl: null, // Adapte se tiver url
      specialty: "", // Adapte se tiver especialidade
      appointments: u.total,
    }));

  // Filtrar usuários com id e name válidos para conferências
  const conferenceUsers = dashboard.topConferenceUsers
    .filter((u) => !!u.userId && !!u.name)
    .map((u) => ({
      id: u.userId as string,
      name: u.name as string,
      avatarImageUrl: null, // Adapte se tiver url
      specialty: "", // Adapte se tiver especialidade
      appointments: u.total,
    }));

  return (
    <PageContainer className="flex min-h-screen flex-col">
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Relatórios e informações sobre a operação.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <ReportGenerator />
        </PageActions>
      </PageHeader>
      <PageContent className="flex flex-1 flex-col gap-6">
        <StatsCards
          totalAppointments={dashboard.totalArchivings}
          totalClients={dashboard.totalActiveUsers}
          totalConferenceActions={dashboard.totalConferenceActions}
          averageTreatmentDuration={dashboard.averageArchivingsPerUser}
        />
        <ReportGenerator />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopProfessionals
            professionals={users}
            title="Ranking de arquivamentos"
            description="Usuários com mais arquivamentos"
            emptyMessage="Nenhum arquivamento realizado."
            unitLabel="arquiv."
          />
          <TopProfessionals
            professionals={conferenceUsers}
            title="Ranking de conferências"
            description="Usuários com mais conferências"
            emptyMessage="Nenhuma conferência realizada."
            unitLabel="confer."
          />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default Home;
