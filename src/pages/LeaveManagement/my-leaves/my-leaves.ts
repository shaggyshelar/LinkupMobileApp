import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController, ToastController } from 'ionic-angular';
import { LeaveService } from '../index';
import { AuthService } from '../../../providers/index';
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
  public leavesReplicate: Leave[];
  public modifiedList: Leave[];
  public leaveDetObs: Observable<LeaveDetail>;
  public leaveDetail: LeaveDetail;
  public selectedLeave: any;
  public approvedLeaveCount: number;
  public isDescending: boolean = true;
  public isFirstTimeLoad: boolean = true;
  public isAllDataLoaded: boolean = false;
  public count: number = 0;
  public filterValues: any[];
  public isPullToRefresh: boolean = false;
  public isAuthorized: boolean;
  events: any[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public leaveService: LeaveService,
    public auth: AuthService,
    public spinnerService: SpinnerService,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public leaveChangeEvent: Events,
    public toastCtrl: ToastController) {
    this.isAuthorized = this.auth.checkPermission('LEAVE.MY_LEAVE.MANAGE');
    this.filterValues = [];
    this.filterValues.push({ rejectedStatus: true });
    this.filterValues.push({ cancelledStatus: true });
    this.filterValues.push({ approvedStatus: true });
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
    this.isPullToRefresh = false;
    this.isAllDataLoaded = false;
    this.leaveObs = [];
    this.leavesReplicate = [];
    this.events = [];
    this.approvedLeaveCount = 0;
    this.spinnerService.createSpinner('Please wait');
    this.leaveService.getMyLeaves(this.isPullToRefresh).subscribe(
      (res: any) => {
        this.spinnerService.stopSpinner();
        this.leaveObs = res;
        this.leavesReplicate = res;
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
        this.isAllDataLoaded = true;
      });
  }

  /**Pull To Refresh */
  doRefresh(refresher) {
    this.isPullToRefresh = true;
    this.isAllDataLoaded = false;
    this.leaveObs = [];
    this.leavesReplicate = [];
    this.events = [];
    this.approvedLeaveCount = 0;
    this.leaveService.getMyLeaves(this.isPullToRefresh).subscribe(
      (res: any) => {
        refresher.complete();
        this.leaveObs = res;
        this.leavesReplicate = res;
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
      if (this.leaveObs[i].StartDate === this.leaveObs[i].EndDate)
        event.end = moment(this.leaveObs[i].EndDate).format('YYYY-MM-DD');
      else if (this.leaveObs[i].StartDate !== this.leaveObs[i].EndDate)
        event.end = moment(this.leaveObs[i].EndDate).add(1, 'day').format('YYYY-MM-DD');
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
      ID: this.selectedLeave.ID,
      startdate: this.selectedLeave.StartDate,
      enddate: this.selectedLeave.EndDate,
      LeaveTotal: this.selectedLeave.LeaveTotal,
      FloatingHolidayTotal: this.selectedLeave.FloatingHolidayTotal,
      HalfdayLeaveTotal: this.selectedLeave.HalfdayLeaveTotal,
      AbsentTotal: this.selectedLeave.AbsentTotal,
      HalfdayAbsentTotal: this.selectedLeave.HalfdayAbsentTotal,
      MaternityLeaveTotal: this.selectedLeave.MaternityLeaveTotal,
      PaternityLeaveTotal: this.selectedLeave.PaternityLeaveTotal,
      MarriageLeaveTotal: this.selectedLeave.MarriageLeaveTotal,
    };
    this.leaveService.deleteLeaveRecord(leaveTobeCancelled).subscribe(res => {
      if (res) {
        //this.getMyLeaves();
        this.toastPresent('Leave Cancelled');
      } else {
        this.toastPresent('Failed to cancel leave');
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
    this.navCtrl.push(ApplyForLeavePage, { date: event.date._d });
  }

  handleEventClick(event: any) {
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
    let modal = this.modalCtrl.create(MyLeavesFilterPage, { filtervalue: this.filterValues });
    modal.present();
    modal.onDidDismiss(data => {
      if (data !== undefined) {
        if (data.length > 0) {
          this.leaveObs = [];
          this.modifiedList = [];
          this.filterValues = [];
          for (let index = 0; index < data.length; index++) {
            if (data[index].model === true) {
              this.modifiedList = this.leavesReplicate.filter((leave) => {
                return leave.Status == data[index].value;
              })
              this.leaveObs = this.leaveObs.concat(this.modifiedList);
              this.modifiedList = [];
              if (data[index].modelValue === 'rejectedStatus')
                this.filterValues.push({ rejectedStatus: true });
              if (data[index].modelValue === 'cancelledStatus')
                this.filterValues.push({ cancelledStatus: true });
              if (data[index].modelValue === 'approvedStatus')
                this.filterValues.push({ approvedStatus: true });
            }
            else {
              if (data[index].modelValue === 'rejectedStatus')
                this.filterValues.push({ rejectedStatus: false });
              if (data[index].modelValue === 'cancelledStatus')
                this.filterValues.push({ cancelledStatus: false });
              if (data[index].modelValue === 'approvedStatus')
                this.filterValues.push({ approvedStatus: false });
            }
          }
          if (this.filterValues[0].rejectedStatus === false && this.filterValues[1].cancelledStatus === false && this.filterValues[2].approvedStatus === false) {
            this.leaveObs = [];
            this.leaveObs = this.leaveObs.concat(this.leavesReplicate);
          }
        }
      }
    })
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

  toastPresent(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
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
    this.isPullToRefresh = false;
    setTimeout(() => {
      this.leaveService.getMyLeaves(this.isPullToRefresh).subscribe(
        (res: any) => {
          for (let i = 0; i < res.length; i++) {
            this.leaveObs.push(res[i]);
          }
        });
      infiniteScroll.complete();
    }, 500);
  }
}
