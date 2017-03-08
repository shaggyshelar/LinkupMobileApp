/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Third Party Dependencies */
import { CacheService } from 'ng2-cache/ng2-cache';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/** Module Level Dependencies */
import { BaseService } from '../../../providers/index';
import { Holiday } from '../models/holiday';
// import { Employee } from '../models/employee';

/** Context for service calls */
const CONTEXT = 'Holiday';

/** Service Definition */
@Injectable()
export class HolidayService extends BaseService {

    constructor(public http: Http,private _cacheService: CacheService) {
        super(http, CONTEXT);
    }

    /**
     * getHolidays method
     * Gets array of Holiday objects
     */
    getHolidays(): Observable<Holiday> {
         if (this._cacheService.exists('holidayList')) {
            return new Observable<any>((observer: any) => {
                observer.next(this._cacheService.get('holidayList'));
            });
        } else {
            return this.getList$(0, 0, true).map(res => {
                this._cacheService.set('holidayList', res.json(), { maxAge: 60 * 60 });
                return res.json();
            }).catch(err => {
                return this.handleError(err);
            });
        }
    }

    getHolidayByFinancialYear(id: string) {
        if (this._cacheService.exists('holidayByFinancialYear' + id)) {
            return new Observable<any>((observer: any) => {
                observer.next(this._cacheService.get('holidayByFinancialYear' + id));
            });
        } else {
            return this
                .get$(id, true)
                .map(res => {
                    this._cacheService.set('holidayByFinancialYear' + id, res.json(), { maxAge: 60 * 60 });
                    return res.json();
                })
                .catch(err => {
                    return this.handleError(err);
                });
        }
    }


}
