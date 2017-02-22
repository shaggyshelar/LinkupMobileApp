/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import { BaseService } from '../../index';
// import { Employee } from '../models/employee';

/** Context for service calls */
const CONTEXT = 'LeaveTypes';

/** Service Definition */
@Injectable()
export class LeaveTypeMasterService extends BaseService {

    constructor(public http: Http) {
        super(http, CONTEXT);
    }
}
