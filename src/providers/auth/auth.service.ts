import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { LoadingController  } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { BaseService } from '../shared/index';
import { Subject } from 'rxjs/Subject';
/** Context for service calls */
const CONTEXT = 'auth';

@Injectable()
export class AuthService extends BaseService {
    public currentUser: any;
    public authStatusChangeSource = new Subject<string>();
    public loader:any;
    onAuthStatusChanged$ = this.authStatusChangeSource.asObservable();
    private authenticated = false;

    constructor(httpService: Http, private http: Http, public loadingCtrl:LoadingController) {
        super(httpService, CONTEXT);
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
            return true;
        } else {
            this.authenticated = false;
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
        let headers = new Headers();
        this.presentLoading();
        let credentialString: string = 'grant_type=password&UserName=' + credentials.UserName + '&Password=' + credentials.Password;
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });
        this.blockUI();
        return this.http.post(this.baseUrl + 'auth/Token', credentialString, options)
            .map((res: Response) => {
                this.setToken(res);
                this.storeLoggedInUserPermission().subscribe();
                this.getCurrentUserDetails().subscribe();
                this.unblockUI();
            })
            .catch(err => {
                this.unblockUI();
                return this.handleError(err);
            })
            .finally(() => this.loader.dismiss());
    }
    storeLoggedInUserPermission() {
        return this.getChildList$('permissions', 0, 0, true).map((res: Response) => { this.setLoggedInUserPermission(res); });
    }

    getCurrentUserDetails() {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.baseUrl + 'Employee/currentuser', options)
            .map((res: Response) => {
                this.setLoggedInUserDetail(res);
            })
            .catch(err => {
                return this.handleError(err);
            });
    }
    private setToken(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        localStorage.setItem('accessToken', body.access_token);
    }
    private setLoggedInUserPermission(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        localStorage.setItem('loggedInUserPermission', JSON.stringify(body));
        this.authenticated = true;
        this.authStatusChangeSource.next('true');
    }
    private setLoggedInUserDetail(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        localStorage.setItem('loggedInUserDetails', JSON.stringify(body));
        
    }
    presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }
}
