/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { MessageService } from '../../../providers/shared';

/** Module Level Dependencies */
import { BaseService } from '../../../providers/shared';
import { Project } from '../models/project';

/** Context for service calls */
const CONTEXT = 'Phases';

/** Service Definition */
@Injectable()
export class PhasesService extends BaseService {
    constructor(public http: Http, messageService: MessageService) {
        super(http, CONTEXT);
    }
    getPhasesByProject(payload: any) {
        let headers = new Headers();
        let body = JSON.stringify(payload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl + 'Phases/GetPhasesByProject', body, options)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }
}
