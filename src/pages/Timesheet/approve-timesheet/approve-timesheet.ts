import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { ApproveTimesheetDetailsPage } from '../approve-timesheet-details/approve-timesheet-details';
import { EmployeeTimesheetService } from '../index';
import { AuthService } from '../../../providers/index';
import { EmployeeTimeSheet } from '../models/employee-timesheet.model';
import { AlertController, ItemSliding } from 'ionic-angular';
import { Toast } from 'ionic-native';
import { ApproveTimesheetFilterPage } from '../approve-timesheet-filter/approve-timesheet-filter';
import { SpinnerService } from '../../../providers/index';

@Component({
  selector: 'page-approve-timesheet',
  templateUrl: 'approve-timesheet.html',
   providers: [EmployeeTimesheetService, SpinnerService, AuthService]
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
  public isDataretrived:boolean = false;
  public isAuthorized: boolean;
  public timesheetchecked : boolean = false;
  public approveEmployee: Observable<EmployeeTimesheetService>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private employeeTimesheetService: EmployeeTimesheetService,
    private spinnerService:SpinnerService,
    private auth:AuthService,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController) {
    this.isAuthorized = this.auth.checkPermission('TIMESHEET.APPROVETIMESHEETS.MANAGE');
    this.isBulkApprovePermission = this.auth.checkPermission('TIMESHEET.BULK_APPROVAL.MANAGE');
  }


  ionViewDidLoad() { 
     if (this.isAuthorized == true)
      this.getPendingTimesheetsToApprove();
  }

  ionViewDidEnter() {
    
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
        this.pendingtimesheetsArray.forEach(leave => {
          this.selectLeave(leave, false);
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

  itemTapped(entry) {
    this.navCtrl.push(ApproveTimesheetDetailsPage, { id: entry.ID, caller: 'approve-timesheet' });
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

  longPressedItem(leave: any)
  {
  this.isshowApproveRejectItems = true;
 // this.selectLeave(leave,true);
  }

  editTimsheet() {
    this.editMode = !this.editMode;
    if(this.editMode == false)
    {
      this.isshowApproveRejectItems = false;
      this.selectedEmployees = [];
     this.pendingtimesheetsArray.forEach(leave => {
         /// this.selectLeave(leave,false);
        });
    }
    
  }

 selectAllLeaves() {
    this.selectedEmployees = [];
    this.pendingtimesheetsArray.forEach(leave => {
      this.selectLeave(leave, true);
    });
  }

  selectLeave(leave: any, checked: boolean) {
    if (checked == false) {
      var index: number = 0;
      this.pendingtimesheetsArray.forEach(leaves => {
        if (leaves == leave) {
          var sindex = this.selectedEmployees.indexOf(leave);
          this.selectedEmployees.splice(sindex, 1);
        }
        index++;
      });
      leave.selectionColor = "white";
      leave.selected = false;
      if (this.selectedEmployees.length == 0)
        this.isshowApproveRejectItems = false;
    }
    else {
      this.selectedEmployees.push(leave);
      leave.selectionColor = "#8ea3c5";
      leave.selected = true;
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
