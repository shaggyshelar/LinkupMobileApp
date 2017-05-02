/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
// import { Router } from '@angular/router';


/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
//import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { MessageService } from '../../../providers/shared';



/** Module Level Dependencies */
import { BaseService } from '../../../providers/shared';
//import { Project } from '../models/project';

/** Context for service calls */
const CONTEXT = 'Admin';

/** Service Definition */
@Injectable()
export class EmployeeDiscrepancyService extends BaseService {
    dummyData: any[];

    constructor(public http: Http) {
        super(http, CONTEXT);
        this.dummyData = [
            {
                ID: 101,
                Employee: { Value: 'Shrikant Mane', ID: 72 },
                Approvers: [{ Value: '', ID: 0 }],
                LeaveDate: new Date(),
                LeaveReason: '',
                ReasonDetails: '',
                EmployeeID: 0,
                ApproverStatus: '',
                ApprovedBy: { Value: '', ID: 0 }
            }
        ];
    }

    getEmployeeDiscrepancy(): Observable<any> {
        return this
            .getChildList$('EmployeeDiscrepancy', 0, 0, true)
            .map(res => res.json());
        // return new Observable<any>((observer: any) => {
        //     observer.next(this.dummyData);
        // });
    }

    updateEmployeeDiscrepancy(payload: any): Observable<any> {
        // return this
        //     .put$(ID, payload, true)
        //     .map(res => res.json());
        let headers = new Headers();
        let body = JSON.stringify(payload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.baseUrl + 'Admin/EmployeeDiscrepancy', body, options)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }

    getBioMetricReasons(): Observable<any> {
        return this
            .getChildList$('BioMatricResons', 0, 0, true)
            .map(res => res.json());
    }


}
