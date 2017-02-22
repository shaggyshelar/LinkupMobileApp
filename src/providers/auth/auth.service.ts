import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BaseService } from '../shared/index';
import { Subject } from 'rxjs/Subject';
import { MessageService } from '../shared/services/message.service';

/** Context for service calls */
const CONTEXT = 'auth';

@Injectable()
export class AuthService extends BaseService {
    public currentUser: any;
    public authStatusChangeSource = new Subject<string>();
    onAuthStatusChanged$ = this.authStatusChangeSource.asObservable();
    private authenticated = false;

    constructor(httpService: Http, private http: Http, messageService: MessageService) {
        super(httpService, CONTEXT, messageService);
    }

    blockUI(): any {
    }

    unblockUI(): any {
    }

    onAuthenticate(isAuthenticated: string) {
        this.authStatusChangeSource.next(isAuthenticated);
    }

    isAuthenticated() {
        if (localStorage.getItem('accessToken')) {
            this.authenticated = true;
            this.authStatusChangeSource.next('true');
            return true;
        } else {
            this.authenticated = false;
            this.authStatusChangeSource.next('false');
            return false;
        }
    }
    logout() {
        localStorage.clear();
        this.authenticated = false;
        this.authStatusChangeSource.next('false');
    }
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('loggedInUserDetails'));
    }
    authenticate(credentials: any): Observable<any> {
        // return this.post$('/auth/Token',credentials).map((res: Response) => { this.setToken(res); });
        let headers = new Headers();
        let credentialString: string = 'grant_type=password&UserName=' + credentials.UserName + '&Password=' + credentials.Password;
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });
        this.blockUI();
        return this.http.post(this.baseUrl + 'auth/Token', credentialString, options)
            .map((res: Response) => {
                this.unblockUI();
                this.setToken(res);
            })
            .catch(err => {
                this.unblockUI();
                return this.handleError(err);
            });
    }
    getLoggedInUserPermission() {
        return this.getChildList$('permissions', 0, 0, true).map((res: Response) => { this.setLoggedInUserPermission(res); });
    }
    getCurrentUserDetails() {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        let options = new RequestOptions({ headers: headers });
        this.blockUI();
        return this.http.get(this.baseUrl + 'Employee/currentuser', options)
            .map((res: Response) => {
                this.unblockUI();
                this.setLoggedInUserDetail(res);
            })
            .catch(err => {
                this.unblockUI();
                return this.handleError(err);
            });
    }
    private setToken(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        localStorage.setItem('accessToken', body.access_token);
        this.authenticated = true;
        this.authStatusChangeSource.next('true');
    }
    private setLoggedInUserPermission(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        localStorage.setItem('loggedInUserPermission', JSON.stringify(body));
    }
    private setLoggedInUserDetail(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        localStorage.setItem('loggedInUserDetails', JSON.stringify(body));
    }
}
