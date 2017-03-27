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
const CONTEXT = 'LeaveType';

/** Service Definition */
@Injectable()
export class ConferenceBookingMasterService extends BaseService {

    roomsList = [
        {
            ID: 1,
            Name: 'Bahamas',
            Color: '#E7C5F5'
        }, {
            ID: 2,
            Name: 'Dubai',
            Color: '#3FABA4'
        }, {
            ID: 3,
            Name: 'Cape Town',
            Color: '#35AA47'
        }, {
            ID: 4,
            Name: 'Hong Kong',
            Color: '#FF9655'
        }, {
            ID: 5,
            Name: 'Caribbean',
            Color: '#8877A9'
        }, {
            ID: 6,
            Name: 'Houston	',
            Color: '#428BCA'
        }, {
            ID: 7,
            Name: 'Barcelona',
            Color: '#D05454'
        }, {
            ID: 8,
            Name: 'Trainning Room',
            Color: '#DFBA49'
        }
    ];

    splTreatmentItems = [
        'Water',
        'Tea',
        'Coffee',
        'Juice',
        'Snacks',
        'Breakfast',
    ];
    constructor(public http: Http, public _cacheService: CacheService) {
        super(http, CONTEXT);
    }

    getRoomsList() {
        // if (this._cacheService.exists('leaveType')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('leaveType'));
        //     });
        // } else {
        //     return this.getList$(0, 0, true)
        //         .map(res => {
        //             this._cacheService.set('leaveType', res.json(), { maxAge: 60 * 60 });
        //             return res.json();
        //         })
        //         .catch(err => {
        //             return this.handleError(err);
        //         });
        // }
        return new Observable<any>((observer: any) => {
            observer.next(this.roomsList);
        });
    }

    getSpecialTreatmentList() {
        // if (this._cacheService.exists('leaveType')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('leaveType'));
        //     });
        // } else {
        //     return this.getList$(0, 0, true)
        //         .map(res => {
        //             this._cacheService.set('leaveType', res.json(), { maxAge: 60 * 60 });
        //             return res.json();
        //         })
        //         .catch(err => {
        //             return this.handleError(err);
        //         });
        // }
        return new Observable<any>((observer: any) => {
            observer.next(this.splTreatmentItems);
        });
    }
}
