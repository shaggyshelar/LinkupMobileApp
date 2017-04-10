export class Project {
    public Id: number;
    public ProjectName: string;
    public ProjectType: string;
    public DeliveryUnit: string;
    public ProjectCategory: string;
    public ClientName: string;
    public ProjectStartDate: string;
    public ProjectEndDate: string;
    public ProjectManager: string;
    public AccountManager: string;
    public DeliveryManager: string;
    public BillType: string;
    public ProjectSummary: string;
    public DeliveryModel: string;
    public PriceType: string;
    public TeamSize: number;
    public IsActive: boolean;
    public IsGlobal: boolean;
    public TeamMembers: [{ Id: number, Name: string }]
}
