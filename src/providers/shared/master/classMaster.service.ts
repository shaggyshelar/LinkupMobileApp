/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { BaseService } from '../../index';

/** Context for service calls */
const CONTEXT = 'ClassMaster';

/** Service Definition */
@Injectable()
export class ClassMasterService extends BaseService {

    constructor(public http: Http) {
        super(http, CONTEXT);
    }

    getClassMaster(): Observable<any> {
        return this.getList$().map(res => res.json());
    }
}
