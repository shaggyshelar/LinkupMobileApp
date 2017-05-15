import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { CacheService } from 'ng2-cache/ng2-cache';
import * as moment from 'moment';

import { TimesheetService } from '../index';

import { TaskDetailPage } from '../task-detail/task-detail';
import { DailyTimesheetDetailPage } from '../daily-timesheet-detail/daily-timesheet-detail';

@Component({
  selector: 'page-timesheet-details',
  templateUrl: 'timesheet-details.html'
})
export class TimesheetDetailsPage {
  timesheetID: Number = 0;
  employeeTimesheet: any;
  timesheets: any;
  isSubmitted: boolean = true;

  cacheKey :string;
  dayRec: any = {
    start: null,
    end: null,
    days: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams
    , private timesheetService: TimesheetService
    , public _cacheService: CacheService
    , public loadingCtrl: LoadingController) {
      this.cacheKey = '';
  }

  ionViewDidLoad() {

    switch (this.navParams.data.caller) {
      case 'enter-timesheet':
        //console.log('enter-timesheet => timesheet-details');
        this.enterTimesheet();
        break;
      case 'my-timesheet':
        //console.log('my-timesheet => timesheet-details');
        this.getMyTimesheetDetails(this.navParams.data.payload.ID);
        break;

      default:
        //console.log('unknown => timesheet-details');
        this.enterTimesheet();
        break;
    }
  }

  enterTimesheet() {
    // this.getMyTimesheetDetails(1);  //getting stub data
    this.navCtrl.push(DailyTimesheetDetailPage, { readOnly: false });
  }

  getMyTimesheetDetails(id) {
    this.timesheetID = id;

    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.timesheetService.getMyTimesheet(id).subscribe((res: any) => {
        this.employeeTimesheet = res;
        this.timesheets = res.Timesheets;
        // console.log('this.timesheets => ', this.timesheets);
        this.cacheStore(this.assembleCacheKey(), res);
        res.SubmittedStatus === 'Not Submitted' ? this.isSubmitted = false : this.isSubmitted = true;
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });

  }

  itemClicked(rec, index) {
    this.navCtrl.push(TaskDetailPage, { caller: 'timesheet-details', isEnterTimesheet: false, timesheetData: { timesheetIndex: index, isSubmitted: this.isSubmitted, cacheKey: this.cacheKey} });
  }

  assembleCacheKey() {
    this.cacheKey = 'myTimesheet-' + moment(this.employeeTimesheet.StartDate).format('D/M') + '-' + moment(this.employeeTimesheet.EndDate).format('D/M');
    return this.cacheKey;
  }

  cacheStore(name, data) {
    if (this._cacheService.exists(name)) {
      this._cacheService.remove(name);
      this._cacheService.set(name, data, { maxAge: 60 * 60 });
    } else {
      this._cacheService.set(name, data, { maxAge: 60 * 60 });
    }
  }

  addDailyTask() {
    this.navCtrl.push(DailyTimesheetDetailPage);
  }

}
