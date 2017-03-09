/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

//import 'rxjs/add/operator/map';

/** Module Level Dependencies */
import { BaseService } from '../../index';
import { Events } from 'ionic-angular';
/** Context for service calls */
const CONTEXT = 'priorityMaster';

/** Service Definition */
@Injectable()
export class PriorityService extends BaseService {
    constructor(public http: Http, public unauthorizedEvent:Events) {
        super(http, CONTEXT,unauthorizedEvent);
    }
    getPriorityList() {
        return this.getList$(0, 0, true).map(res => res.json());
    }
}
