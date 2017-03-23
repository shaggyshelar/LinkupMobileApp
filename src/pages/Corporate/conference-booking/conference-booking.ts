import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { AddEditConferenceBookingPage } from '../add-edit-conference-booking/add-edit-conference-booking';

@Component({
    selector: 'page-conference-booking',
    templateUrl: 'conference-booking.html'
})
export class ConferenceBookingPage {
    conferenceBookings: any[];
    header: any;
    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.conferenceBookings = [
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
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'agendaWeek,agendaDay'
        };
    }

    ionViewDidLoad() {
        /** TODO: API call get all conference bookings */
    }

    handleDayClick(event) {
        console.log('Day Click', event);
        this.navCtrl.push(AddEditConferenceBookingPage, event);
    }

    handleScrollCalender(event) {
        console.log('Scroll', event);
    }

    handleEventClick(event) {
        console.log('Event', event);
    }

    goToLeaveDetail() {

    }

}
