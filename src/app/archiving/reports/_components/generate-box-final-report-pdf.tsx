"use client";

import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GenerateBoxPDF() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGeneratePDF = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/generate-box-final-report-pdf");

            if (response.ok) {
                // Criar blob e fazer download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "relatorio-final-todas-caixas.pdf";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                toast.success("Relatório final gerado com sucesso!");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Erro ao gerar relatório final");
            }
        } catch (error) {
            console.error("Erro ao gerar relatório final:", error);
            toast.error("Erro ao gerar relatório final");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Gerar Relatório Final Completo
                </CardTitle>
                <CardDescription>
                    Gera um relatório final com todas as caixas e seus respectivos processos
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                        <strong>Relatório completo:</strong> Este relatório incluirá todas as caixas cadastradas no sistema,
                        cada uma com sua própria tabela de processos.
                    </p>
                </div>

                <Button
                    onClick={handleGeneratePDF}
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Gerando Relatório...
                        </>
                    ) : (
                        <>
                            <Download className="h-4 w-4 mr-2" />
                            Gerar e Baixar Relatório Final Completo
                        </>
                    )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                    O relatório final conterá uma tabela completa para cada caixa, organizadas sequencialmente
                </p>
            </CardContent>
        </Card>
    );
}
