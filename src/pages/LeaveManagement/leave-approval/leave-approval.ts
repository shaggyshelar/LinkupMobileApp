import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Events, ModalController } from 'ionic-angular';
import { SpinnerService } from '../../../providers/index';
import { LeaveService } from '../index';
import { AuthService } from '../../../providers/index';
import { AlertController, ItemSliding } from 'ionic-angular';
import { Leave } from '../models/leave';
import { LeaveApprovalDetailPage } from '../leave-approval-detail/leave-approval-detail';
import { Observable } from 'rxjs/Rx';
import { Toast } from 'ionic-native';
import { LeaveApprovalFilterPage } from '../leave-approval-filter/leave-approval-filter';
/*
  Generated class for the LeaveApproval page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-leave-approval',
  templateUrl: 'leave-approval.html',
  providers: [LeaveService, SpinnerService, AuthService]
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
  public isDatachanged: boolean = false;
  public isDescending: boolean = true;
  public editMode: boolean;
  public isDataretrived: boolean = false;
  public isSelectall: boolean = false;
  public isshowApproveRejectItems = false;
  public isAuthorized: boolean;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public leaveService: LeaveService,
    public spinnerService: SpinnerService,
    public auth: AuthService,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public leaveStatusChangedEvent: Events,
    public modalCtrl: ModalController) {
    this.userPermissions = JSON.parse(localStorage.getItem("loggedInUserPermission"));
    this.isAuthorized = this.auth.checkPermission('LEAVE.APPROVAL.MANAGE');
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
    if (this.isAuthorized == true)
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
    // this.spinnerService.createSpinner('Please wait..');
    // this.leaveService.getApproverLeaves().subscribe((res: any) => {
    //  this.spinnerService.stopSpinner();
    // if (res.length > 0) {
    //  this.leaveList = res.reverse();
    this.getPendingLeavesToApprove();
    //}
    //  },
    // error => {
    // this.spinnerService.stopSpinner();
    // });
  }

  /* Get Pending Leaves */

  getPendingLeavesToApprove() {
    this.isDataretrived = false;
    this.spinnerService.createSpinner('Please wait..');
    this.leaveService.getLeaveByStatus('Pending')
      .subscribe(
      (res: any) => {
        this.spinnerService.stopSpinner();
        this.leavesArray = [];
        this.selectedEmployees = [];
        this.leavesArray = res.reverse();
        this.leavesArray.forEach(leave => {
          this.selectLeave(leave, false);
        });
        this.editMode = true;
        this.isDataretrived = true;
      },
      error => {
        this.isDataretrived = true;
        this.spinnerService.stopSpinner();
        this.showToast('Failed to get Pending Leaves.');
      });
  }



  /* Show Leave Deatails */

  itemTapped(leave: any) {


    if (this.isshowApproveRejectItems == true)
      this.selectLeave(leave, !leave.selected);
    else {
      if (this.isMoreclicked == true)
        return;
      this.navCtrl.push(LeaveApprovalDetailPage, { leave: leave });
    }

  }

  /*show more action */

  presentActionSheet(leave: any, leaveID: string) {
    this.isMoreclicked = true;
    if (leave.Status == 'Approved' || leave.Status == 'Rejected' || leave.Status == 'Cancelled')
      return;
    let actbuttons: any[] = [
      {
        text: 'Approve',
        role: 'destructive',
        icon: 'checkmark',
        handler: () => {
          this.selectedLeaveID = leaveID;
          this.showApproveRejectPromt(true);
          this.isMoreclicked = false;
        }
      }, {
        text: 'Reject',
        icon: 'close',
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
        icon:'close-circle',
        handler: () => {
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
          }
        },
        {
          text: isApprove,
          handler: data => {

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

  /** Bulk Approval */

  /** Multiselction of List item */

  longPressedItem(leave: any) {
    if (this.isBulkApprovePermission == true) {
      this.isshowApproveRejectItems = true;
      this.selectLeave(leave, true);
    }

  }

  editleaves() {
    this.editMode = !this.editMode;
    if (this.editMode == false) {
      this.isshowApproveRejectItems = false;
      this.selectedEmployees = [];
      this.leavesArray.forEach(leave => {
        this.selectLeave(leave, false);
      });
    }

  }

  selectAllLeaves() {
    this.selectedEmployees = [];
    this.leavesArray.forEach(leave => {
      this.selectLeave(leave, true);
    });
  }

  selectLeave(leave: any, checked: boolean) {
    if (checked == false) {
      var index: number = 0;
      if (this.selectedEmployees.length > 0)
      {
        this.leavesArray.forEach(leaves => {
        if (leaves == leave) {
          var sindex = this.selectedEmployees.indexOf(leave);
          this.selectedEmployees.splice(sindex, 1);
        }
        index++;
      });
    }
    else
    this.isshowApproveRejectItems = false;

      leave.selectionColor = "white";
      leave.selected = false;
    }
    else {
      this.selectedEmployees.push(leave);
      leave.selectionColor = "#8ea3c5";
      leave.selected = true;
    }
    this.setboolean();
  }
  setboolean() {
    this.leavechecked = false;
    this.isSelectall = false;
    if (this.selectedEmployees && this.selectedEmployees.length > 0) {
      this.leavechecked = true;

      var count: number = 0;
      this.leavesArray.forEach(leaves => {
        count++;
      });
      if (count == this.selectedEmployees.length) {
        this.isSelectall = true;
      }
    }
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
    this.isshowApproveRejectItems = false;
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
  onFilter() {
    let modal = this.modalCtrl.create(LeaveApprovalFilterPage);
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
              this.leaveList.reverse();
              this.isDescending = true;
            }
          }
        }, {
          text: 'Date Descending',
          role: 'date descending',
          handler: () => {
            if (this.isDescending) {
              this.leaveList.reverse();
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

  // Lazy Loading Functionality. TO DO:need to get only limited data from back end
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.leaveService.getApproverLeaves().subscribe((res: any) => {
        for (let i = 0; i < res.length; i++) {
          this.leaveList.push(res[i]);
        }
      });
      infiniteScroll.complete();
    }, 500);
  }

}
