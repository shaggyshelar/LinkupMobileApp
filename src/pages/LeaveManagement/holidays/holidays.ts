import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Holidays page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-holidays',
  templateUrl: 'holidays.html'
})
export class HolidaysPage {
  events: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.events = [
      {
        "title": "All Day Event",
        "start": "2017-02-01"
      },
      {
        "title": "Long Event",
        "start": "2017-02-07",
        "end": "2017-02-10"
      },
      {
        "title": "Repeating Event",
        "start": "2017-02-09T16:00:00"
      },
      {
        "title": "Repeating Event",
        "start": "2017-02-16T16:00:00"
      },
      {
        "title": "Conference",
        "start": "2017-02-11",
        "end": "2017-02-13"
      }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HolidaysPage');
  }

}
