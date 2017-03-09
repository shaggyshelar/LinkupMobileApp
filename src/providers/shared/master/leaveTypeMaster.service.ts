/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'ng2-cache/ng2-cache';

import { BaseService } from '../../index';
import { Select } from '../../../pages/LeaveManagement/models/select';
// import { Employee } from '../models/employee';

/** Context for service calls */
const CONTEXT = 'LeaveType';

/** Service Definition */
@Injectable()
export class LeaveTypeMasterService extends BaseService {

    constructor(public http: Http , public _cacheService:CacheService) {
        super(http, CONTEXT);
    }

       /**
     * getHolidays method
     * Gets array of Holiday objects
     */
   getLeaveTypes() {
        if (this._cacheService.exists('leaveType')) {
            return new Observable<any>((observer: any) => {
                observer.next(this._cacheService.get('leaveType'));
            });
        } else {
            return this.getList$(0, 0, true)
                .map(res => {
                    this._cacheService.set('leaveType', res.json(), { maxAge: 60 * 60 });
                    return res.json();
                })
                .catch(err => {
                    return this.handleError(err);
                });
        }
}
}
