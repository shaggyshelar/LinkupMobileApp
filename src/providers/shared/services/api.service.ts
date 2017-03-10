import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
/** HttpService interface Definition*/
interface HttpServices {
    baseUrl: string;
    get$(url: string,id: string, isSecured?: boolean): Observable<Response>;
    getList$(url: string,pageNum?: number, pageSize?: number, isSecured?: boolean): Observable<Response>;
    post$(url: string,payload: any, isSecured?: boolean): Observable<Response>;
    put$(url: string,id: string, payload: any, isSecured?: boolean): Observable<Response>;
    delete$(url: string,id: string, isSecured?: boolean): Observable<Response>;
}

/** Base Service Definition */
export class APIService implements HttpServices {
    public baseUrl: string = '/api/';
    public options: RequestOptions;

    private httpService: Http;
   // private requestUrl: string;

    /** Base Service constructor : Accepts Analytics Service, Http Service, Context path, Log service */
    constructor(_httpService: Http) {
        this.httpService = _httpService;
        //this.requestUrl = this.baseUrl.concat(_context);
    }
    /**
     * Get Single object using get$ method. 
     * @input id :  of the object for which you need a data 
     * @input isSecured : Optional Parameter : Parameter to tell base service if security headers needs to be included
     */
    get$(url:string, id: string, isSecured?: boolean): Observable<Response> {
        let requestUrl= this.baseUrl.concat(url);
        this.getHeaders(isSecured);
        return this.httpService.get(requestUrl + '/' + id, this.options).catch(err => {
            return this.handleError(err);
        });
    }
    /**
     * Get List of Objects using getList$ method.
     * @input pageNum : Optional parameter,
     * @input pageSize : Optional Parameter,
     * @isSecured : Optional Parameter : Parameter to tell base service if security headers nedds to be included 
     */
    getList$(url: string,pageNum?: number, pageSize?: number, isSecured?: boolean): Observable<Response> {
        let requestUrl= this.baseUrl.concat(url);
        this.getHeaders(isSecured);
        return this.httpService.get(requestUrl, this.options).catch(err => {
            return this.handleError(err);
        });
    }
    /**
     * Get list of child objects using getChildList$
     * @input : childName : string
     * @input pageNum : Optional parameter,
     * @input pageSize : Optional Parameter,
     * @isSecured : Optional Parameter : Parameter to tell base service if security headers nedds to be included   
     */
    getChildList$(url: string,childName: string, pageNum?: number, pageSize?: number, isSecured?: boolean) {
        let requestUrl= this.baseUrl.concat(url);
        this.getHeaders(isSecured);
        return this.httpService.get(requestUrl + '/' + childName, this.options).catch(err => {
            return this.handleError(err);
        });

    }
    /**
     * Send data to server using post$ method
     * @input payload : data to be sent, 
     * @isSecured : Optional Parameter : Parameter to tell base service if security headers nedds to be included
     */
    post$(url: string,payload: string, isSecured?: boolean): Observable<Response> {
        let requestUrl= this.baseUrl.concat(url);
        this.getHeaders(isSecured);
        return this.httpService.post(requestUrl, payload, this.options).catch(err => {
            return this.handleError(err);
        });
    }
    /**
    * Send data to server for updating existing object using post$ method
    * @input id : ID of the object to be updated
    * @input payload : data to be sent, 
    * @isSecured : Optional Parameter : Parameter to tell base service if security headers nedds to be included
    */
    put$(url: string,id: string, payload: any, isSecured?: boolean) {
        let requestUrl= this.baseUrl.concat(url);
        this.getHeaders(isSecured);
        return this.httpService.put(requestUrl, payload, this.options).catch(err => {
            return this.handleError(err);
        });
    }
    /**
     * Delete Object from server using delete$ method
     * @input id : ID of the object to be deleted
     * @isSecured : Optional Parameter : Parameter to tell base service if security headers nedds to be included
     */
    delete$(url: string,id: string, isSecured?: boolean) {
        let requestUrl= this.baseUrl.concat(url);
        this.getHeaders(isSecured);
        return this.httpService.delete(requestUrl + '/' + id, this.options).catch(err => {
            return this.handleError(err);
        });
    }

    /**
     * Method For handling Error in Http request
     */
    protected handleError(error: Response | any): Observable<any> {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
    /** 
     * Method for Including Headers 
     */
    private getHeaders(isSecured?: boolean): void {
        let headers = new Headers({});
        if (isSecured) {
            headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
        }
        this.options = new RequestOptions({ headers: headers });
    }
}
