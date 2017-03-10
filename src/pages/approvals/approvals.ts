import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    public _cacheService: CacheService) {
    this.leavesTab = LeaveApprovalPage;
    this.timesheetsTab = ApproveTimesheetPage;
  }

  ionViewDidLoad() {

    if (this._cacheService.exists('PendingLeavesApprovalCount')) {
      this.leavesToApproveCount = this._cacheService.get('PendingLeavesApprovalCount');

    };

    if (this._cacheService.exists('PendingLeavesApprovalCount')) {
    this.approveTimesheetsBadgeCount = parseInt(localStorage.getItem('approveTimesheetsBadgeCount'));
    }

  }



}
