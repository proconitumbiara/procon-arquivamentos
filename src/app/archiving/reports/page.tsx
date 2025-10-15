
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import GenerateBoxFinalReportPDF from "./_components/generate-box-final-report-pdf";
import GenerateBoxPDF from "./_components/generate-box-pdf";


const Home = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/");
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Relatório de processos</PageTitle>
                    <PageDescription>Gere relatórios de processos arquivados.</PageDescription>
                </PageHeaderContent>
            </PageHeader>
            <PageContent>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col justify-center items-center gap-8">
                        <GenerateBoxPDF />
                        <GenerateBoxFinalReportPDF />
                    </div>
                </div>


            </PageContent>
        </PageContainer>
    );
}

export default Home;