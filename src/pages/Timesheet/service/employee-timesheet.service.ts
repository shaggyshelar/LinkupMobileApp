/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/** Module Level Dependencies */
import { BaseService } from '../../../providers/shared';
import { MessageService } from '../../../providers/shared';
import { Timesheet } from '../models/timesheet.model';
import { Employee } from '../models/employee.model';
import { EmployeeTimeSheet } from '../models/employee-timesheet.model';

/** Context for service calls */
const CONTEXT = 'EmployeeTimesheet';

/** Service Definition */
@Injectable()
export class EmployeeTimesheetService extends BaseService {

    constructor(public http: Http, messageService: MessageService) {
        super(http, CONTEXT);
    }

    getMyTimesheets(): Observable<Employee> {
        return this.getChildList$('MyTimesheets',0,0,true).map(res => res.json());
    }
    getApproverPendingTimesheets(): Observable<EmployeeTimeSheet> {
        return this.getChildList$('ApproverPendingTimesheets',0,0,true).map(res => res.json());
    }
    getApproverApprovedTimesheets(): Observable<Employee> {
        return this.getChildList$('ApproverApprovedTimesheets',0,0,true).map(res => res.json());
    }
     getTimesheetApprovalData(id: any): Observable<any> {
        return this.getChildList$('GetTimesheetApprovalData/' + id, 0, 0, true).map(res => res.json());
    }

}
