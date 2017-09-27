/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

/** Module Level Dependencies */
import { BaseService } from '../../index';
/** Context for service calls */
const CONTEXT = 'PriceTypeMaster';

/** Service Definition */
@Injectable()
export class PriceTypeService extends BaseService {
    dummyData: any[];
    constructor(public http: Http) {
        super(http, CONTEXT);
        this.dummyData = [{
            ID: 1,
            Name: 'Cost Plus',
        },
        {
            ID: 2,
            Name: 'Fixed',
        },
        {
            ID: 3,
            Name: 'Staffing',
        },
        {
            ID: 4,
            Name: 'Hourly',
        },
        {
            ID: 5,
            Name: 'Monthly',
        },
        {
            ID: 6,
            Name: 'T & M',
        }];
    }
    getPriceType() {
        // return this.getList$(0, 0, true).map(res => res.json());
        return new Observable<any>((observer: any) => {
            observer.next(this.dummyData);
        });
    }
}
