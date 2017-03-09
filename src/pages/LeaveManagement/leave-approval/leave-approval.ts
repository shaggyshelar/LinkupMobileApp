import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Events } from 'ionic-angular';
import { SpinnerService } from '../../../providers/index';
import { LeaveService } from '../index';
import { AlertController, ItemSliding } from 'ionic-angular';
import { Leave } from '../models/leave';
import { LeaveApprovalDetailPage } from '../leave-approval-detail/leave-approval-detail';
import { Observable } from 'rxjs/Rx';
import { Toast } from 'ionic-native';
/*
  Generated class for the LeaveApproval page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-leave-approval',
  templateUrl: 'leave-approval.html',
  providers: [LeaveService, SpinnerService]
})
export class LeaveApprovalPage {

  public leaveID: string;
  public leaveObs: Observable<Leave[]>;
  public leavesArray: Leave[];
  public leaveList: Leave[];
  public userPermissions: any[];
  public isBulkApprovePermission: boolean;
  public selectedLeaveID: string;
  public isMoreclicked: boolean;
  public isHrApprove: boolean;
  public leavechecked: boolean;
  public selectedEmployees: any[];
  public totalCount: number;
  public comment: string;
  public editMode: boolean;
  public isFirstTimeLoad: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public leaveService: LeaveService,
    public spinnerService: SpinnerService,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public leaveStatusChangedEvent: Events) {
    this.userPermissions = JSON.parse(localStorage.getItem("loggedInUserPermission"));
    this.isBulkApprovePermission = this.checkBulkApprovePermission('LEAVE.BULK_APPROVAL.MANAGE');
    this.leaveStatusChangedEvent.subscribe('Hr Approval Leave changed', () => {
      this.getApproverLeave();
    });
    this.leaveStatusChangedEvent.subscribe('Bulk Approval Leave changed', () => {
      this.getApproverLeave();
    });
    this.leaveStatusChangedEvent.subscribe('Rejected single Leave', () => {
      this.getApproverLeave();
    });
    this.leaveStatusChangedEvent.subscribe('Approved single Leave', () => {
      this.getApproverLeave();
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveApprovalPage');

    this.getApproverLeave();
  }
  ionViewWillEnter() {
    // if(!this.isFirstTimeLoad)
    // this.getApproverLeave();

    // this.isFirstTimeLoad = false;
  }
  ionViewWillUnload() {
    this.leaveStatusChangedEvent.unsubscribe('Hr Approval Leave changed');
    this.leaveStatusChangedEvent.unsubscribe('Bulk Approval Leave changed');
    this.leaveStatusChangedEvent.unsubscribe('Rejected single Leave');
    this.leaveStatusChangedEvent.unsubscribe('Approved single Leave');
  }


  getApproverLeave() {


    this.leaveList = [];
    this.resetAllFlags();
    this.spinnerService.createSpinner('Please wait..');
    this.leaveService.getApproverLeaves().subscribe((res: any) => {
      this.spinnerService.stopSpinner();
      if (res.length > 0) {
        this.leaveList = res.reverse();
        console.log('Got approvar list' + this.leaveList);
        this.getPendingLeavesToApprove();
      }
    },
      error => {
        this.spinnerService.stopSpinner();
      });
  }

  /* Get Pending Leaves */

  getPendingLeavesToApprove() {
    this.spinnerService.createSpinner('Please wait..');
    this.leaveService.getLeaveByStatus('Pending')
      .subscribe(
      (res: any) => {
        this.spinnerService.stopSpinner();
        console.log("Data from server", res);
        this.leavesArray = [];
        this.leavesArray = res.reverse();
        this.leavesArray.forEach(leave => {
        });
      },
      error => {
        this.spinnerService.stopSpinner();
        this.showToast('Failed to get Pending Leaves.');
      });
  }

  /* Show Leave Deatails */

  itemTapped(leave: any) {
    this.navCtrl.push(LeaveApprovalDetailPage, { leave: leave });
  }

  /*show more action */

  presentActionSheet(leave: any, leaveID: string) {
    if (leave.Status == 'Approved' || leave.Status == 'Rejected' || leave.Status == 'Cancelled')
      return;
    this.isMoreclicked = true;

    let actbuttons: any[] = [
      {
        text: 'Approve',
        role: 'destructive',
        handler: () => {
          this.selectedLeaveID = leaveID;
          this.showApproveRejectPromt(true);
          this.isMoreclicked = false;
        }
      }, {
        text: 'Reject',
        handler: () => {
          this.selectedLeaveID = leaveID;
          this.showApproveRejectPromt(false);
          this.isMoreclicked = false;
        }
      },
      {
        text: 'HR Approve',
        handler: () => {
          this.selectedLeaveID = leaveID;
          this.isHrApprove = true;
          this.showApproveRejectPromt(true);
          this.isMoreclicked = false;
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          this.isMoreclicked = false;
        }
      }
    ];

    if (this.checkBulkApprovePermission('LEAVE.HRAPPROVAL.UPDATE') == false) {
      actbuttons.splice(2, 1);
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Leave Action',
      buttons: actbuttons
    });
    actionSheet.present();
  }

  /* Approve/Reject prompt */

  showApproveRejectPromt(approve: boolean) {
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
            console.log('Cancel clicked');
          }
        },
        {
          text: isApprove,
          handler: data => {
            console.log('Saved clicked');

            this.comment = data.title;
            var cmt = this.comment;//this.model.comments;

            if (isApprove == 'Approve') {
              if (this.comment.trim().length == 0) {
                this.comment = '';
                this.showApproveRejectPromt(true);
                return;
              }
              if (this.leavechecked)
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
              if (this.leavechecked)
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

  /*Bulk Approve Reject API*/
  assembleReqPayload(status: string) {

    var payload: any = {
      LeaveRequestIDs: [],
      StatusAndComments: {
        Comments: this.comment,
        Status: status
      }
    };
    for (var index in this.selectedEmployees) {
      payload.LeaveRequestIDs.push(
        {
          LeaveRequestRefId: this.selectedEmployees[index].LeaveRequestMasterId,
        });
    }
    return payload;
  }

  sendRequest(status: any) {

    this.spinnerService.createSpinner('Please wait..');
    if (this.selectedEmployees.length > 0) {
      //    BACKEND CALL HERE
      this.leaveService.bulkLeaveApproval(this.assembleReqPayload(status)).subscribe(res => {
        this.spinnerService.stopSpinner();
        if (res) {
          this.getApproverLeave();
          this.selectedEmployees = [];
          this.showToast('Selected Leaves are ' + status + '.');
        } else {
          this.resetAllFlags();
        }
      },
        error => {

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
    if (this.isHrApprove == true) {
      this.leaveService.hrsingleLeaveApprove(params)
        .subscribe(res => {
          this.spinnerService.stopSpinner();
          if (res) {
            this.showToast('Leave is Approved successfully!');
            this.getApproverLeave();
          } else {
            this.showToast('Failed to Approve Please try again!');
            this.resetAllFlags();
          }
        },
        error => {
          this.spinnerService.stopSpinner();
          this.showToast('Failed to Approve Please try again!');
        });
    }
    else {
      this.leaveService.singleLeaveApprove(params)
        .subscribe(res => {
          this.spinnerService.stopSpinner();
          if (res) {
            this.showToast('Leave is Approved successfully!');
            this.getApproverLeave();
          } else {
            this.showToast('Failed to Approve Please try again!');
            this.resetAllFlags();
          }
        },
        error => {
          this.showToast('Failed to Approve Please try again!');
          this.resetAllFlags();
        });
    }
  }

  rejectClicked() {
    this.spinnerService.createSpinner('Please wait..');
    var params = {
      LeaveRequestRefId: this.selectedLeaveID,
      Comments: this.comment,
      Status: 'Rejected'
    };

    this.leaveService.singleLeaveReject(params)
      .subscribe(res => {
        this.spinnerService.stopSpinner();
        if (res) {
          this.showToast('Leave is Rejected successfully!');
          this.getApproverLeave();
        } else {
          this.showToast('Failed to Reject Please try again!');
          this.resetAllFlags();
        }
      },
      error => {
        this.showToast('Failed to Reject Please try again!');
        this.resetAllFlags();
      });
  }

  editleaves() {
    this.editMode = !this.editMode;
  }
  approveBulkLeave() {
    this.showApproveRejectPromt(true);
  }

  rejectBulkLeave() {
    this.showApproveRejectPromt(false);
  }

  /* Reset All flags */

  resetAllFlags() {
    this.editMode = false;
    this.isHrApprove = false;
    this.leavechecked = false;
    this.isHrApprove = false;
    this.isMoreclicked = false;
    this.comment = '';
    this.totalCount = 0;
  }


  /* Check bulk approve permission */

  checkBulkApprovePermission(feature: string) {
    for (let innerindex = 0; innerindex < this.userPermissions.length; innerindex++) {
      if (feature == this.userPermissions[innerindex]) {
        return true;
      }
    }
    return false;
  }

  /* Show Toast*/

  showToast(message: string) {
    //     Toast.show(message, '5000', 'center').subscribe(
    //   toast => {
    //     console.log(toast);
    //   }
    // );
  }


}
