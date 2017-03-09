/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Module Level Dependencies */
import { BaseService } from '../../index';

/** Context for service calls */
const CONTEXT = 'clientMaster';
import { Events } from 'ionic-angular';
/** Service Definition */
@Injectable()
export class ClientService extends BaseService {
    constructor(public http: Http, public unauthorizedEvent:Events) {
        super(http, CONTEXT,unauthorizedEvent);
    }
    getClients() {
        return this.getList$(0, 0, true).map(res => res.json());
    }
}
