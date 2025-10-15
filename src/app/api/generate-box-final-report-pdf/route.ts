import jsPDF from "jspdf";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await import("next/headers").then(m => m.headers()),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Buscar todas as caixas com seus processos
        const allProcesses = await db.query.archivedProcessesTable.findMany({
            columns: {
                caseNumber: true,
                consumerName: true,
                supplierName: true,
                numberOfPages: true,
                filingDate: true,
                processFolderNumber: true,
            },
            orderBy: (archivedProcessesTable, { asc }) => [
                asc(archivedProcessesTable.processFolderNumber),
                asc(archivedProcessesTable.caseNumber)
            ],
        });

        if (allProcesses.length === 0) {
            return NextResponse.json({ error: "Nenhum processo encontrado" }, { status: 404 });
        }

        // Agrupar processos por caixa
        const processesByBox = allProcesses.reduce((acc, process) => {
            const boxNumber = process.processFolderNumber;
            if (!acc[boxNumber]) {
                acc[boxNumber] = [];
            }
            acc[boxNumber].push(process);
            return acc;
        }, {} as Record<string, typeof allProcesses>);

        const boxNumbers = Object.keys(processesByBox).sort((a, b) => parseInt(a) - parseInt(b));

        // Criar PDF
        const pdf = new jsPDF();

        // Configurações do PDF
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin + 20;

        // Nome procon
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("Procon Itumbiara", pageWidth / 2, yPosition, { align: "center" });
        yPosition += 15;

        // Título principal
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("Relatório Final - Arquivamentos", pageWidth / 2, yPosition, { align: "center" });
        yPosition += 20;

        // Configurações da tabela
        const tableWidth = pageWidth - 2 * margin;
        const colWidths = [30, 50, 50, 20, 40]; // Larguras das colunas
        const rowHeight = 8;
        const headerHeight = 10;

        // Cabeçalho da tabela
        const headers = ["Nº Processo", "Consumidor", "Fornecedor", "Págs", "Data Arq."];

        // Função para desenhar cabeçalho da tabela
        const drawTableHeader = (startY: number) => {
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");

            // Desenhar cabeçalho
            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, startY, tableWidth, headerHeight, "F");

            let xPosition = margin;
            headers.forEach((header, index) => {
                pdf.text(header, xPosition + 2, startY + 7);
                xPosition += colWidths[index];
            });

            // Linha separadora
            pdf.setDrawColor(0, 0, 0);
            pdf.line(margin, startY + headerHeight, pageWidth - margin, startY + headerHeight);
        };

        // Função para desenhar uma linha da tabela
        const drawTableRow = (process: typeof allProcesses[0], startY: number) => {
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);

            // Formatar data
            const filingDate = new Date(process.filingDate);
            const formattedDate = filingDate.toLocaleDateString('pt-BR');

            // Dados da linha
            const rowData = [
                `${process.caseNumber}`,
                process.consumerName.length > 30 ? process.consumerName.substring(0, 30) + "..." : process.consumerName,
                process.supplierName.length > 20 ? process.supplierName.substring(0, 20) + "..." : process.supplierName,
                process.numberOfPages.toString(),
                formattedDate
            ];

            let xPosition = margin;
            rowData.forEach((data, colIndex) => {
                pdf.text(data, xPosition + 2, startY + 6);
                xPosition += colWidths[colIndex];
            });

            // Linha separadora entre linhas
            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, startY + rowHeight, pageWidth - margin, startY + rowHeight);
        };

        // Iterar por cada caixa
        boxNumbers.forEach((boxNumber, boxIndex) => {
            const processes = processesByBox[boxNumber];

            // Título da caixa
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text(`Caixa ${boxNumber}`, pageWidth / 2, yPosition, { align: "center" });
            yPosition += 15;

            // Verificar se precisa de nova página para o cabeçalho da tabela
            if (yPosition + headerHeight + 20 > pageHeight - margin - 20) {
                pdf.addPage();
                yPosition = margin + 20;
            }

            // Desenhar cabeçalho da tabela
            drawTableHeader(yPosition);
            yPosition += headerHeight;

            // Desenhar dados da tabela
            processes.forEach((process) => {
                // Verificar se precisa de nova página
                if (yPosition + rowHeight > pageHeight - margin - 20) {
                    pdf.addPage();
                    yPosition = margin + 20;

                    // Redesenhar cabeçalho na nova página
                    drawTableHeader(yPosition);
                    yPosition += headerHeight;
                }

                drawTableRow(process, yPosition);
                yPosition += rowHeight;
            });

            // Espaço entre caixas (exceto na última caixa)
            if (boxIndex < boxNumbers.length - 1) {
                yPosition += 20;

                // Verificar se precisa de nova página para o próximo título
                if (yPosition + 40 > pageHeight - margin - 20) {
                    pdf.addPage();
                    yPosition = margin + 20;
                }
            }
        });

        // Adicionar seção de assinatura
        yPosition += 20; // Espaço após a tabela

        // Verificar se há espaço suficiente para a assinatura
        if (yPosition + 40 > pageHeight - margin - 20) {
            pdf.addPage();
            yPosition = margin + 20;
        }

        // Linha de assinatura
        const signatureY = yPosition + 20;
        pdf.setDrawColor(0, 0, 0);
        pdf.line(margin + 50, signatureY, pageWidth - margin - 50, signatureY);

        // Nome do responsável
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("MARCOS AURELIO DA SILVA FILHO", pageWidth / 2, signatureY + 10, { align: "center" });

        // Data formatada
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        const month = months[today.getMonth()];
        const year = today.getFullYear();
        const formattedDate = `Itumbiara, ${day} de ${month} de ${year}`;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(formattedDate, pageWidth / 2, signatureY + 20, { align: "center" });

        // Rodapé
        const totalPages = pdf.getNumberOfPages();
        const totalProcesses = allProcesses.length;
        const totalBoxes = boxNumbers.length;

        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "normal");
            pdf.text(
                `Relatório Final Procon Itumbiara - ${totalBoxes} caixas - Total de processos: ${totalProcesses}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: "center" }
            );
        }

        // Gerar buffer do PDF
        const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

        // Retornar PDF como download
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="relatorio-final-todas-caixas.pdf"`,
                "Content-Length": pdfBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
