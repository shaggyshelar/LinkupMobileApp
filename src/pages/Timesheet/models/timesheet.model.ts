/** Timesheet Model Definition */
export class Timesheet {
    constructor(
        ApproverUser: Array<User>,
        Project: Project,
        Task: string,
        Mondayhrs: string,
        Mondaydesc: string,
        Tuesdayhrs: string,
        Tuesdaydesc: string,
        Wednesdayhrs: string,
        Wednesdaydesc: string,
        Thursdayhrs: string,
        Thursdaydesc: string,
        Fridayhrs: string,
        Fridaydesc: string,
        Saturdayhrs: string,
        Saturdaydesc: string,
        Sundayhrs: string,
        Sundaydesc: string,
        Billable: string,
        TimesheetStartDate: string,
        TimesheetEndDate: string,
        TimesheetID: string,
        Mondaynbhrs: string,
        Tuesdaynbhrs: string,
        Wednesdaynbhrs: string,
        Thursdaynbhrs: string,
        Fridaynbhrs: string,
        Saturdaynbhrs: string,
        Sundaynbhrs: string,
        WeekNumber: string,
        ProjectTimesheetStatus: string,
        StartDate: string,
        EndDate: string,
        Mondaydescnb: string,
        Tuesdaydescnb: string,
        Wednesdaydescnb: string,
        Thursdaydescnb: string,
        Fridaydescnb: string,
        Saturdaydescnb: string,
        Sundaydescnb: string,
        ApproverComment: string,
        TimesheetStatus: string,
        UpdationFlag: string,
        ID: number
    ) {}
}

class Project {
    Value: string;
    ID: number;
}

class User {
    Value: string;
    ID: number;
}

export class emptyTimesheetModel {
    date:any;
    hours:string;
}
export class weekArray{
    constructor(){}
         MondayArray:Array<monday> = [];
         TuesdayArray:Array<tuesday> = [];
         WednesdayArray:Array<wednesday> = [];
         ThursdayArray:Array<thursday> = [];
         FridayArray:Array<friday> = [];
         SaturdayArray:Array<saturday> = [];
         SundayArray:Array<sunday> = [];
}

export class monday{
    constructor(
    ){}

      ApproverUser: User;
        Project: Project;
        Task: string;
        Mondayhrs: string;
        Mondaydesc: string;
        Mondaynbhrs: string;
        Mondaydescnb: string;
        ApproverComment: string;
        ProjectTimesheetStatus: string;
        Billable: string;
        TimesheetID: string;
        UpdationFlag: string;
        ID: number;
        TotalhrsMonday:string;
        date:any;

}
export class tuesday{
     constructor(
    ){}
     ApproverUser: User;
        Project: Project;
        Task: string;
        Tuesdayhrs: string;
        Tuesdaydesc: string;
        Tuesdaynbhrs: string;
        Tuesdaydescnb: string;
        ApproverComment: string;
        ProjectTimesheetStatus: string;
        Billable: string;
        TimesheetID: string;
        UpdationFlag: string;
        ID: number;
        TotalhrsTuesday:string;
        date:any;
}
export class wednesday{
     constructor()
    {}
      ApproverUser: User;
        Project: Project;
        Task: string;
        Wednesdayhrs: string;
        Wednesdaydesc: string;
        Wednesdaynbhrs: string;
        Wednesdaydescnb: string;
        ApproverComment: string;
        ProjectTimesheetStatus: string;
        Billable: string;
        TimesheetID: string;
        UpdationFlag: string;
        ID: number;
        TotalhrsWednesday:string;
        date:any;
}
export class thursday{
     constructor()
    {}
     ApproverUser: User;
        Project: Project;
        Task: string;
        Thursdayhrs: string;
        Thursdaydesc: string;
        Thursdaynbhrs: string;
        Thursdaydescnb: string;
        ApproverComment: string;
        ProjectTimesheetStatus: string;
        Billable: string;
        TimesheetID: string;
        UpdationFlag: string;
        ID: number;
        TotalhrsThursday:string;
        date:any;
    
}
export class friday{
    constructor()
    {}
      ApproverUser: User;
        Project: Project;
        Task: string;
        Fridayhrs: string;
        Fridaydesc: string;
        Fridaynbhrs: string;
        Fridaydescnb: string;
        ApproverComment: string;
        ProjectTimesheetStatus: string;
        Billable: string;
        TimesheetID: string;
        UpdationFlag: string;
        ID: number;
        TotalhrsFriday:string;
        date:any;
    
}
export class saturday{
     constructor()
    {}
    ApproverUser: User;
        Project: Project;
        Task: string;
        Saturdayhrs: string;
        Saturdaydesc: string;
        Saturdaynbhrs: string;
        Saturdaydescnb: string;
        ApproverComment: string;
        ProjectTimesheetStatus: string;
        Billable: string;
        TimesheetID: string;
        UpdationFlag: string;
        ID: number;
        TotalhrsSaturday:string;
        date:any;
    
}
export class sunday{
    constructor()
    {}
     ApproverUser: User;
        Project: Project;
        Task: string;
        Sundayhrs: string;
        Sundaydesc: string;
        Sundaynbhrs: string;
        Sundaydescnb: string;
        ApproverComment: string;
        ProjectTimesheetStatus: string;
        Billable: string;
        TimesheetID: string;
        UpdationFlag: string;
        ID: number;
        TotalhrsSunday:string;
        date:any;
    
}
