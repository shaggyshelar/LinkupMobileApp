import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CacheService } from 'ng2-cache/ng2-cache';

import { DailyTimesheetDetailPage } from '../daily-timesheet-detail/daily-timesheet-detail';

import { Timesheet } from '../models/timesheet.model';

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
  cacheKey: string;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public _cacheService: CacheService) {
    this.task = {};
    this.taskDetail = new Timesheet();
    this.project = {};
    this.timesheetParams = {};
    this.isSubmitted = true;
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.navParams.data.isEnterTimesheet ? this.enterTimesheet(this.navParams.data.timesheetData) : this.viewTimesheet(this.navParams.data.timesheetData);
    console.log('TaskDetailPage cacheKey=>', this.navParams.data.timesheetData.cacheKey);
  }

  viewTimesheet(params) {
    this.timesheetParams = params.data;
    this.isSubmitted = params.isSubmitted;
    this.cacheKey = params.cacheKey;
    this.getDataFromCache();
  }

  enterTimesheet(params) {
    console.log('enterTimesheet => ', params.timesheetIndex);
    this.timesheetParams = params.data;
    this.isSubmitted = params.isSubmitted;
    this.cacheKey = params.cacheKey;
    this.getDataFromCache();
  }

  getDataFromCache() {
    if (this._cacheService.exists(this.navParams.data.timesheetData.cacheKey)) {
      this.taskDetail = this._cacheService.get(this.navParams.data.timesheetData.cacheKey).Timesheets[this.navParams.data.timesheetData.timesheetIndex];
    }
  }

  addRecord(dayOfWeek) {
    console.log('timesheetIndex', this.navParams.data.timesheetData.timesheetIndex, 'dayOfWeek', dayOfWeek);
    if (this.navParams.data.timesheetData.isSubmitted) {
      this.navCtrl.push(DailyTimesheetDetailPage, { isSubmitted: true, timesheetIndex: this.navParams.data.timesheetData.timesheetIndex, cacheKey: this.cacheKey, dayOfWeek: dayOfWeek });
    } else {
      this.navCtrl.push(DailyTimesheetDetailPage, { isSubmitted: false, timesheetIndex: this.navParams.data.timesheetData.timesheetIndex, cacheKey: this.cacheKey, dayOfWeek: dayOfWeek });
    }
  }

  submit() {
    this.navCtrl.pop();
  }
}
