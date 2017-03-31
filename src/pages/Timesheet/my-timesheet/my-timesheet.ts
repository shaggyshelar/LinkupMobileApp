import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { EmployeeTimesheetService } from '../index';
import { AuthService } from '../../../providers/index';

import { TimesheetDetailsPage } from '../timesheet-details/timesheet-details';
import { EnterTimesheetPage } from '../enter-timesheet/enter-timesheet';
import { EmployeeTimeSheet } from '../models/employee-timesheet.model';
import { MyTimesheetFilterPage } from '../my-timesheet-filter/my-timesheet-filter';

/** TODO: TimesheetDetails Import */

@Component({
  selector: 'page-my-timesheet',
  templateUrl: 'my-timesheet.html'
})
export class MyTimesheetPage {
  myTimeSheets: EmployeeTimeSheet[];
  replicateTimesheet: EmployeeTimeSheet[];
  modifiedList: any[];
  loader: any;
  isDataReceived: Boolean = false;
  filterValues = [];
  public isAuthorized: boolean;
  public isPullToRefresh: boolean = false;
  public isDescending: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private employeeTimesheetService: EmployeeTimesheetService,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthService,
    public modalCtrl: ModalController) {
    this.isAuthorized = this.auth.checkPermission('TIMESHEET.MYTIMESHEET.MANAGE');
    this.filterValues = [];
    this.filterValues.push({ submitted: true });
    this.filterValues.push({ approved: true });
    this.filterValues.push({ partiallyApproved: true });
    this.filterValues.push({ notSubmitted: true });
    this.filterValues.push({ pending: true });
    this.filterValues.push({ rejected: true });
    this.loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  }

  ionViewDidLoad() {
    this.loader.present();
    this.myTimeSheets = [];
    this.isPullToRefresh = false;
    this.employeeTimesheetService.getMyTimesheets(this.isPullToRefresh).subscribe((res: any) => {
      this.myTimeSheets = [];
      this.replicateTimesheet = [];
      this.myTimeSheets = res.reverse();
      this.replicateTimesheet = res;
      this.isDataReceived = true;
      this.loader.dismiss();
    }, err => {
      this.isDataReceived = true;
      this.loader.dismiss();
    });
  }

  /**Pull To Refresh */
  doRefresh(refresher) {
    this.isPullToRefresh = true;
    this.employeeTimesheetService.getMyTimesheets(this.isPullToRefresh).subscribe((res: any) => {
      refresher.complete();
      this.myTimeSheets = [];
      this.replicateTimesheet = [];
      this.myTimeSheets = res.reverse();
      this.replicateTimesheet = res;
      this.isDataReceived = true;
    }, err => {
      this.isDataReceived = true;
      refresher.complete();
    });
  }

  editClicked(item) {
    alert('Takes you to Edit Timesheet Page');
  }

  itemClicked(entry) {
    //this.navCtrl.push(TimesheetDetailsPage, { payload: entry, caller: 'my-timesheet' });
    this.navCtrl.push(EnterTimesheetPage, { timesheetID: entry.ID });
  }

  addFabClicked() {
    this.navCtrl.push(EnterTimesheetPage, { caller: 'my-timesheet' });
  }

  onFilter() {
    let modal = this.modalCtrl.create(MyTimesheetFilterPage, { filtervalue: this.filterValues });
    modal.present();
    modal.onDidDismiss(data => {
      if (data !== undefined) {
        if (data.length > 0) {
          this.myTimeSheets = [];
          this.modifiedList = [];
          this.filterValues = [];
          for (let index = 0; index < data.length; index++) {
            if (data[index].model === true) {
              this.modifiedList = this.replicateTimesheet.filter((entry) => {
                return entry.SubmittedStatus == data[index].value;
              })
              this.myTimeSheets = this.myTimeSheets.concat(this.modifiedList);
              this.modifiedList = [];
              if (data[index].modelValue === 'submitted')
                this.filterValues.push({ submitted: true });
              if (data[index].modelValue === 'approved')
                this.filterValues.push({ approved: true });
              if (data[index].modelValue === 'partiallyApproved')
                this.filterValues.push({ partiallyApproved: true });
              if (data[index].modelValue === 'notSubmitted')
                this.filterValues.push({ notSubmitted: true });
              if (data[index].modelValue === 'pending')
                this.filterValues.push({ pending: true });
              if (data[index].modelValue === 'rejected')
                this.filterValues.push({ rejected: true });
            }
            else {
              if (data[index].modelValue === 'submitted')
                this.filterValues.push({ submitted: false });
              if (data[index].modelValue === 'approved')
                this.filterValues.push({ approved: false });
              if (data[index].modelValue === 'partiallyApproved')
                this.filterValues.push({ partiallyApproved: false });
              if (data[index].modelValue === 'notSubmitted')
                this.filterValues.push({ notSubmitted: false });
              if (data[index].modelValue === 'pending')
                this.filterValues.push({ pending: false });
              if (data[index].modelValue === 'rejected')
                this.filterValues.push({ rejected: false });
            }
          }
          if (this.filterValues[0].submitted === false && this.filterValues[1].approved === false && this.filterValues[2].partiallyApproved === false
            && this.filterValues[3].notSubmitted === false && this.filterValues[4].pending === false && this.filterValues[5].rejected === false) {
            this.myTimeSheets = [];
            this.myTimeSheets = this.myTimeSheets.concat(this.replicateTimesheet);
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
              this.myTimeSheets.reverse();
              this.isDescending = true;
            }
          }
        }, {
          text: 'Date Descending',
          role: 'date descending',
          handler: () => {
            if (this.isDescending) {
              this.myTimeSheets.reverse();
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
}
