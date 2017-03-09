/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Module Level Dependencies */
import { BaseService } from '../../index';
import { Events } from 'ionic-angular';
/** Context for service calls */
const CONTEXT = 'deliveryUnitMaster';

/** Service Definition */
@Injectable()
export class DeliveryUnitService extends BaseService {
    constructor( public http: Http, public unauthorizedEvent:Events) {
        super(http, CONTEXT,unauthorizedEvent);
    }
    getDeliveryUnit() {
        return this.getList$(0,0,true).map(res => res.json());
    }
}
