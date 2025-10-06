export interface ArchivedProcess {
    id: string;
    caseNumber: string;
    consumerName: string;
    supplierName: string;
    processFolderNumber: string;
    numberOfPages: number;
<<<<<<< HEAD
    filingDate: string; // Formato YYYY-MM-DD
    status: "archived" | "filed_and_checked";
=======
    filingDate?: Date | null;
>>>>>>> 6dc8cf2 (first commit)
    createdAt?: Date | null;
    updatedAt?: Date | null;
}