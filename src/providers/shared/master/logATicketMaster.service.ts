/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'ng2-cache/ng2-cache';

import { BaseService } from '../../index';
//import { Select } from '../../../pages/LeaveManagement/models/select';
// import { Employee } from '../models/employee';
/** Context for service calls */
const CONTEXT = 'Tickets';

/** Service Definition */
@Injectable()
export class LogATicketMasterService extends BaseService {

    priority = [
        {
            ID: 1,
            Name: 'Low',
            Color: '#E7C5F5'
        },
        {
            ID: 2,
            Name: 'High',
            Color: '#3FABA4'
        },
        {
            ID: 3,
            Name: 'Medium',
            Color: '#35AA47'
        }
    ];
    department = [
        {
            ID: 1,
            Name: 'IT',
        },
        {
            ID: 2,
            Name: 'Admin',
        },
        {
            ID: 3,
            Name: 'HR',
        }
    ];
    concern = [
        {
            ID: 1,
            Name: 'Soft install',
        },
        {
            ID: 2,
            Name: 'Hardware req',
        },
        {
            ID: 3,
            Name: 'Abc',
        }
    ];
    constructor(public http: Http, public _cacheService: CacheService) {
        super(http, CONTEXT);
    }

    getPriorityTypes() {
        // if (this._cacheService.exists('ticketConcern', res.json(), { maxAge: 60 * 60 });
        //             return res.json();
        //         })
        //         .catch(err => {
        //             return this.handleError(err);
        //         });
        // }
        return new Observable<any>((observer: any) => {
            observer.next(this.priority);
        });
    }
    getDepartmentTypes() {
        // if (this._cacheService.exists('ticketConcern')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('ticketConcern'));
        //     });
        // } else {
        return this.getChildList$('Departments', 0, 0, true)
            .map(res => {
        //         this._cacheService.set('ticketConcern', res.json(), { maxAge: 60 * 60 });
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });

        //     return this.getList$(0, 0, true)
        //         .map(res => {
        //             this._cacheService.set('ticketConcern', res.json(), { maxAge: 60 * 60 });
        //             return res.json();
        //         })
        //         .catch(err => {
        //             return this.handleError(err);
        //         });
        // }
        // return new Observable<any>((observer: any) => {
        //     observer.next(this.department);
        // });
    }
    getConcernTypes() {
        // if (this._cacheService.exists('ticketConcern')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('ticketConcern'));
        //     });
        // } else {
        return this.getChildList$('Concerns', 0, 0, true)
            .map(res => {
                // this._cacheService.set('ticketConcern', res.json(), { maxAge: 60 * 60 });
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }
    // return new Observable<any>((observer: any) => {
    //     observer.next(this.concern);
    // });
    // }
}
