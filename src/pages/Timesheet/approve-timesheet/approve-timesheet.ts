import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { ApproveTimesheetDetailsPage } from '../approve-timesheet-details/approve-timesheet-details';

import { EmployeeTimesheetService } from '../index';
import { EmployeeTimeSheet } from '../models/employee-timesheet.model';


@Component({
  selector: 'page-approve-timesheet',
  templateUrl: 'approve-timesheet.html'
})
export class ApproveTimesheetPage {
  origin: String = '';
  public isBulkApprovePermission:boolean = false;
  public timesheetID: string;
  public timesheetObs: Observable<EmployeeTimeSheet[]>;
  public pendingtimesheetsArray: EmployeeTimeSheet[];
  public timesheetList: EmployeeTimeSheet[];
  public userPermissions: any[];
  public selectedTimesheetID: string;
  public isMoreclicked: boolean;
  public isHrApprove: boolean;
  public selectedEmployees: any[];
  public comment: string;
  public isDescending: boolean=true;
  public editMode: boolean;
  public isSelectall:boolean = false;
  public isshowApproveRejectItems = false;

  public approveEmployee: Observable<EmployeeTimesheetService>;

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , private employeeTimesheetService: EmployeeTimesheetService
    , public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() { }

  ionViewDidEnter() {
    this.decideAction();
  }

  decideAction() {
    switch (this.navParams.data.caller) {
      case 'my-timesheet':
        console.log('my-timesheet => approve-timesheets');
        this.getUserData();
        break;
      case 'enter-timesheet':
        console.log('enter timesheet => approve-timesheets');
        break;

      default:
        console.log('unknown caller => approve-timesheets');
        this.getApproverData();
        break;
    }
  }


  getUserData() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.employeeTimesheetService.getMyTimesheets().subscribe((res: any) => {
        if (res.length > 0) {
          this.approveEmployee = res.reverse();
          //console.log(res);
        }
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });
  }

  getApproverData() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.employeeTimesheetService.getApproverApprovedTimesheets().subscribe((res: any) => {
        if (res.length > 0) {
          this.approveEmployee = res.reverse();
          //console.log(res);
          localStorage.setItem('approveTimesheetsBadgeCount', res.length);
        }
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });
  }

  getPendingApproverData() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.employeeTimesheetService.getApproverPendingTimesheets().subscribe((res: any) => {
        if (res.length > 0) {
          this.pendingtimesheetsArray = res.reverse();
          //console.log(res);
          localStorage.setItem('approveTimesheetsBadgeCount', res.length);
        }
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });
  }

  itemTapped(entry) {
    this.navCtrl.push(ApproveTimesheetDetailsPage, { id: entry.ID, caller: 'approve-timesheet' });
  }

  /** Bulk Timesheet Approval functionality */

    /** Bulk Approval */

  /** Multiselction of List item */

  longPressedItem(leave: any)
  {
  this.isshowApproveRejectItems = true;
  this.selectLeave(leave,true);
  }

  editTimsheet() {
    this.editMode = !this.editMode;
    if(this.editMode == false)
    {
      this.isshowApproveRejectItems = false;
      this.selectedEmployees = [];
     this.pendingtimesheetsArray.forEach(leave => {
          this.selectLeave(leave,false);
        });
    }
    
  }

  selectAllLeaves()
  {
    this.selectedEmployees = [];
     this.pendingtimesheetsArray.forEach(leave => {
          this.selectLeave(leave,true);
        });
  }

   selectLeave(leave:any ,checked:boolean)
  {
     if(checked == false)
    {
      var index : number = 0;
      this.pendingtimesheetsArray.forEach(leaves => {
          if(leaves == leave)
          {
            var sindex = this.selectedEmployees.indexOf(leave);
            this.selectedEmployees.splice(sindex,1);
          }
          index ++;
        });
      leave.selectionColor = "white";
      leave.selected = false;
      if(this.selectedEmployees.length == 0)
      this.isshowApproveRejectItems = false;
    }
    else
    {
      this.selectedEmployees.push(leave);
      leave.selectionColor = "#8ea3c5";
      leave.selected = true;
    }
   this.setboolean();
  }
  setboolean()
  {
    this.leavechecked = false;
    this.isSelectall = false;
    if(this.selectedEmployees && this.selectedEmployees.length > 0)
    {
      this.leavechecked = true;

      var count : number = 0;
      this.leavesArray.forEach(leaves => {
          count ++;
        });
      if(count == this.selectedEmployees.length)
        {
          this.isSelectall = true;
        }
    }
  }

}
