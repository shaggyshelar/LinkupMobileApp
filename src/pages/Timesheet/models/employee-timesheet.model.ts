export class EmployeeTimeSheet {
    PendingApprover: Array<User>;
    ApproverUser: Array<User>;
    SubmittedStatus: string = 'New Timesheet';
    BillableHours: string;
    NonBillableHours: string;
    StartDate: string;
    EndDate: string;
    TimesheetSubmittedDate: string;
    Employee: User;
    Title: string;
    EmployeeName: string;
    TimesheetStartDate: string;
    TimesheetEndDate: string;
    TotalhrsMonday: string;
    TotalhrsTuesday: string;
    TotalhrsWednesday: string;
    TotalhrsThursday: string;
    TotalhrsFriday: string;
    TotalhrsSaturday: string;
    TotalhrsSunday: string;
    TotalhrsTimesheet: string;
    WeekNumber: string;
    CalendarYear: string;
    EmployeeDepartment: string;
    EmailStatus: string;
    IsUserUpdated: string;
    UpdationFlag: string;
    ID: number;
    selected: boolean;
    selectionColor: string;
}
class User {
    Name: string;
    ID: number;
}
