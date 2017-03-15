import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { ApproveTimesheetDetailsPage } from '../approve-timesheet-details/approve-timesheet-details';
import { EmployeeTimesheetService } from '../index';
import { AuthService } from '../../../providers/index';
import { EmployeeTimeSheet } from '../models/employee-timesheet.model';
import { AlertController } from 'ionic-angular';
import { ApproveTimesheetFilterPage } from '../approve-timesheet-filter/approve-timesheet-filter';
import { SpinnerService } from '../../../providers/index';

@Component({
  selector: 'page-approve-timesheet',
  templateUrl: 'approve-timesheet.html',
  providers: [EmployeeTimesheetService, SpinnerService, AuthService]
})
export class ApproveTimesheetPage {
  origin: String = '';


  public timesheetReport: any;
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
  public isDescending: boolean = true;
  public editMode: boolean;
  public isSelectall: boolean = false;
  public isshowApproveRejectItems = false;
  public isDataretrived: boolean = false;
  public isAuthorized: boolean;

  public timesheetchecked : boolean = false;
  public selectedLeaveID:string;
  public approveEmployee: Observable<EmployeeTimesheetService>;
  public noResponseMsg: String;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private employeeTimesheetService: EmployeeTimesheetService,
    private spinnerService: SpinnerService,
    private auth: AuthService,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl:AlertController,
    public modalCtrl: ModalController) {
    this.isAuthorized = this.auth.checkPermission('TIMESHEET.APPROVETIMESHEETS.MANAGE');
    this.isBulkApprovePermission = this.auth.checkPermission('TIMESHEET.BULK_APPROVAL.MANAGE');
    this.timesheetReport = {};
  }


  ionViewDidLoad() {
    this.getApproverData();
    if (this.isAuthorized == true)
      this.getPendingTimesheetsToApprove();
    localStorage.setItem('approveTimesheetsBadgeCount', ''+this.pendingtimesheetsArray.length);
  }

  ionViewDidEnter() {
    // this.decideAction();
  }

  // decideAction() {
  //   switch (this.navParams.data.caller) {
  //     case 'my-timesheet':
  //       console.log('my-timesheet => approve-timesheets');
  //       this.getUserData();
  //       break;
  //     case 'enter-timesheet':
  //       console.log('enter timesheet => approve-timesheets');
  //       break;

  //     default:
  //       console.log('unknown caller => approve-timesheets');
  //       this.getApproverData();
  //       break;
  //   }
  // }


  getUserData() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.employeeTimesheetService.getMyTimesheets().subscribe((res: any) => {
        if (res.length > 0) {
          this.approveEmployee = res.reverse();
        } else {
          this.noResponseMsg = 'No Records Received'
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
        }
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });
  }


  /*show more action */

  presentActionSheet(entry: any) {
    this.isMoreclicked = true;
    if (entry.SubmittedStatus == 'Approved' || entry.SubmittedStatus == 'Rejected' || entry.SubmittedStatus == 'Cancelled')
      return;
    let actbuttons: any[] = [
      {
        text: 'Approve',
        role: 'destructive',
        handler: () => {
          this.selectedLeaveID = entry.ID;
          this.showApproveRejectPromt(true);
          this.isMoreclicked = false;
        }
      }, {
        text: 'Reject',
        handler: () => {
          this.selectedLeaveID = entry.ID;
          this.showApproveRejectPromt(false);
          this.isMoreclicked = false;
        }
      },
      {
        text: 'HR Approve',
        handler: () => {
          this.selectedLeaveID = entry.ID;
          this.isHrApprove = true;
          this.showApproveRejectPromt(true);
          this.isMoreclicked = false;
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.isMoreclicked = false;
        }
      }
    ];

    if (this.auth.checkPermission('TIMESHEET.HRAPPROVAL.UPDATE') == false) {
      actbuttons.splice(2, 1);
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Timesheet Action',
      buttons: actbuttons
    });
    actionSheet.present();
  }


   /* Approve/Reject prompt */

  showApproveRejectPromt(approve: boolean) {
      if (this.timesheetchecked)
      {
        this.sendRequest('Approved');
        return;
      }
      
    var isApprove: String = "Approve";
    if (approve)
      isApprove = "Approve";
    else
      isApprove = "Reject";

    let prompt = this.alertCtrl.create({
      title: 'Leave',
      message: "Enter a comment for Leave!",
      inputs: [
        {
          name: 'title',
          placeholder: 'Comment'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: isApprove,
          handler: data => {

            this.comment = data.title;
            //var cmt = this.comment;//this.model.comments;

            if (isApprove == 'Approve') {
              if (this.comment.trim().length == 0) {
                this.comment = '';
                this.showApproveRejectPromt(true);
                return;
              }
              if (this.timesheetchecked)
                this.sendRequest('Approved');
              else
                this.approveClicked();
            }
            else {
              if (this.comment.trim().length == 0) {

                this.comment = '';
                this.showApproveRejectPromt(false);
                return;
              }
              if (this.timesheetchecked)
                this.sendRequest('Rejected');
              else
                this.rejectClicked();
            }
          }
        }
      ]
    });
    prompt.present();
  }


   approveBulkTimesheet() {
    this.showApproveRejectPromt(true);
  }

   /*Bulk Approve Reject API*/
 
  sendRequest(status: any) {
    this.spinnerService.createSpinner('Please wait..');
    if (this.selectedEmployees.length > 0) {
      let payload: any = {};
      payload.Comments = this.comment;
      payload.TimesheetIDs = [];
      for(let i=0;i<this.selectedEmployees.length;i++){
        payload.TimesheetIDs.push(this.selectedEmployees[i].ID);
      }
      //    BACKEND CALL HERE
      this.employeeTimesheetService.bulkApproval(payload).subscribe(res => {
        this.spinnerService.stopSpinner();
        if (res) {
          this.getPendingTimesheetsToApprove();
          this.selectedEmployees = [];
          //this.showToast('Selected Leaves are ' + status + '.');
        } else {
          this.resetAllFlags();
        }
      },
        error => {
        this.resetAllFlags();
        });
    }
  }

  /*Approve Reject API */
  approveClicked() {
    var params = {
      LeaveRequestRefId: this.selectedLeaveID,
      Comments: this.comment,
      Status: 'Approved'
    };
    this.spinnerService.createSpinner('Please wait..');
      this.employeeTimesheetService.approveTimesheet(params)
        .subscribe(res => {
          this.spinnerService.stopSpinner();
          if (res) {
            //his.showToast('Leave is Approved successfully!');
            this
          } else {
            //this.showToast('Failed to Approve Please try again!');
            this.resetAllFlags();
          }
        },
        error => {
          //this.showToast('Failed to Approve Please try again!');
          this.resetAllFlags();
        });
    
  }

  rejectClicked() {
    this.spinnerService.createSpinner('Please wait..');
    var params = {
      LeaveRequestRefId: this.selectedLeaveID,
      Comments: this.comment,
      Status: 'Rejected'
    };

    this.employeeTimesheetService.rejectTimesheet(params)
      .subscribe(res => {
        this.spinnerService.stopSpinner();
        if (res) {
          //this.showToast('Leave is Rejected successfully!');
          this.getPendingTimesheetsToApprove();
        } else {
          //this.showToast('Failed to Reject Please try again!');
          this.resetAllFlags();
        }
      },
      error => {
        //this.showToast('Failed to Reject Please try again!');
        this.resetAllFlags();
      });
  }
 



  /* Get Pending Leaves */

  getPendingTimesheetsToApprove() {
    this.resetAllFlags();
    this.spinnerService.createSpinner('Please wait..');
    this.employeeTimesheetService.getApproverPendingTimesheets()
      .subscribe(
      (res: any) => {
        this.spinnerService.stopSpinner();
        this.pendingtimesheetsArray = [];
        this.selectedEmployees = [];
        this.pendingtimesheetsArray = res.reverse();
        this.pendingtimesheetsArray.forEach(entry => {
          this.selectTimesheet(entry, false);
        });
        this.editMode = true;
        this.isDataretrived = true;
      },
      error => {
        this.isDataretrived = true;
        this.spinnerService.stopSpinner();
        //this.showToast('Failed to get Pending Leaves.');
      });
  }

   /* Show Leave Deatails */

  itemTapped(entry: any) {
    if (this.isshowApproveRejectItems == true)
      this.selectTimesheet(entry, !entry.selected);
    else {
      if (this.isMoreclicked == true)
        return;
       this.navCtrl.push(ApproveTimesheetDetailsPage, { id: entry.ID, caller: 'approve-timesheet' });
    }

  }

  onFilter() {
    let modal = this.modalCtrl.create(ApproveTimesheetFilterPage);
    modal.present();
  }
  onSort() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sort Your Timesheets',
      buttons: [
        {
          text: 'Date Ascending',
          role: 'date ascending',
          handler: () => {
            if (this.isDescending === false) {
              // this.approveEmployee.ApproverUser.reverse();
              this.isDescending = true;
            }
          }
        }, {
          text: 'Date Descending',
          role: 'date descending',
          handler: () => {
            if (this.isDescending) {
              // this.approveEmployee.reverse();
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

  /** Bulk Timesheet Approval functionality */

  /** Bulk Approval */

  /** Multiselction of List item */


  longPressedItem(entry: any)
  {
  if (this.isBulkApprovePermission == true) {
  this.isshowApproveRejectItems = true;
  this.selectTimesheet(entry,true);
  }
  }

  selectAllTimesheets() {
    this.selectedEmployees = [];
    this.pendingtimesheetsArray.forEach(entry => {
      this.selectTimesheet(entry, true);
    });
  }

  selectTimesheet(entry: any, checked: boolean) {
    if (checked == false) {
      var index: number = 0;
      this.pendingtimesheetsArray.forEach(leaves => {
        if (leaves == entry) {
          var sindex = this.selectedEmployees.indexOf(entry);
          this.selectedEmployees.splice(sindex, 1);
        }
        index++;
      });
      entry.selectionColor = "white";
      entry.selected = false;
      if (this.selectedEmployees.length == 0)
        this.isshowApproveRejectItems = false;
    }
    else {
      this.selectedEmployees.push(entry);
      entry.selectionColor = "#8ea3c5";
      entry.selected = true;
    }
    this.setboolean();
  }
  setboolean() {
    this.timesheetchecked = false;
    this.isSelectall = false;
    if (this.selectedEmployees && this.selectedEmployees.length > 0) {
      this.timesheetchecked = true;

      var count: number = 0;
      this.pendingtimesheetsArray.forEach(leaves => {
        count++;
      });
      if (count == this.selectedEmployees.length) {
        this.isSelectall = true;
      }
    }
  }


  /* Reset All flags */

  resetAllFlags() {
    this.editMode = false;
    this.isHrApprove = false;
    this.timesheetchecked = false;
    this.isHrApprove = false;
    this.isMoreclicked = false;
    this.isshowApproveRejectItems = false;
    this.comment = '';
    this.isDataretrived = false;
  }

  


}
