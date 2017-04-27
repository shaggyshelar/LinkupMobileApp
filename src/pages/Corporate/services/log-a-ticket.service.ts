/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Third Party Dependencies */
import { CacheService } from 'ng2-cache/ng2-cache';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

/** Module Level Dependencies */
import { BaseService } from '../../../providers/shared';
import { MessageService } from '../../../providers/shared';
/** Context for service calls */
const CONTEXT = 'Timesheets';

/** Service Definition */
@Injectable()
export class LogATicketService extends BaseService {
    ticket = [
        {
            "Title": "Title",
            "Employee": null,
            "EmployeeID": "10241",
            "ServiceDeskID": "SD6801815979",
            "ActualConcern ": "Hardware Issue / Requirement",
            "Description": "I am getting a popup always as USB Device Not Recognized. The mouse stops functioning in between. I unplugged and plugged the device again but the error keeps popping up.",
            "Priority": "Medium",
            "Department": null,
            "PredefinedConcern": null,
            "ApproverPriority  ": null,
            "ApproverStatus ": null,
            "Approvercomment ": null,
            "ID": 1019
        }
    ];


    ticketData = [
        {
            "Id": 1,
            "ticket": "Installation NodeJS",
            "Department": "IT",
            "Concern": "Abc",
            "Description": "Abc",
            "Status": "Resolved",
            "Priority": "High",
            "UpdatedBy": "Shril",
            "ResolvedBy": "Shril",
            "CreatedDate": "20-03-2017",
            "UpdatedDate": "22-03-2017",
            "AgeDays": 1
        },
        {
            "Id": 3,
            "ticket": "Installation NodeJS",
            "Department": "IT",
            "Concern": "Abc",
            "Description": "Abc",
            "Status": "Open",
            "Priority": "Medium",
            "UpdatedBy": "Shril",
            "ResolvedBy": "Shril",
            "CreatedDate": "20-03-2017",
            "UpdatedDate": "22-03-2017",
            "AgeDays": 10
        },
        {
            "Id": 2,
            "ticket": "Installation NodeJS",
            "Department": "IT",
            "Concern": "Abc",
            "Description": "Abc",
            "Status": "Resolved",
            "Priority": "Low",
            "UpdatedBy": "Shril",
            "ResolvedBy": "Shril",
            "CreatedDate": "20-03-2017",
            "UpdatedDate": "22-03-2017",
            "AgeDays": 12
        },
    ]

    constructor(public http: Http, messageService: MessageService, public _cacheService: CacheService
    ) {
        super(http, CONTEXT);
    }

    getMyTicket(id: any): Observable<any> {
        // if (this._cacheService.exists('logATicketData')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('logATicketData'));
        //     });
        // } else {

        // return this.get$(id, true).map(res => {
        //     this._cacheService.set('holidayList', res.json(), { maxAge: 60 * 60 });
        //     return res.json();
        // }).catch(err => {
        //     return this.handleError(err);
        // });

        //     return this.get$('Edit/' + id, true).map(res => {
        //         this._cacheService.set('Edit' + id, res.json(), { maxAge: 60 * 60 * 24 });
        //         return res.json();
        //     }).catch(err => {
        //         return this.handleError(err);
        //     });
        // }
        /** Stub */
        var index = _.findIndex(this.ticketData, { Id: id });
        return new Observable<any>((observer: any) => {
            observer.next(this.ticketData[index]);
        });
    }
    getMyTickets(): Observable<any> {
        // if (this._cacheService.exists('logATicketData')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('logATicketData'));
        //     });
        // } else {

        // return this.getList$(0, 0, true).map(res => {
        //     this._cacheService.set('holidayList', res.json(), { maxAge: 60 * 60 });
        //     return res.json();
        // }).catch(err => {
        //     return this.handleError(err);
        // });

        //     return this.get$('Edit/' + id, true).map(res => {
        //         this._cacheService.set('Edit' + id, res.json(), { maxAge: 60 * 60 * 24 });
        //         return res.json();
        //     }).catch(err => {
        //         return this.handleError(err);
        //     });
        // }
        /** Stub */
        return new Observable<any>((observer: any) => {
            observer.next(this.ticketData);
        });
    }

    updateMyTicket(id: any, payload: any): Observable<any> {
        // return this.put$(id, payload).map(res => { return res});
        return new Observable<any>((observer: any) => {
            observer.next({ message: 'Ok' });
        });
    }

    addTicket(payload: any): Observable<any> {
        // return this.post$(payload).map(res => { return res});
        return new Observable<any>((observer: any) => {
            observer.next({ message: 'Ok' });
        });
    }
}