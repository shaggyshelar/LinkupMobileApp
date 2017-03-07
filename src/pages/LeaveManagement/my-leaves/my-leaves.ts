import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LeaveService } from '../index';
import { Observable } from 'rxjs/Rx';
import { Leave } from '../models/leave';
import { LeaveDetail } from '../models/leaveDetail';
import { MyEvent } from '../models/holiday';
import { AlertController, ItemSliding } from 'ionic-angular';
import * as moment from 'moment/moment';

@Component({
  selector: 'page-my-leaves',
  templateUrl: 'my-leaves.html'
})
export class MyLeavesPage {
  public leaveObs: Leave[];
  public leaveDetObs: Observable<LeaveDetail>;
  public leaveDetail: LeaveDetail;
  events: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public leaveService: LeaveService,
    public alertCtrl: AlertController) {
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
    //this.leaveObs = this.leaveService.getMyLeaves();
    this.leaveObs = [];
    this.leaveService.getMyLeaves().subscribe(
      (res:any) => {
        console.log("Data from server", res); 
        this.leaveObs = res;
        this.leaveObs.reverse();
      });
    console.log('ionViewDidLoad MyLeavesPage');
  }

  ionViewWillUnload() {
    // stop disconnect watch
  }

  goToLeaveDetail(leaveData: any) {
    // go to the session detail page
    // and pass in the session data
    //this.navCtrl.push(SessionDetailPage, sessionData);
  }

  editLeave(slidingItem: ItemSliding, leaveData: any) {
    let alert = this.alertCtrl.create({
      title: 'Edit Leave',
      buttons: [{
        text: 'OK',
        handler: () => {
          // close the sliding item
          slidingItem.close();
        }
      }]
    });
    alert.present();
  }

  handleDayClick(event: any) {
    alert(' Show Apply Leave Page');
  }
}
