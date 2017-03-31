/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Third Party Dependencies */
import { CacheService } from 'ng2-cache/ng2-cache';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import * as moment from 'moment';

/** Module Level Dependencies */
import { BaseService } from '../../../providers/shared';
import { MessageService } from '../../../providers/shared';
/** Context for service calls */
const CONTEXT = 'Timesheets';

/** Service Definition */
@Injectable()
export class ConferenceBookingService extends BaseService {

    conferenceBookings = [
        {
            Id: 1,
            'title': 'Inteview',
            'start': moment().add(2, 'hours'),
            'end': moment().add(4, 'hours'),
            'Room': {
                'Color': '#8877A9',
                'Name': 'Caribbean'
            },
            'color': '#8877A9',
            'Attendees': 'xyz'
        },
        {
            Id: 2,
            'title': 'Jenzabar Client call',
            'start': moment(),
            'end': moment().add(3, 'hours'),
            'Room': {
                'Color': '#3FABA4',
                'Name': 'Dubai'
            },
            'color': '#3FABA4',
            'Attendees': 'xyz'

        },
        {
            Id: 3,
            'title': 'Product Meeting',
            'start': moment().subtract(3, 'hours'),
            'end': moment().subtract(1, 'hours'),
            'Room': {
                'Color': '#FF9655',
                'Name': 'Hong Kong'
            },
            'color': '#FF9655',
            'Attendees': 'xyz'

        },
        {
            Id: 4,
            'title': 'Tccc client call',
            'start': moment().subtract(3, 'hours'),
            'end': moment().subtract(2, 'hours'),
            'Room': {
                'Color': '#3FABA4',
                'Name': 'Dubai'
            },
            'color': '#3FABA4',
            'Attendees': 'xyz'

        },
        {
            Id: 5,
            'title': 'Standup Meeting',
            'start': moment().add(1, 'd').subtract(3, 'hours'),
            'end': moment().add(1, 'd').subtract(1, 'hours'),
            'Room': {
                'Color': '#E7C5F5',
                'Name': 'Bahamas'
            },
            'color': '#E7C5F5',
            'Attendees': 'xyz'
        },
        {
            Id: 6,
            'title': 'NGO/NPO Meeting',
            'start': moment().add(1, 'd').subtract(3, 'hours'),
            'end': moment().add(1, 'd').subtract(2, 'hours'),
            'Room': {
                'Color': '#8877A9',
                'Name': 'Caribbean'
            },
            'color': '#8877A9',
            'Attendees': 'xyz'
        },
        {
            Id: 7,
            'title': 'Conference',
            'start': moment().subtract(1, 'd').subtract(3, 'hours'),
            'end': moment().subtract(1, 'd').subtract(2, 'hours'),
            'Room': {
                'Color': '#D05454',
                'Name': 'Barcelona'
            },
            'color': '#D05454',
            'Attendees': 'xyz'
        },
        {
            Id: 8,
            'title': 'Interview',
            'start': moment().subtract(1, 'd'),
            'end': moment().subtract(1, 'd').add(3, 'hours'),
            'Room': {
                'Color': '#DFBA49',
                'Name': 'Training Room'
            },
            'color': '#DFBA49',
            'Attendees': 'xyz'
        }
    ];

    constructor(public http: Http, messageService: MessageService, public _cacheService: CacheService
    ) {
        super(http, CONTEXT);
    }

    getConferenceBooking(id: any): Observable<any> {
        // if (this._cacheService.exists('logATicketData')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('logATicketData'));
        //     });
        // } else {
        //     return this.get$('Edit/' + id, true).map(res => {
        //         this._cacheService.set('Edit' + id, res.json(), { maxAge: 60 * 60 * 24 });
        //         return res.json();
        //     }).catch(err => {
        //         return this.handleError(err);
        //     });
        // }
        /** Stub */
        var index = _.findIndex(this.conferenceBookings, { Id: id });
        return new Observable<any>((observer: any) => {
            observer.next(this.conferenceBookings[index]);
        });
    }
    getConferenceBookings(): Observable<any> {
        // if (this._cacheService.exists('logATicketData')) {
        //     return new Observable<any>((observer: any) => {
        //         observer.next(this._cacheService.get('logATicketData'));
        //     });
        // } else {
        //     return this.get$('Edit/' + id, true).map(res => {
        //         this._cacheService.set('Edit' + id, res.json(), { maxAge: 60 * 60 * 24 });
        //         return res.json();
        //     }).catch(err => {
        //         return this.handleError(err);
        //     });
        // }
        /** Stub */
        return new Observable<any>((observer: any) => {
            observer.next(this.conferenceBookings);
        });
    }

    addConferenceBookings(payload: any): Observable<any> {
        // return this.post$(payload).map(res => { return res});
        return new Observable<any>((observer: any) => {
            observer.next({ message: 'Ok' });
        });
    }
}