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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private employeeTimesheetService: EmployeeTimesheetService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    // var loader = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });

    // loader.present().then(() => {
    // });
    this.myTimeSheets = [];
    this.employeeTimesheetService.getMyTimesheets().subscribe((res: any) => {
      if (res.length > 0) {
        this.myTimeSheets = res.reverse();
      }
    });
  }

  editClicked(item) {
    alert('Takes you to Edit Timesheet Page');
  }

  itemClicked(entry) {
    this.navCtrl.push(TimesheetDetailsPage, { payload: entry, caller: 'my-timesheet' });
  }

  addFabClicked() {
    this.navCtrl.push(EnterTimesheetPage, { caller: 'my-timesheet' });
  }
}
