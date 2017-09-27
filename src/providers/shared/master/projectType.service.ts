/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

/** Module Level Dependencies */
import { BaseService } from '../../index';
/** Context for service calls */
const CONTEXT = 'ProjectType';

/** Service Definition */
@Injectable()
export class ProjectTypeService extends BaseService {
    dummyData: any[];
    constructor(public http: Http) {
        super(http, CONTEXT);
        this.dummyData = [{
            ID: 1,
            Name: 'Administration',
        },
        {
            ID: 2,
            Name: 'External',
        },
        {
            ID: 3,
            Name: 'Internal',
        }];
    }
    getProjectTypes() {
        // return this.getList$(0, 0, true).map(res => res.json());
        return new Observable<any>((observer: any) => {
            observer.next(this.dummyData);
        });
    }
}
