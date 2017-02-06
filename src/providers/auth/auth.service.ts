import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { APIService } from '../shared/index';

@Injectable()
export class AuthService extends APIService {
    private authenticated = false;

    constructor(httpService: Http, private http: Http) {
        super(httpService);
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
        return this.delete$('auth', '', true).map((res: Response) => {
            localStorage.clear();
            this.authenticated = false;
        });
    }
    authenticate(credentials: any): Observable<any> {
        // return this.post$('/auth/Token',credentials).map((res: Response) => { this.setToken(res); });
        let headers = new Headers();
        let credentialString: string = 'grant_type=password&UserName=' + credentials.UserName + '&Password=' + credentials.Password;
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/auth/Token', credentialString, options)
            .map((res: Response) => { this.setToken(res); })
            .catch(this.handleError);
    }
    getLoggedInUserPermission() {
        return this.getList$('auth/permissions', 0, 0, true).map((res: Response) => { this.setLoggedInUserPermission(res); });
    }

    private setToken(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        localStorage.setItem('accessToken', body.access_token);
        this.authenticated = true;
    }
    private setLoggedInUserPermission(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        localStorage.setItem('loggedInUserPermission', JSON.stringify(body));
    }
}
