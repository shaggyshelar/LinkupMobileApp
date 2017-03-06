import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HolidaysPage } from '../LeaveManagement/holidays/holidays';
import { MyLeavesPage } from '../LeaveManagement/my-leaves/my-leaves';

@Component({
  selector: 'page-my-calendar',
  templateUrl: 'my-calendar.html'
})
export class MyCalendarPage {
  events: any[];
  holidaysTab: any;
  myLeavesTab: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.holidaysTab = HolidaysPage;
    this.myLeavesTab = MyLeavesPage;

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
    console.log('ionViewDidLoad MyCalendarPage');
  }

}
