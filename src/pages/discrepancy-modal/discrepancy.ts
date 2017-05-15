export class Discrepancy {
    constructor() {}
    ID: number = 0;
    Employee: User = { Name:'', ID: 0};
    Approvers: User[] = [];
    Department: string = '';
    LeaveDate: string = '';
    LeaveReason: string = '';
    ReasonDetails: string = '';
    EmployeeID: number = 0;
    ApproverStatus: string = '';
}

export class User {
    constructor(){}
    Name: string = '';
    ID: number = 0;
}
