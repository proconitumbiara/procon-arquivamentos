import { count, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import {
    archivedProcessesTable,
    logsTable,
    usersTable,
} from "@/db/schema";

const getDashboard = async () => {
    // Top usuários por arquivamentos realizados (baseado em logs)
    const topUsers = await db
        .select({
            userId: logsTable.userId,
            name: usersTable.name,
            total: count(logsTable.id).as("total"),
        })
        .from(logsTable)
        .leftJoin(usersTable, eq(logsTable.userId, usersTable.id))
        .where(eq(logsTable.action, "create"))
        .groupBy(logsTable.userId, usersTable.name)
        .orderBy(desc(sql<number>`count(*)`));

    // Top usuários por conferências realizadas (baseado em logs)
    const topConferenceUsers = await db
        .select({
            userId: logsTable.userId,
            name: usersTable.name,
            total: count(logsTable.id).as("total"),
        })
        .from(logsTable)
        .leftJoin(usersTable, eq(logsTable.userId, usersTable.id))
        .where(eq(logsTable.action, "conference"))
        .groupBy(logsTable.userId, usersTable.name)
        .orderBy(desc(sql<number>`count(*)`));

    // Total de arquivamentos realizados (todos os processos)
    const totalArchivings = await db
        .select({
            total: count(archivedProcessesTable.id),
        })
        .from(archivedProcessesTable)
        .then((res) => res[0]?.total || 0);

    // Total de conferências realizadas (processos com status filed_and_checked)
    const totalConferenceActions = await db
        .select({
            total: count(archivedProcessesTable.id),
        })
        .from(archivedProcessesTable)
        .where(eq(archivedProcessesTable.status, "filed_and_checked"))
        .then((res) => res[0]?.total || 0);

    // Total de usuários ativos (que fizeram pelo menos um arquivamento)
    const totalActiveUsers = await db
        .select({
            total: count(sql`DISTINCT ${logsTable.userId}`),
        })
        .from(logsTable)
        .where(eq(logsTable.action, "create"))
        .then((res) => res[0]?.total || 0);

    // Média de arquivamentos por usuário ativo
    let averageArchivingsPerUser = 0;
    if (totalActiveUsers > 0) {
        averageArchivingsPerUser = Math.round(totalArchivings / totalActiveUsers);
    }

    return {
        topUsers,
        topConferenceUsers,
        totalArchivings,
        totalActiveUsers,
        totalConferenceActions,
        averageArchivingsPerUser,
    };
};

export default getDashboard;
