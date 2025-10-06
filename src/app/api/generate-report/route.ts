import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import jsPDF from "jspdf";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { logsTable, usersTable } from "@/db/schema";

export async function POST(request: NextRequest) {
    try {
        const { date, action } = await request.json();

        if (!date || !action) {
            return NextResponse.json(
                { error: "Data e ação são obrigatórias" },
                { status: 400 }
            );
        }

        // Converter data para início e fim do dia
        const selectedDate = new Date(date);
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Buscar dados baseados na ação e data
        const results = await db
            .select({
                userId: logsTable.userId,
                name: usersTable.name,
                total: count(logsTable.id).as("total"),
            })
            .from(logsTable)
            .leftJoin(usersTable, eq(logsTable.userId, usersTable.id))
            .where(
                and(
                    eq(logsTable.action, action),
                    gte(logsTable.createdAt, startOfDay),
                    lte(logsTable.createdAt, endOfDay)
                )
            )
            .groupBy(logsTable.userId, usersTable.name)
            .orderBy(desc(sql<number>`count(*)`));

        // Gerar PDF
        const pdf = new jsPDF();

        // Título
        pdf.setFontSize(20);
        pdf.text(
            `Relatório de ${action === "create" ? "Arquivamentos" : "Conferências"}`,
            20,
            30
        );

        // Data
        pdf.setFontSize(12);
        pdf.text(`Data: ${selectedDate.toLocaleDateString("pt-BR")}`, 20, 45);

        // Cabeçalho da tabela
        pdf.setFontSize(10);
        pdf.text("Posição", 20, 60);
        pdf.text("Usuário", 40, 60);
        pdf.text("Quantidade", 120, 60);

        // Linha separadora
        pdf.line(20, 65, 190, 65);

        // Dados
        let yPosition = 75;
        results.forEach((result, index) => {
            if (yPosition > 270) {
                pdf.addPage();
                yPosition = 30;
            }

            pdf.text(`${index + 1}`, 20, yPosition);
            pdf.text(result.name || "Usuário não encontrado", 40, yPosition);
            pdf.text(result.total.toString(), 120, yPosition);
            yPosition += 10;
        });

        // Se não houver dados
        if (results.length === 0) {
            pdf.text("Nenhum registro encontrado para a data selecionada", 20, 75);
        }

        // Rodapé
        pdf.setFontSize(8);
        pdf.text(
            `Relatório gerado em: ${new Date().toLocaleString("pt-BR")}`,
            20,
            290
        );

        const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="relatorio-${action}-${date}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
