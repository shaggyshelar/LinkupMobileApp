/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Module Level Dependencies */
import { BaseService } from '../../index';

/** Context for service calls */
const CONTEXT = 'clientMaster';
/** Service Definition */
@Injectable()
export class ClientService extends BaseService {
    constructor(public http: Http) {
        super(http, CONTEXT);
    }
    getClients() {
        return this.getList$(0, 0, true).map(res => res.json());
    }
}
