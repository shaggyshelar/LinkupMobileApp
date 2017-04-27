/** Timesheet Model Definition */
export class Timesheet {
    constructor() {}
        ApproverUser: Array<User> = [{ ID: 0, Value: null }];
        PendingApprover: Array<User> = [{ ID: 0, Value: null }];
        Project: Project = { ID: 0, Value: null };
        Task: string = null;
        Mondayhrs: string = null;
        Mondaydesc: string = null;
        Tuesdayhrs: string = null;
        Tuesdaydesc: string = null;
        Wednesdayhrs: string = null;
        Wednesdaydesc: string = null;
        Thursdayhrs: string = null;
        Thursdaydesc: string = null;
        Fridayhrs: string = null;
        Fridaydesc: string = null;
        Saturdayhrs: string = null;
        Saturdaydesc: string = null;
        Sundayhrs: string = null;
        Sundaydesc: string = null;
        Billable: string = null;
        TimesheetStartDate: string = null;
        TimesheetEndDate: string = null;
        TimesheetID: string = null;
        Mondaynbhrs: string = null;
        Tuesdaynbhrs: string = null;
        Wednesdaynbhrs: string = null;
        Thursdaynbhrs: string = null;
        Fridaynbhrs: string = null;
        Saturdaynbhrs: string = null;
        Sundaynbhrs: string = null;
        WeekNumber: string = null;
        ProjectTimesheetStatus: string = null;
        StartDate: string = null;
        EndDate: string = null;
        Mondaydescnb: string = null;
        Tuesdaydescnb: string = null;
        Wednesdaydescnb: string = null;
        Thursdaydescnb: string = null;
        Fridaydescnb: string = null;
        Saturdaydescnb: string = null;
        Sundaydescnb: string = null;
        ApproverComment: string = null;
        TimesheetStatus: string = null;
        UpdationFlag: string = null;
        ID: number = 0;
    
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
      PendingApprover: User;
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
     PendingApprover: User;
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
      PendingApprover: User;
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
     PendingApprover: User;
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
      PendingApprover: User;
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
    PendingApprover: User;
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
     PendingApprover: User;
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
