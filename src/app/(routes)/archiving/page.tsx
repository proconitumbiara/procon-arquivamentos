
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container";
import { db } from "@/db";
import { auth } from "@/lib/auth";
<<<<<<< HEAD
import { ArchivedProcess } from "@/types/archived-process";

import GenerateBoxPDF from "./_components/generate-box-pdf";
=======

<<<<<<< HEAD
import AddArchivingForm from "./_components/add-archiving-form";
>>>>>>> 6dc8cf2 (first commit)
=======
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)
import ArchivedProcessSearch from "./_components/search-filings";


const Home = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/");
    }

    const filings = await db.query.archivedProcessesTable.findMany();

<<<<<<< HEAD
    // Cast dos dados para o tipo correto
    const typedFilings: ArchivedProcess[] = filings.map(filing => ({
        ...filing,
        status: filing.status as "archived" | "filed_and_checked"
    }));

=======
>>>>>>> 6dc8cf2 (first commit)
    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Arquivamento de processos</PageTitle>
<<<<<<< HEAD
                    <PageDescription>Registre e gerencie os processos arquivados.</PageDescription>
                </PageHeaderContent>
            </PageHeader>
            <PageContent>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row justify-between">
                        <ArchivedProcessSearch filings={typedFilings} />
                    </div>
                    <div className="flex flex-row justify-start">
                        <GenerateBoxPDF />
                    </div>
=======
                    <PageDescription>Registre e gerencia os processos arquivados.</PageDescription>
                </PageHeaderContent>
            </PageHeader>
            <PageContent>
                <div className="flex flex-row justify-between">
                    <ArchivedProcessSearch filings={filings} />
<<<<<<< HEAD
                    <AddArchivingForm />
>>>>>>> 6dc8cf2 (first commit)
=======
                    {/* <AddArchivingForm /> */}
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)
                </div>
            </PageContent>
        </PageContainer>
    );
}

export default Home;