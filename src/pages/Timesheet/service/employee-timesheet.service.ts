/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

/** Third Party Dependencies */
import { CacheService } from 'ng2-cache/ng2-cache';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import * as Rx from 'rxjs/Rx';

/** Module Level Dependencies */
import { BaseService } from '../../../providers/shared';
import { MessageService } from '../../../providers/shared';
// import { Timesheet } from '../models/timesheet.model';
import { Employee } from '../models/employee.model';
import { EmployeeTimeSheet } from '../models/employee-timesheet.model';

/** Context for service calls */
const CONTEXT = 'EmployeeTimesheet';

/** Service Definition */
@Injectable()
export class EmployeeTimesheetService extends BaseService {

    /** MyTimesheetDetails Stub Data */
    MytimesheetsStub = [
        { Date: "Monday, 1/27/2017", Project: { Value: "MMC", ID: 219 }, Task: "Development", BillableHours: null, NonBillableHours: "08:00", TotalHours: "8:0", NoteForBillableHours: null, NoteForNonBillableHours: "xzfg" }, { Date: "Tuesday, 1/28/2017", Project: { Value: "MMC", ID: 219 }, Task: "Development", BillableHours: null, NonBillableHours: "08:00", TotalHours: "8:0", NoteForBillableHours: null, NoteForNonBillableHours: "dfg" }, { Date: "Wednesday, 1/29/2017", Project: { Value: "MMC", ID: 219 }, Task: "Development", BillableHours: null, NonBillableHours: "08:00", TotalHours: "8:0", NoteForBillableHours: null, NoteForNonBillableHours: "fujfuj" }, { Date: "Thursday, 1/30/2017", Project: { Value: "MMC", ID: 219 }, Task: "Development", BillableHours: null, NonBillableHours: "08:00", TotalHours: "8:0", NoteForBillableHours: null, NoteForNonBillableHours: "dj" }, { Date: "Friday, 1/31/2017", Project: { Value: "MMC", ID: 219 }, Task: "Development", BillableHours: null, NonBillableHours: "08:00", TotalHours: "8:0", NoteForBillableHours: null, NoteForNonBillableHours: "dyjj" }
    ];

    MytimesheetStub = {
        "Employee": {
            "Name": "Aradhana Chindhade",
            "ID": 334
        },
        "EmpID": null,
        "SubmittedStatus": "Approved",
        "Comments": "Approved by Super Approval Kunal Kirankumar Adhikari",
        "BillableTotal": "6:30",
        "NonBillableTotal": "4:0",
        "TotalHours": "10:30",
        "ApproverTimesheet": [
            {
                "Date": "Monday, 24-Oct-16",
                "Project": {
                    "Value": "ESPL - Practice Management - MSPlus",
                    "ID": 25
                },
                "Task": "SelfStudy/Bench",
                "BillableHours": null,
                "NonBillableHours": "01:00",
                "TotalHours": "1:0",
                "NoteForBillableHours": null,
                "NoteForNonBillableHours": "TL Meeting for planning project coverage during diwali based on team's leave plans "
            }
        ],
        "ID": 0
    };


    constructor(public http: Http, messageService: MessageService,
        public _cacheService: CacheService
    ) {
        super(http, CONTEXT);
    }

    getMyTimesheets(): Observable<any> {
        /** TODO: API not ready, needs updation*/

        // if (this._cacheService.exists('myTimesheets')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('myTimesheets'));
        //     });
        // } else {
        //     return this.getChildList$('MyTimesheets',0,0,true).map(res => {
        //         this._cacheService.set('myTimesheets', res.json(), { maxAge: 60 * 60 });
        //         // return res.json();
        //         return this.MytimesheetsStub;
        //     }).catch(err => {
        //         return this.handleError(err);
        //     });
        // }
        return new Observable<any>((observer: any) => {
            observer.next(this.MytimesheetsStub);
        });
    }

