/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { BaseService } from '../../index';
/** Context for service calls */
const CONTEXT = 'CertificationCodeMaster';

/** Service Definition */
@Injectable()
export class CertificationCodeMasterService extends BaseService {

    constructor(public http: Http) {
        super(http, CONTEXT);
    }

    getCertificationCodeMaster(): Observable<any> {
        return this.getList$().map(res => res.json());
    }
}
