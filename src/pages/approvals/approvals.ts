import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LeaveApprovalPage } from '../LeaveManagement/leave-approval/leave-approval';
import { ApproveTimesheetPage } from '../Timesheet/approve-timesheet/approve-timesheet';

/*
  Generated class for the Approvals page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-approvals',
  templateUrl: 'approvals.html'
})
export class ApprovalsPage {
  leavesTab: any;
  timesheetsTab: any;
  approveTimesheetsBadgeCount : Number = 0;

  timesheetBadgeShow : Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.leavesTab = LeaveApprovalPage;
    this.timesheetsTab = ApproveTimesheetPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApprovalsPage');
    console.log('badge storage => ',localStorage.getItem('approveTimesheetsBadgeCount'));
    this.approveTimesheetsBadgeCount = parseInt(localStorage.getItem('approveTimesheetsBadgeCount'));
    this.badgeUpdate();
  }

  badgeUpdate() {
    this.timesheetBadgeShow = this.approveTimesheetsBadgeCount > 0 ? true : false;
  }

}
