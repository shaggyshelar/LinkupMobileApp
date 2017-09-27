import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { LeaveApprovalPage } from '../LeaveManagement/leave-approval/leave-approval';
import { ApproveTimesheetPage } from '../Timesheet/approve-timesheet/approve-timesheet';
import { CacheService } from 'ng2-cache/ng2-cache';

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
  leavesToApproveCount: string
  approveTimesheetsBadgeCount: Number = 0;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public countChangedEvent: Events,
    public _cacheService: CacheService) {
    this.leavesTab = LeaveApprovalPage;
    this.timesheetsTab = ApproveTimesheetPage;
    this.leavesToApproveCount = localStorage.getItem('PendingLeavesApprovalCount');
    this.approveTimesheetsBadgeCount = parseInt(localStorage.getItem('PendingTimesheetApprovalCount'));
  }

  ionViewDidEnter() {
    this.countChangedEvent.subscribe('Hr Approval Leave changed', () => {
      this.leavesToApproveCount = localStorage.getItem('PendingLeavesApprovalCount');
    });
    this.countChangedEvent.subscribe('Bulk Approval Leave changed', () => {
      this.leavesToApproveCount = localStorage.getItem('PendingLeavesApprovalCount');
    });
    this.countChangedEvent.subscribe('Rejected single Leave', () => {
      this.leavesToApproveCount = localStorage.getItem('PendingLeavesApprovalCount');
    });
    this.countChangedEvent.subscribe('Approved single Leave', () => {
      this.leavesToApproveCount = localStorage.getItem('PendingLeavesApprovalCount');
    });
    this.countChangedEvent.subscribe('Timesheet Rejected', () => {
      this.approveTimesheetsBadgeCount = parseInt(localStorage.getItem('PendingTimesheetApprovalCount'));
    });
    this.countChangedEvent.subscribe('Timesheet Approved', () => {
      this.approveTimesheetsBadgeCount = parseInt(localStorage.getItem('PendingTimesheetApprovalCount'));
    });
  }

  ionViewDidLoad() {

    // if (this._cacheService.exists('PendingLeavesApprovalCount')) {
    //   this.leavesToApproveCount = this._cacheService.get('PendingLeavesApprovalCount');

    // };
    this.leavesToApproveCount = localStorage.getItem('PendingLeavesApprovalCount');
    this.approveTimesheetsBadgeCount = parseInt(localStorage.getItem('PendingTimesheetApprovalCount'));

  }

  ionViewWillUnload() {
    this.countChangedEvent.unsubscribe('Hr Approval Leave changed');
    this.countChangedEvent.unsubscribe('Bulk Approval Leave changed');
    this.countChangedEvent.unsubscribe('Rejected single Leave');
    this.countChangedEvent.unsubscribe('Approved single Leave');
  }



}
