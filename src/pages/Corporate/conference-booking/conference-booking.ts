import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import * as moment from 'moment';

import { AddEditConferenceBookingPage } from '../add-edit-conference-booking/add-edit-conference-booking';

import { ConferenceBookingService } from '../index';

@Component({
    selector: 'page-conference-booking',
    templateUrl: 'conference-booking.html'
})
export class ConferenceBookingPage {
    conferenceBookings: any[];
    header: any;
    constructor(public navCtrl: NavController, public navParams: NavParams
        , public confBookingService: ConferenceBookingService
        , public loadingCtrl: LoadingController
    ) {
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'agendaWeek,agendaDay'
        };
    }

    ionViewDidLoad() {
        /** TODO: API call get all conference bookings */
        var loader = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loader.present().then(() => {
            this.confBookingService.getConferenceBookings().subscribe(res => {
                this.conferenceBookings = res;
                loader.dismiss();
            }, err => {
                loader.dismiss();
            });
        });
    }

    handleDayClick(event) {
        this.navCtrl.push(AddEditConferenceBookingPage, event);
    }

    handleScrollCalender(event) {
    }

    handleEventClick(event) {
    }

    goToLeaveDetail() {

    }

}
