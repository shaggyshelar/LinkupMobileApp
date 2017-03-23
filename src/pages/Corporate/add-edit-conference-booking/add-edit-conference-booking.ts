import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { RecurrenceModalPage } from '../recurrence-modal/recurrence-modal';

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
  attendeeList: any[];
  roomList: any[];
  items: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams
  , public modalCtrl: ModalController
  ) {
    this.attendeeList = [
      'Mahesh',
      'Chetan',
      'Sagar',
      'Sal'
    ];
    this.roomList = [
      'Barcelona',
      'Training Room'
    ];
    this.items = [
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
  }

  deleteAttendee(i) {
    this.attendeeList.splice(i, 1);
  }

  recurrenceClicked() {
    let modal = this.modalCtrl.create(RecurrenceModalPage, { params: null});
    modal.onDidDismiss(data => {
      console.log(data);
    });
    modal.present();
  }

}
