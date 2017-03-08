/** Employee Model definition */
export interface Employee {
    id: number;
    employee: string;
    approverUser: string;
    startDate: string;
    endDate: string;
    billableHours: number;
    nonBillableHours: number;
    status: string;
    pendingApprover: string;
}
