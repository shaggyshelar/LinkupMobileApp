/** Timesheet Model Definition */
export interface Timesheet {
    ApproverUser: Array<User>;
    Project: Project;
    Task: string;
    Mondayhrs: string;
    Mondaydesc: string;
    Tuesdayhrs: string;
    Tuesdaydesc: string;
    Wednesdayhrs: string;
    Wednesdaydesc: string;
    Thursdayhrs: string;
    Thursdaydesc: string;
    Fridayhrs: string;
    Fridaydesc: string;
    Saturdayhrs: string;
    Saturdaydesc: string;
    Sundayhrs: string;
    Sundaydesc: string;
    Billable: string;
    TimesheetStartDate: string;
    TimesheetEndDate: string;
    TimesheetID: string;
    Mondaynbhrs: string;
    Tuesdaynbhrs: string;
    Wednesdaynbhrs: string;
    Thursdaynbhrs: string;
    Fridaynbhrs: string;
    Saturdaynbhrs: string;
    Sundaynbhrs: string;
    WeekNumber: string;
    ProjectTimesheetStatus: string;
    StartDate: string;
    EndDate: string;
    Mondaydescnb: string;
    Tuesdaydescnb: string;
    Wednesdaydescnb: string;
    Thursdaydescnb: string;
    Fridaydescnb: string;
    Saturdaydescnb: string;
    Sundaydescnb: string;
    ApproverComment: string;
    TimesheetStatus: string;
    UpdationFlag: string;
    ID: number;
}

class Project {
    Value: string;
    ID: number;
}

class User {
    Name: string;
    ID: number;
}
