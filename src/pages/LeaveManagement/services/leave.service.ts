/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'ng2-cache/ng2-cache';
import 'rxjs/add/operator/map';

/** Module Level Dependencies */
import { BaseService } from '../../../providers/index';
import { Leave } from '../models/leave';
// import { Employee } from '../models/employee';
import { LeaveDetail } from '../models/leaveDetail';

/** Context for service calls */
const CONTEXT = 'Leave';

/** Service Definition */
@Injectable()
export class LeaveService extends BaseService {
    editableLeave: any;
    constructor(public http: Http, private _cacheService: CacheService) {
        super(http, CONTEXT);
    }

    /**
     * getLeave method
     * Gets leave object corresponding to ID specified
     */
    getLeave(id: any): Observable<Leave> {
        return this.get$(id).map(res => res.json());
    }

    /**
     * getLeaves method
     * Gets array of leaves
     */
    getLeaves(): Observable<Leave> {
        return this.getList$(0, 0, true).map(res => res.json());
    }
    getMyLeaves(): Observable<Leave> {
        return this.getChildList$('myleaves', 0, 0, true).map(res => res.json());
    }
    getApproverLeaves(): Observable<Leave[]> {
        return this.getChildList$('ApproverLeaves', 0, 0, true).map(res => res.json());
    }
    /**
     * getLeaveArray method
     * Gets child array in the object to be returned. List of applied leaves, in this case
     * @methodParam mandatory parameter
     */
    getLeaveArray(methodParam: any): Observable<LeaveDetail> {
        return this.getChildList$(methodParam).map(res => res.json());
    }

    /**
     * addLeaveRecord method
     * Adds leave record. returns true if successful, false if not.
     */
    addLeaveRecord(leavePayload: any): Observable<boolean> {
        return this.post$(leavePayload).map(res => res.status === 201 ? true : false);
    }

    /**
     * getChildRecord method
     * Gets data form the path extension specified.
     * @params : Parameter : path extension
     */
    getChildRecord(params: any): Observable<any> {
        return this.getChildList$(params).map(res => res.json());
    }

    /**
     * updateLeaveRecord method
     * Put request to update a record.
     * @ID : Parameter : ID of entity to update
     * @payload : Parameter : Object with properties of entity to be updated
     */
    updateLeaveRecord(ID: any, payload: any): Observable<boolean> {
        return this.put$(ID, payload).map(res => res.status === 200 ? true : false);
    }

    /**
     * deleteLeaveRecord method
     * Delete request to delete a record.
     * @ID : Parameter : ID of entity to update
     */
    deleteLeaveRecord(leavePayload: any): Observable<boolean> {
        let headers = new Headers();
        let body = JSON.stringify(leavePayload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl + 'Leave/cancel', body, options)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }

    getLeaveDetailByRefID(refId: any): Observable<Leave[]> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.baseUrl + 'LeaveDetails/' + refId, options)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }

    getApproverListByRefID(refId: any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.baseUrl + 'LeaveApprovers/' + refId, options)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }
    getActiveProjects(): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.baseUrl + 'Project/GetMyActiveProjects', options)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }

    setEditableLeave(leave: any) {
        this.editableLeave = leave;
    }
    getEditableLeave() {
        return this.editableLeave;
    }


    getLeaveByStatus(status: any): Observable<Leave[]> {

        return this.getChildList$('ByStatus/' + status, 0, 0, true).map(res => {

            this._cacheService.set('PendingLeavesApprovalCount', res.json().length, { maxAge: 60 * 60 });
            return res.json();
        })
            .catch(err => {
                return this.handleError(err);
            });
    }

    singleLeaveApprove(payload: any) {
        let headers = new Headers();
        let body = JSON.stringify(payload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.baseUrl + 'LeaveApprovers/ApproveByManager', body, options)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }

    singleLeaveReject(payload: any) {
        let headers = new Headers();
        let body = JSON.stringify(payload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.baseUrl + 'LeaveApprovers/RejectLeave', body, options)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }

    /** Get Employee Leave details */

    getEmployeeDetail(Id:any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.baseUrl+'Employee/'+Id,options)
         .map(res => {
            return res.json();
        })
        .catch(err => {
            return this.handleError(err);
        });
    }

    // Bulk approval 

    bulkLeaveApproval(payload: any) {
        let headers = new Headers();
        let body = JSON.stringify(payload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.baseUrl + 'LeaveApprovers/BulkLeaveApproval', body, options)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }

    hrsingleLeaveApprove(payload: any) {
        let headers = new Headers();
        let body = JSON.stringify(payload);
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.baseUrl + 'LeaveApprovers/ApproveByHR', body, options)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                return this.handleError(err);
            });
    }

    setApprovedLeavesCount(count:string)
    {
       this._cacheService.set('approvedLeaveCount', count, { maxAge: 60 * 60 });
    }

}
