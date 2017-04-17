/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { Router } from '@angular/router';


/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
//import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { MessageService } from '../../../providers/shared';



/** Module Level Dependencies */
import { BaseService } from '../../../providers/shared';
//import { Project } from '../models/project';

/** Context for service calls */
const CONTEXT = 'Employee';

/** Service Definition */
@Injectable()
export class EmployeeService extends BaseService {
    constructor(public http: Http) {
        super(http, CONTEXT);
    }

    getEmployeeList(): Observable<any> {
        return this
            .getList$(0, 0, true)
            .map(res => res.json());
    }

    getActiveEmployeeList(): Observable<any> {
        return this
            .getChildList$('ByStatus/Active', 0, 0, true)
            .map(res => res.json());
    }


}
