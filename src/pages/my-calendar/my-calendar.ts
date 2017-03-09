import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HolidaysPage } from '../LeaveManagement/holidays/holidays';
import { MyLeavesPage } from '../LeaveManagement/my-leaves/my-leaves';
import { CacheService } from 'ng2-cache/ng2-cache';

@Component({
  selector: 'page-my-calendar',
  templateUrl: 'my-calendar.html'
})
export class MyCalendarPage {
  events: any[];
  holidaysTab: any;
  myLeavesTab: any;
  pendingHolidayCount:string;
  leaveApprovedCount:string;
  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  public _cacheService:CacheService) {
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
    this.pendingHolidayCount ='';
    if (this._cacheService.exists('PendingHolidayCount')) {
        this.pendingHolidayCount = this._cacheService.get('PendingHolidayCount');
        
    };
    if (this._cacheService.exists('approvedLeaveCount')) {
        this.leaveApprovedCount = this._cacheService.get('approvedLeaveCount');
        
    };
  }

}
