import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { RecurrenceModalPage } from '../recurrence-modal/recurrence-modal';

import * as moment from 'moment';

/*
  Generated class for the AddEditConferenceBooking page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-edit-conference-booking',
  templateUrl: 'add-edit-conference-booking.html'
})
export class AddEditConferenceBookingPage {
  /** Get with Master API call */
  attendeeList: any[];
  roomList: any[];
  splTreatmentItems: any[];

  attendeeName: string;
  conferenceTitle: string;
  start: any;
  end: any;
  isAllDay: boolean;
  isDeleted: boolean;
  specialTreatment: any;
  specialComments: any;
  conferenceRoom: any;
  guestCount: number;
  title: string;
  otherNotes: string;
  constructor(public navCtrl: NavController, public navParams: NavParams
    , public modalCtrl: ModalController
  ) {
    this.attendeeName = this.conferenceTitle = '';
    this.isAllDay = this.isDeleted = false;
    this.attendeeList = [];
    this.roomList = [
      {
        ID: 1,
        Name: 'Bahamas',
        Color: '#E7C5F5'
      }, {
        ID: 2,
        Name: 'Dubai',
        Color: '#3FABA4'
      }, {
        ID: 3,
        Name: 'Cape Town',
        Color: '#35AA47'
      }, {
        ID: 4,
        Name: 'Hong Kong',
        Color: '#FF9655'
      }, {
        ID: 5,
        Name: 'Caribbean',
        Color: '#8877A9'
      }, {
        ID: 6,
        Name: 'Houston	',
        Color: '#428BCA'
      }, {
        ID: 7,
        Name: 'Barcelona',
        Color: '#D05454'
      }, {
        ID: 8,
        Name: 'Trainning Room',
        Color: '#DFBA49'
      }];
    this.splTreatmentItems = [
      'Water',
      'Tea',
      'Coffee',
      'Juice',
      'Snacks',
      'Breakfast',
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddEditConferenceBookingPage');
    this.start = this.end = moment(this.navParams.data.date._d).toISOString();
    console.log(this.navParams.data.date._d);
  }

  deleteAttendee(i) {
    this.attendeeList.splice(i, 1);
  }
  addAttendees(person) {
    this.attendeeList.push(person);
    this.attendeeName = '';
  }

  recurrenceClicked() {
    let modal = this.modalCtrl.create(RecurrenceModalPage, { params: null });
    modal.onDidDismiss(data => {
      console.log(data);
    });
    modal.present();
  }
  specialTreatmentChanged(specialTreatment) {
    console.log(specialTreatment);
  }

  submit() {
    // this.navCtrl.pop();
    console.log('start',this.start,'end', this.end, 'title',this.title, 'attendee count', this.attendeeList.length, 'conferenceRoom', this.conferenceRoom,'other notes', this.otherNotes,'isAllDay',this.isAllDay,'specialTreatment', this.specialTreatment, 'specialComments', this.specialComments, 'guestCount', this.guestCount, 'isDeleted', this.isDeleted);
  }

}
