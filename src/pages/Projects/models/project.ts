export class Project {
    constructor(
       public Id: number,
       public ProjectName: string,
       public ProjectType: string,
       public DeliveryUnit: string,
       public ProjectCategory: string,
       public ClientName: string,
       public ProjectStartDate:string,
       public ProjectEndDate: string,
       public ProjectManager: string,
       public AccountManager: string,
       public DeliveryManager: string,
       public IsGlobal: boolean,
       public TeamMembers:any
    ) { }
}
