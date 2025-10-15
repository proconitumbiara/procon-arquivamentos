import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import AddArchivingForm from "./_components/add-archiving-form";



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
                    <PageTitle>Arquivamento de processos</PageTitle>
                    <PageDescription>Registre processos para serem arquivados.</PageDescription>
                </PageHeaderContent>
            </PageHeader>
            <PageContent>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row justify-between">
                        <AddArchivingForm />
                    </div>
                </div>
            </PageContent>
        </PageContainer>
    );
}

export default Home;