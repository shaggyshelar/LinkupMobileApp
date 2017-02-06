/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { BaseService } from '../../index';

/** Context for service calls */
const CONTEXT = 'GradeMaster';

/** Service Definition */
@Injectable()
export class GradeMasterService extends BaseService {

    constructor(public http: Http) {
        super(http, CONTEXT);
    }

    getGradeMaster(): Observable<any> {
        return this.getList$().map(res => res.json());
    }
}
