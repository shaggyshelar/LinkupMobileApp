/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Third Party Dependencies */
import { CacheService } from 'ng2-cache/ng2-cache';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/** Module Level Dependencies */
import { BaseService } from '../../../providers/shared';
import { MessageService } from '../../../providers/shared';
/** Context for service calls */
const CONTEXT = 'Timesheets';

/** Service Definition */
@Injectable()
export class TimesheetService extends BaseService {

    constructor(public http: Http, messageService: MessageService, public _cacheService: CacheService
    ) {
        super(http, CONTEXT);
    }

    getMyTimesheet(id: any): Observable<any> {
        // if (this._cacheService.exists('timesheetApprovalData')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('timesheetApprovalData'));
        //     });
        // } else {
        return this.get$('Edit/' + id, true).map(res => {
            //this._cacheService.set('Edit' + id, res.json(), { maxAge: 60 * 60 * 24 });
            return res.json();
        }).catch(err => {
            return this.handleError(err);
        });
        // }
    }
}