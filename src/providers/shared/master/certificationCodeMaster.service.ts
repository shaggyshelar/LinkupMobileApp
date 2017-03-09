/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { BaseService } from '../../index';
import { Events } from 'ionic-angular';
/** Context for service calls */
const CONTEXT = 'CertificationCodeMaster';

/** Service Definition */
@Injectable()
export class CertificationCodeMasterService extends BaseService {

    constructor(public http: Http,public unauthorizedEvent:Events) {
        super(http, CONTEXT,unauthorizedEvent);
    }

    getCertificationCodeMaster(): Observable<any> {
        return this.getList$().map(res => res.json());
    }
}
