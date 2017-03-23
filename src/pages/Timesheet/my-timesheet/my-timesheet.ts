import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { EmployeeTimesheetService } from '../index';

import { TimesheetDetailsPage } from '../timesheet-details/timesheet-details';
import { EnterTimesheetPage } from '../enter-timesheet/enter-timesheet';
import { EmployeeTimeSheet } from '../models/employee-timesheet.model';

/** TODO: TimesheetDetails Import */

@Component({
  selector: 'page-my-timesheet',
  templateUrl: 'my-timesheet.html'
})
export class MyTimesheetPage {
  myTimeSheets: EmployeeTimeSheet[];
  loader: any;
  isDataReceived: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private employeeTimesheetService: EmployeeTimesheetService,
    public loadingCtrl: LoadingController) {
    this.loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  }

  ionViewDidLoad() {
    this.loader.present();
    this.myTimeSheets = [];
    this.employeeTimesheetService.getMyTimesheets().subscribe((res: any) => {
      this.myTimeSheets = [];
      this.myTimeSheets = res.reverse();
      this.isDataReceived = true;
      this.loader.dismiss();
    }, err => {
      this.isDataReceived = true;
      this.loader.dismiss();
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
}
