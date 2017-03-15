import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { LeaveService } from '../index';
import { Observable } from 'rxjs/Rx';
import { Leave } from '../models/leave';
import { LeaveDetail } from '../models/leaveDetail';
import { MyEvent } from '../models/holiday';
import { MyLeaveDetailPage } from '../my-leave-detail/my-leave-detail';
import { AlertController, ItemSliding } from 'ionic-angular';
import { SpinnerService } from '../../../providers/index';
import { Events } from 'ionic-angular';
import { Toast } from 'ionic-native';
import * as moment from 'moment/moment';

import { ApplyForLeavePage } from '../apply-for-leave/apply-for-leave';
import { MyLeavesFilterPage } from '../my-leaves-filter/my-leaves-filter';

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
  public approvedLeaveCount: number;
  public isDescending: boolean = true;
  public isFirstTimeLoad: boolean = true;
  public isAllDataLoaded: boolean = false;
  events: any[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public leaveService: LeaveService,
    public spinnerService: SpinnerService,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public leaveChangeEvent: Events) {

    this.leaveChangeEvent.subscribe('Delected Leave', () => {
      this.getMyLeaves();
    });

    this.leaveChangeEvent.subscribe('Applied Leave', () => {
      this.getMyLeaves();
    });
  }

  ionViewDidLoad() {
    //this.leaveObs = this.leaveService.getMyLeaves();
    this.getMyLeaves();
  }
  ionViewWillEnter() {

  }

  ionViewWillUnload() {
    this.leaveChangeEvent.unsubscribe('Delected Leave');
    this.leaveChangeEvent.unsubscribe('Applied Leave');
  }

  goToLeaveDetail(leaveData: any) {
    // go to the session detail page
    // and pass in the session data
    //this.navCtrl.push(SessionDetailPage, sessionData);
    this.navCtrl.push(MyLeaveDetailPage, { leaveid: leaveData.LeaveRequestMasterId, leave: leaveData });
  }
  /* Get My Leaves */

  getMyLeaves() {
    this.isAllDataLoaded = false;
    this.leaveObs = [];
    this.events = [];
    this.approvedLeaveCount = 0;
    this.spinnerService.createSpinner('Please wait');
    this.leaveService.getMyLeaves().subscribe(
      (res: any) => {
        this.spinnerService.stopSpinner();
        this.leaveObs = res;
        this.leaveObs.reverse();
        this.leaveObs.forEach(element => {
          var sdate = moment(element.StartDate).format('YYYY-MM-DD');
          var edate = moment(element.EndDate).format('YYYY-MM-DD');
          element.StartDate = moment(sdate).toDate();
          element.EndDate = moment(edate).toDate();
          if (element.Status == 'Approved')
            this.approvedLeaveCount++;
        });
        this.leaveService.setApprovedLeavesCount(this.approvedLeaveCount.toString());
        this.getCalandarEvents();
      });
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
    this.isAllDataLoaded = true;
  }

  cancelClicked() {
    let leaveTobeCancelled = {
      Status: 'Cancelled',
      LeaveRequestMasterId: this.selectedLeave.LeaveRequestMasterId,
      ID: this.selectedLeave.ID
    };
    this.leaveService.deleteLeaveRecord(leaveTobeCancelled).subscribe(res => {
      if (res) {
        //this.getMyLeaves();
        this.showToast('Leave Canceled');
      } else {
        this.showToast('Failed to cancel leave');
      }
    });
  }


  cancelLeave(slidingItem: ItemSliding, leaveData: any) {
    this.selectedLeave = leaveData;
    slidingItem.close();
    this.showConfirm();
  }

  handleScrollCalender(event: any) {
    console.log('scrolled calender');
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
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.cancelClicked();
          }
        }
      ]
    });
    confirm.present();
  }
  onFilter() {
    let modal = this.modalCtrl.create(MyLeavesFilterPage);
    modal.present();
  }
  onSort() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sort Your Leaves',
      buttons: [
        {
          text: 'Date Ascending',
          role: 'date ascending',
          handler: () => {
            if (this.isDescending === false) {
              this.leaveObs.reverse();
              this.isDescending = true;
            }
          }
        }, {
          text: 'Date Descending',
          role: 'date descending',
          handler: () => {
            if (this.isDescending) {
              this.leaveObs.reverse();
              this.isDescending = false;
            }
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

  showToast(message: string) {
    Toast.show(message, '5000', 'center').subscribe(
      toast => {
        //console.log(toast);
      }
    );
  }

  // Lazy Loading Functionality. TO DO:need to get only limited data from back end
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.leaveService.getMyLeaves().subscribe(
        (res: any) => {
          for (let i = 0; i < res.length; i++) {
            this.leaveObs.push(res[i]);
          }
        });
      infiniteScroll.complete();
    }, 500);
  }
}
