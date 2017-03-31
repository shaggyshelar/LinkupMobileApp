import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { RecurrenceModalPage } from '../recurrence-modal/recurrence-modal';
import { ConferenceBookingMasterService } from '../../../providers/shared/master/conferenceBooking.service';

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

  bookConfForm: FormGroup

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
    , public confMasterService: ConferenceBookingMasterService
    , public loadingCtrl: LoadingController
    , public formBuilder: FormBuilder
  ) {
    this.attendeeName = this.conferenceTitle = '';
    this.isAllDay = this.isDeleted = false;
    this.attendeeList = [];
    this.bookConfForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      conferenceRoom: ['', [Validators.required]],
      otherNotes: ['', [Validators.required, Validators.minLength(3)]],
      allDayEvent: [false, [Validators.required]],
      specialTreatmentItems: [],
      specialComments: ['', [Validators.required]],
      numberOfGuests: ['', Validators.pattern('[0-9]+')],
      isDeleted: [false]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddEditConferenceBookingPage');
    // this.start = this.end = moment(this.navParams.data.date._d).toISOString();
    this.bookConfForm.setValue({
      title: ''
      , from: moment(this.navParams.data.date._d).toISOString()
      , to: moment(this.navParams.data.date._d).toISOString()
      , conferenceRoom: ''
      , otherNotes: ''
      , allDayEvent: false
      , specialTreatmentItems: []
      , specialComments: ''
      , numberOfGuests: ''
      , isDeleted: false
    });
    console.log(this.navParams.data.date._d);
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present().then(() => {
      this.confMasterService.getRoomsList().subscribe(res => {
        this.roomList = res;
      }, err => {
        console.log(err);
        loader.dismiss();
      });
      this.confMasterService.getSpecialTreatmentList().subscribe(res => {
        this.splTreatmentItems = res;
        loader.dismiss();
      }, err => {
        loader.dismiss();
      });
    });
  }

  deleteAttendee(i) {
    this.attendeeList.splice(i, 1);
  }
  addAttendees(person) {
    this.attendeeList.push(person);
    this.attendeeName = '';
  }

  recurrenceClicked() {
    let modal = this.modalCtrl.create(RecurrenceModalPage, { params: { start: this.start } });
    modal.onDidDismiss(data => {
      console.log(data);
    });
    modal.present();
  }
  specialTreatmentChanged(specialTreatment) {
    console.log(specialTreatment);
  }

  submit() {
    this.navCtrl.pop();
  }

  textChanged(changeEvent) {
  }

}
