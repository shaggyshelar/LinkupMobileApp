import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CacheService } from 'ng2-cache/ng2-cache';

import { DailyTimesheetDetailPage } from '../daily-timesheet-detail/daily-timesheet-detail';

/*
  Generated class for the TaskDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
  providers: [CacheService]
})
export class TaskDetailPage {
  taskDetail: any;
  project: any;
  task: any;
  isSubmitted: boolean;

  timesheetParams: any;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public _cacheService: CacheService) {
    this.task = {};
    this.taskDetail = {};
    this.project = {};
    this.timesheetParams = {};
    this.isSubmitted = true;
  }

  ionViewDidLoad() {
    // this.navParams.data.isEnterTimesheet ? this.timesheetParams = this.navParams.data.timesheetData : this.viewTimesheet(this.navParams.data.payload);
    // this.getDataFromCache();
  }

  ionViewDidEnter() {
    this.navParams.data.isEnterTimesheet ? this.enterTimesheet(this.navParams.data.timesheetData) : this.viewTimesheet(this.navParams.data.payload);
    
  }

  viewTimesheet(payload) {
    this.taskDetail = payload.data;
    this.project = payload.data.Project;
    this.task = payload.data.Task;
    this.isSubmitted = payload.isSubmitted;

    console.log('TaskDetailPage payload => ', JSON.stringify(payload));
  }

  enterTimesheet(params) {
    this.timesheetParams = params;
    console.log('timesheetData params received => ', this.timesheetParams.timesheetData);
    // if (this._cacheService.exists(this.timesheetParams.timesheetData.cacheKey)) {
    //   console.log(this._cacheService.get(this.timesheetParams.timesheetData.cacheKey));
    //   this.taskDetail = this._cacheService.get(this.timesheetParams.timesheetData.cacheKey)[this.timesheetParams.timesheetData.timesheetIndex]
    //   console.log(this.taskDetail);
    // }
    this.getDataFromCache();
  }

  getDataFromCache() {
    if (this._cacheService.exists(this.navParams.data.timesheetData.cacheKey)) {
      console.log(this._cacheService.get(this.navParams.data.timesheetData.cacheKey));
      this.taskDetail = this._cacheService.get(this.navParams.data.timesheetData.cacheKey)[this.navParams.data.timesheetData.timesheetIndex]
      console.log(this.taskDetail);
    }
  }

  addRecord() {
    this.navCtrl.push(DailyTimesheetDetailPage, { readOnly: false, timesheetIndex: this.navParams.data.timesheetData.timesheetIndex, cacheKey: this.timesheetParams.cacheKey });
  }

  submit() {
    this.navCtrl.pop();
  }
}
