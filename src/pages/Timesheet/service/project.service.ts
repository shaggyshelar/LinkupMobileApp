/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
// import { Router } from '@angular/router';

/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/** Module Level Dependencies */
import { BaseService } from '../../../providers/shared';
import { MessageService } from '../../../providers/shared';
import { Project } from '../models/project.model';

/** Context for service calls */
const CONTEXT = 'Project';

/** Service Definition */
@Injectable()
export class ProjectService extends BaseService {
    constructor(public http: Http, messageService: MessageService) {
        super(http, CONTEXT);
    }
    getProjectList(): Observable<any[]> {
        return this
            .getChildList$('GetMyActiveProjects', 0, 0, true)
            .map(res => res.json());
    }
    getProjectById(id: string): Observable<Project> {
        return this
            .get$(id, true)
            .map(res => res.json());
    }
    saveProject(project: any): Observable<any> {
        return this
            .post$(project)
            .map(res => res.json());
    }
    editProject(project: any): Observable<any> {
        return this
            .put$(project.Id, project)
            .map(res => res.json());
    }
    getMyProjectsForTimesheet(payload: any) {
        // if (this._cacheService.exists('projectsForTimesheet')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('projectsForTimesheet'));
        //     });
        // } else {
            let headers = new Headers();
            let body = JSON.stringify(payload);
            headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
            headers.append('Content-Type', 'application/json');
            // let windowRef = this._window();
            // windowRef['App'].blockUI();
            let options = new RequestOptions({ headers: headers });
            return this.http.post(this.baseUrl + 'Project/GetMyProjectsForTimesheet', body, options)
                .map(res => {
                    // this._cacheService.set('projectsForTimesheet', res.json(), { maxAge: 60 * 60 });
                    // windowRef['App'].unblockUI();
                    return res.json();
                })
                .catch(err => {
                    // windowRef['App'].unblockUI();
                    return this.handleError(err);
                });
        // }
    }
}
