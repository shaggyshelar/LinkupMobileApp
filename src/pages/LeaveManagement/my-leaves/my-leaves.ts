import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LeaveService } from '../index';
import { Observable } from 'rxjs/Rx';
import { Leave } from '../models/leave';
import { LeaveDetail } from '../models/leaveDetail';
import { MyEvent } from '../models/holiday';
import { MyLeaveDetailPage } from '../my-leave-detail/my-leave-detail';
import { AlertController, ItemSliding } from 'ionic-angular';
import { SpinnerService } from '../../../providers/index';
import * as moment from 'moment/moment';

import { ApplyForLeavePage } from '../apply-for-leave/apply-for-leave';

@Component({
  selector: 'page-my-leaves',
  templateUrl: 'my-leaves.html',
  providers: [LeaveService, SpinnerService]
})
export class MyLeavesPage {

  public leaveObs: Leave[];
  public leaveDetObs: Observable<LeaveDetail>;
  public leaveDetail: LeaveDetail;
  public selectedLeave: any;
  public approvedLeaveCount:number;
  events: any[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public leaveService: LeaveService,
    public spinnerService: SpinnerService,
    public alertCtrl: AlertController) {
    // this.events = [
    //   {
    //     "title": "All Day Event",
    //     "start": "2017-02-01"
    //   },
    //   {
    //     "title": "Long Event",
    //     "start": "2017-02-07",
    //     "end": "2017-02-10"
    //   },
    //   {
    //     "title": "Repeating Event",
    //     "start": "2017-02-09T16:00:00"
    //   },
    //   {
    //     "title": "Repeating Event",
    //     "start": "2017-02-16T16:00:00"
    //   },
    //   {
    //     "title": "Conference",
    //     "start": "2017-02-11",
    //     "end": "2017-02-13"
    //   }
    // ];
  }

  ionViewDidLoad() {
    //this.leaveObs = this.leaveService.getMyLeaves();
    this.getMyLeaves();
  }

  ionViewWillUnload() {
    // stop disconnect watch
  }

  goToLeaveDetail(leaveData: any) {
    // go to the session detail page
    // and pass in the session data
    //this.navCtrl.push(SessionDetailPage, sessionData);
    this.navCtrl.push(MyLeaveDetailPage, { leaveid: leaveData.LeaveRequestMasterId, leave: leaveData });
  }
  /* Get My Leaves */

  getMyLeaves() {
    this.leaveObs = [];
    this.events = [];
    this.approvedLeaveCount = 0;
    this.spinnerService.createSpinner('Please wait');
    this.leaveService.getMyLeaves().subscribe(
      (res: any) => {
        this.spinnerService.stopSpinner();
        console.log("Data from server", res);
        this.leaveObs = res;
        this.leaveObs.reverse();
        this.leaveObs.forEach(element => {
          var sdate = moment(element.StartDate).format('YYYY-MM-DD');
          var edate = moment(element.EndDate).format('YYYY-MM-DD');
          element.StartDate = moment(sdate).toDate();
          element.EndDate = moment(edate).toDate();
        });
        this.getCalandarEvents();
      });
    console.log('ionViewDidLoad MyLeavesPage');
  }

  /*Create events to show on calendar */
  getCalandarEvents() {
    for (let i = 0; i < this.leaveObs.length; i++) {
      var event: MyEvent = new MyEvent();
      var leaveStatus: any = this.leaveObs[i].Status;
      event.start = moment(this.leaveObs[i].StartDate).format('YYYY-MM-DD');
      event.end = moment(this.leaveObs[i].EndDate).format('YYYY-MM-DD');
      event.title = 'Leave';
      event.ID = this.leaveObs[i].LeaveRequestMasterId;

      if (leaveStatus == 'Pending')
        event.color = '#FED035';
      else if (leaveStatus == 'Cancelled')
        event.color = 'black';
      else if (leaveStatus == 'Approved')
        event.color = '#69BB7B';
      else if (leaveStatus == 'Rejected')
        event.color = '#FE4C52';

      this.events.push(event);
    }
  }

  cancelClicked() {
    let leaveTobeCancelled = {
      Status: 'Cancelled',
      LeaveRequestMasterId: this.selectedLeave.LeaveRequestMasterId,
      ID: this.selectedLeave.ID
    };
    this.leaveService.deleteLeaveRecord(leaveTobeCancelled).subscribe(res => {
      if (res) {

      } else {

      }
    });
  }


  cancelLeave(slidingItem: ItemSliding, leaveData: any) {
    this.selectedLeave = leaveData;
    slidingItem.close();
    this.showConfirm();
  }

  handleDayClick(event: any) {
    // alert(' Show Apply Leave Page');
    this.navCtrl.push(ApplyForLeavePage, { date: event.date._d });
  }

  handleEventClick(event: any) {
    // 
    var selectedleave: any;
    this.leaveObs.forEach(element => {
      if (event.calEvent.ID == element.LeaveRequestMasterId) {
        selectedleave = element;
      }
    });
    this.navCtrl.push(MyLeaveDetailPage, { leaveid: event.calEvent.ID, leave: selectedleave });
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Leave',
      message: 'Do you want to cancel selected leave?',
      buttons: [
        {
          text: 'NO',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'YES',
          handler: () => {
            console.log('Agree clicked');
            this.cancelClicked();
          }
        }
      ]
    });
    confirm.present();
  }
}