    getMyTimesheetDetail(id: any) {
        /** TODO: API not ready, needs updation*/

        // if (this._cacheService.exists('myTimesheetDetail')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('myTimesheetDetail'));
        //     });
        // } else {
        //     return this.getChildList$('GetMyTimesheetDetail/' + id, 0, 0, true).map(res => {
        //         this._cacheService.set('myTimesheetDetail' + id, res.json(), { maxAge: 60 * 60 });
        //         return res.json();
        //     }).catch(err => {
        //         return this.handleError(err);
        //     });
        // }
        return new Observable<any>((observer: any) => {
            observer.next(this.MytimesheetStub);
        });
    }

    getApproverPendingTimesheets(): Observable<EmployeeTimeSheet> {

        if (this._cacheService.exists('approverPendingTimesheets')) {
            return new Observable<any>((observer: any) => {
                observer.next(this._cacheService.get('approverPendingTimesheets'));
            });
        } else {
            return this.getChildList$('ApproverPendingTimesheets', 0, 0, true).map(res => {
                this._cacheService.set('approverPendingTimesheets', res.json(), { maxAge: 60 * 60 });
                return res.json();
            }).catch(err => {
                return this.handleError(err);
            });
        }
    }

    getApproverApprovedTimesheets(): Observable<Employee> {

        if (this._cacheService.exists('approverApprovedTimesheets')) {
            return new Observable<any>((observer: any) => {
                observer.next(this._cacheService.get('approverApprovedTimesheets'));
            });
        } else {
            return this.getChildList$('ApproverApprovedTimesheets', 0, 0, true).map(res => {
                this._cacheService.set('approverApprovedTimesheets', res.json(), { maxAge: 60 * 60 });
                return res.json();
            }).catch(err => {
                return this.handleError(err);
            });
        }
    }

    getTimesheetApprovalData(id: any) {

        if (this._cacheService.exists('timesheetApprovalData')) {
            return new Observable<any>((observer: any) => {
                observer.next(this._cacheService.get('timesheetApprovalData'));
            });
        } else {
            return this.getChildList$('GetTimesheetApprovalData/' + id, 0, 0, true).map(res => {
                this._cacheService.set('timesheetApprovalData' + id, res.json(), { maxAge: 60 * 60 });
                return res.json();
            }).catch(err => {
                return this.handleError(err);
            });
        }
    }

    approveTimesheet(payload: any) {
        let headers = new Headers();
        let body = JSON.stringify(payload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        // let windowRef = this._window();
        // windowRef['App'].blockUI();
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl + '/EmployeeTimesheet/Approve ', body, options)
            .map(res => {
                // windowRef['App'].unblockUI();
                return res.json();
            })
            .catch(err => {
                // windowRef['App'].unblockUI();
                return this.handleError(err);
            });
    }

    rejectTimesheet(payload: any) {
        let headers = new Headers();
        let body = JSON.stringify(payload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        // let windowRef = this._window();
        // windowRef['App'].blockUI();
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl + '/EmployeeTimesheet/Reject ', body, options)
            .map(res => {
                // windowRef['App'].unblockUI();
                return res.json();
            })
            .catch(err => {
                // windowRef['App'].unblockUI();
                return this.handleError(err);
            });
    }


    /** SubmitDailySheet API Service Call
     *  TODO: Change API URL
     */
    submitDailyTimesheet(payload: any) {
        let headers = new Headers();
        let body = JSON.stringify(payload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        // let windowRef = this._window();              used for loader
        // windowRef['App'].blockUI();
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl + 'LeaveDetails', body, options)
            .map(res => {
                // windowRef['App'].unblockUI();
                return res.json();
            })
            .catch(err => {
                // windowRef['App'].unblockUI();
                return this.handleError(err);
            });
    }

    /** submitWeeklyTimesheetForApproval API Service Call
     *  TODO: Change API URL
     */
    submitWeeklyTimesheetForApproval(payload: any) {
        let headers = new Headers();
        let body = JSON.stringify(payload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        // let windowRef = this._window();
        // windowRef['App'].blockUI();
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl + 'LeaveDetails', body, options)
            .map(res => {
                // windowRef['App'].unblockUI();
                return res.json();
            })
            .catch(err => {
                // windowRef['App'].unblockUI();
                return this.handleError(err);
            });
    }

}
