"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { checkArquiving } from "@/actions/filing-conference";
import { CustomPagination } from "@/components/custom-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArchivedProcess } from "@/types/archived-process";

import UpdateArchivingForm from "./update-archiving-form";

interface ArchivedProcessSearchProps {
    filings: ArchivedProcess[];
}

export default function ArchivedProcessSearch({ filings }: ArchivedProcessSearchProps) {
    const [processNumberQuery, setProcessNumberQuery] = useState("");
    const [nameQuery, setNameQuery] = useState("");
    const [folderQuery, setFolderQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredResults, setFilteredResults] = useState<ArchivedProcess[]>([]);
    const [loadingProcesses, setLoadingProcesses] = useState<Set<string>>(new Set());
    const resultsPerPage = 25;

    // Ordena e seta os resultados iniciais
    useEffect(() => {
        const sorted = [...filings].sort(
            (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        );
        setFilteredResults(sorted);
    }, [filings]);

    // Filtra localmente
    useEffect(() => {
        let filtered = [...filings];

        // Filtro por número de processo
        if (processNumberQuery) {
            const lowerProcessQuery = processNumberQuery.toLowerCase();
            filtered = filtered.filter(proc =>
                proc.caseNumber.toLowerCase().includes(lowerProcessQuery)
            );
        }

        // Filtro por nome (consumidor ou fornecedor)
        if (nameQuery) {
            const lowerNameQuery = nameQuery.toLowerCase();
            filtered = filtered.filter(proc =>
                proc.consumerName.toLowerCase().includes(lowerNameQuery) ||
                proc.supplierName.toLowerCase().includes(lowerNameQuery)
            );
        }

        // Filtro por pasta/caixa
        if (folderQuery) {
            const lowerFolderQuery = folderQuery.toLowerCase();
            filtered = filtered.filter(proc =>
                proc.processFolderNumber.toLowerCase().includes(lowerFolderQuery)
            );
        }

        // Filtro por status
        if (statusFilter !== "all") {
            filtered = filtered.filter(proc => proc.status === statusFilter);
        }

        // Ordena por data de criação (mais recente primeiro)
        const sorted = filtered.sort(
            (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        );

        setFilteredResults(sorted);
        setCurrentPage(1); // Resetar para primeira página ao filtrar
    }, [processNumberQuery, nameQuery, folderQuery, statusFilter, filings]);

    const handleReset = () => {
        setProcessNumberQuery("");
        setNameQuery("");
        setFolderQuery("");
        setStatusFilter("all");
    };

    const handleMarkAsChecked = async (processId: string) => {
        setLoadingProcesses(prev => new Set(prev).add(processId));

        try {
            const result = await checkArquiving({ id: processId });

            if (result?.serverError) {
                toast.error(result.serverError);
            } else if (result?.validationErrors) {
                toast.error("Erro de validação");
            } else {
                toast.success("Processo marcado como conferido!");
                // Atualizar o estado local para refletir a mudança
                setFilteredResults(prev =>
                    prev.map(proc =>
                        proc.id === processId
                            ? { ...proc, status: "filed_and_checked" as const }
                            : proc
                    )
                );
            }
        } catch {
            toast.error("Erro ao marcar processo como conferido");
        } finally {
            setLoadingProcesses(prev => {
                const newSet = new Set(prev);
                newSet.delete(processId);
                return newSet;
            });
        }
    };

    const formatDate = (date?: Date | string | null) => {
        if (!date) return "-";

        // Usar a mesma lógica do update-archiving-form
        const dateObj = typeof date === "string" ? new Date(date) : date;
        const isoString = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
        const [year, month, day] = isoString.split("-");
        return `${day}/${month}/${year}`;
    };

    const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

    // Seleciona os resultados da página atual
    const paginatedResults = filteredResults.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    return (
        <div className="flex-1 h-full pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Número do Processo</label>
                    <Input
                        placeholder="Digite o número do processo"
                        value={processNumberQuery}
                        onChange={(e) => setProcessNumberQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Nome (Consumidor/Fornecedor)</label>
                    <Input
                        placeholder="Digite o nome"
                        value={nameQuery}
                        onChange={(e) => setNameQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Caixa</label>
                    <Input
                        placeholder="Digite o número da caixa"
                        value={folderQuery}
                        onChange={(e) => setFolderQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="archived">Arquivado</SelectItem>
                            <SelectItem value="filed_and_checked"> Arquivado e Conferido</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <Button onClick={handleReset} variant="outline">
                    Resetar filtros
                </Button>
            </div>

            {/* Contador de resultados */}
            <p className="mb-4 text-muted-foreground">
                Total de arquivamentos: {filteredResults.length}
            </p>

            {paginatedResults.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        {paginatedResults.map((proc) => (
                            <Card key={proc.id} className="bg-background relative">
                                <CardHeader>
                                    <CardTitle>Processo: {proc.caseNumber}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <div className="flex flex-col text-muted-foreground">
                                        <p className="font-semibold text-foreground">Consumidor</p>
                                        {proc.consumerName}
                                    </div>
                                    <div className="flex flex-col text-muted-foreground">
                                        <p className="font-semibold text-foreground">Fornecedor</p>
                                        {proc.supplierName}
                                    </div>
                                    <div className="flex flex-col absolute top-3 right-3">
                                        {proc.status === "archived" ? <Badge variant="default" className="bg-primary text-white">Arquivado</Badge> : <Badge variant="outline" className="bg-green-500 text-white">Conferido</Badge>}
                                    </div>

                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="mt-2"
                                        disabled={proc.status === "filed_and_checked" || loadingProcesses.has(proc.id)}
                                        onClick={() => handleMarkAsChecked(proc.id)}
                                    >
                                        {loadingProcesses.has(proc.id) ? "Conferindo..." : "Marcar como conferido"}
                                    </Button>
                                    {/* Botão de detalhes */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="mt-2">
                                                Ver detalhes
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[600px]">
                                            <DialogHeader>
                                                <DialogTitle>Detalhes do arquivamento</DialogTitle>
                                            </DialogHeader>

                                            <div className="flex flex-col gap-2 text-muted-foreground">
                                                <p><span className="font-semibold text-foreground">Número do processo:</span> {proc.caseNumber}</p>
                                                <p><span className="font-semibold text-foreground">Consumidor:</span> {proc.consumerName}</p>
                                                <p><span className="font-semibold text-foreground">Fornecedor:</span> {proc.supplierName}</p>
                                                <p><span className="font-semibold text-foreground">Pasta:</span> {proc.processFolderNumber}</p>
                                                <p><span className="font-semibold text-foreground">Páginas:</span> {proc.numberOfPages}</p>
                                                <p><span className="font-semibold text-foreground">Data de arquivamento:</span> {formatDate(proc.filingDate)}</p>
                                                <p><span className="font-semibold text-foreground">Última atualização:</span> {formatDate(proc.updatedAt)}</p>
                                            </div>

                                            {/* Botão de edição dentro do dialog */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="mt-4">
                                                        Editar
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[600px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Editar arquivamento {proc.caseNumber}</DialogTitle>
                                                    </DialogHeader>
                                                    <UpdateArchivingForm
                                                        process={proc}
                                                        onSuccess={() => toast.success("Arquivamento atualizado!")}
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <CustomPagination
                            total={totalPages}
                            currentPage={currentPage}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    )}
                </>
            ) : (
                <p className="text-muted-foreground mt-4">Nenhum arquivamento encontrado.</p>
            )}
        </div>
    );
}
