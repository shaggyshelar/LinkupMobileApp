import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { CacheService } from 'ng2-cache/ng2-cache';

import { DailyTimesheet } from '../models/daily-timesheet.model';
import { Timesheet } from '../models/timesheet.model';

@Component({
  selector: 'page-daily-timesheet-detail',
  templateUrl: 'daily-timesheet-detail.html'
})
export class DailyTimesheetDetailPage {

  dailyData: DailyTimesheet;
  dailyTimesheetForm: FormGroup;
  isViewModeBillable: Boolean = true;
  isViewModeNonBillable: Boolean = false;

  weekStartDate: any;
  weekEndDate: any;
  dateSelected: any;
  timesheet: any;
  timesheetIndex: number;
  dayOfWeek: number;

  billDesc: string;
  billHrs: string;
  nBillDesc: string;
  nBillHrs: string;


  constructor(public navCtrl: NavController, public navParams: NavParams
    , private formBuilder: FormBuilder
    , private _cacheService: CacheService
  ) {
    this.dailyTimesheetForm = this.formBuilder.group({
      billableHours: [{ value: '', disabled: this.navParams.data.isSubmitted }],
      noteForBillableHours: [{ value: '', disabled: this.navParams.data.isSubmitted }],
      nonBillableHours: [{ value: '', disabled: this.navParams.data.isSubmitted }],
      noteForNonBillableHours: [{ value: '', disabled: this.navParams.data.isSubmitted }],
    });
    this.weekStartDate = moment().add(0, 'weeks').isoWeekday(1).toISOString();
    this.weekEndDate = moment().add(1, 'weeks').isoWeekday(0).toISOString();
    this.dateSelected = moment().toISOString();
    this.timesheet = new Timesheet();
    this.timesheetIndex = 999;
    this.billHrs = this.billDesc = this.nBillHrs = this.nBillDesc = '';
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    console.log('daily detail cacheKey=> ',this.navParams.data.cacheKey);
    if (this._cacheService.exists(this.navParams.data.cacheKey)) {
      this.timesheet = this._cacheService.get(this.navParams.data.cacheKey);
    } else { console.log('not there') }
    this.timesheetIndex = this.navParams.data.timesheetIndex;
    this.dayOfWeek = this.navParams.data.dayOfWeek;
    console.log('viewDidEnter', this.navParams.data.isSubmitted, this.timesheet, this.timesheetIndex, this.dayOfWeek, this.navParams.data.cacheKey);
    this.assembleStruct();
  }

  submit(inputs) {
    if (this._cacheService.exists(this.navParams.data.cacheKey)) {
      this.assembleObj(inputs);
      this._cacheService.remove(this.navParams.data.cacheKey);
      this._cacheService.set(this.navParams.data.cacheKey, this.timesheet, { maxAge: 60 * 60 });
      console.log(this._cacheService.get(this.navParams.data.cacheKey));
      this.navCtrl.pop();
    }
  }

  assembleObj(inputs) {
    switch (this.dayOfWeek) {
      case 0:
        if (inputs.billableHours && inputs.billableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Mondayhrs = inputs.billableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Mondaydesc = inputs.noteForBillableHours;
        }
        if (inputs.nonBillableHours && inputs.noteForNonBillableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Mondaynbhrs = inputs.nonBillableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Mondaydescnb = inputs.noteForNonBillableHours;
        }
        break;
      case 1:
        if (inputs.billableHours && inputs.billableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Tuesdayhrs = inputs.billableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Tuesdaydesc = inputs.noteForBillableHours;
        }
        if (inputs.nonBillableHours && inputs.noteForNonBillableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Tuesdaynbhrs = inputs.nonBillableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Tuesdaydescnb = inputs.noteForNonBillableHours;
        }
        break;
      case 2:
        if (inputs.billableHours && inputs.billableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Wednesdayhrs = inputs.billableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Wednesdaydesc = inputs.noteForBillableHours;
        }
        if (inputs.nonBillableHours && inputs.noteForNonBillableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Wednesdaynbhrs = inputs.nonBillableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Wednesdaydescnb = inputs.noteForNonBillableHours;
        }
        break;
      case 3:
        if (inputs.billableHours && inputs.billableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Thursdayhrs = inputs.billableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Thursdaydesc = inputs.noteForBillableHours;
        }
        if (inputs.nonBillableHours && inputs.noteForNonBillableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Thursdaynbhrs = inputs.nonBillableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Thursdaydescnb = inputs.noteForNonBillableHours;
        }
        break;
      case 4:
        if (inputs.billableHours && inputs.billableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Fridayhrs = inputs.billableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Fridaydesc = inputs.noteForBillableHours;
        }
        if (inputs.nonBillableHours && inputs.noteForNonBillableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Fridaynbhrs = inputs.nonBillableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Fridaydescnb = inputs.noteForNonBillableHours;
        }
        break;
      case 5:
        if (inputs.billableHours && inputs.billableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Saturdayhrs = inputs.billableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Saturdaydesc = inputs.noteForBillableHours;
        }
        if (inputs.nonBillableHours && inputs.noteForNonBillableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Saturdaynbhrs = inputs.nonBillableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Saturdaydescnb = inputs.noteForNonBillableHours;
        }
        break;
      case 6:
        if (inputs.billableHours && inputs.billableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Sundayhrs = inputs.billableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Sundaydesc = inputs.noteForBillableHours;
        }
        if (inputs.nonBillableHours && inputs.noteForNonBillableHours) {
          this.timesheet.Timesheets[this.timesheetIndex].Sundaynbhrs = inputs.nonBillableHours;
          this.timesheet.Timesheets[this.timesheetIndex].Sundaydescnb = inputs.noteForNonBillableHours;
        }
        break;
      default:
        alert('Something went wrong!');
        break;
    }

  }

  assembleStruct() {
    switch (this.dayOfWeek) {
      case 0:
        this.billHrs = this.timesheet.Timesheets[this.timesheetIndex].Mondayhrs;
        this.billDesc = this.timesheet.Timesheets[this.timesheetIndex].Mondaydesc;
        this.nBillHrs = this.timesheet.Timesheets[this.timesheetIndex].Mondaynbhrs;
        this.nBillDesc = this.timesheet.Timesheets[this.timesheetIndex].Mondaydescnb;
        console.log('assembleStruct', this.timesheet.Timesheets[this.timesheetIndex])
        break;
      case 1:
        this.billHrs = this.timesheet.Timesheets[this.timesheetIndex].Tuesdayhrs;
        this.billDesc = this.timesheet.Timesheets[this.timesheetIndex].Tuesdaydesc;
        this.nBillHrs = this.timesheet.Timesheets[this.timesheetIndex].Tuesdaynbhrs;
        this.nBillDesc = this.timesheet.Timesheets[this.timesheetIndex].Tuesdaydescnb;
        break;
      case 2:
        this.billHrs = this.timesheet.Timesheets[this.timesheetIndex].Wednesdayhrs;
        this.billDesc = this.timesheet.Timesheets[this.timesheetIndex].Wednesdaydesc;
        this.nBillHrs = this.timesheet.Timesheets[this.timesheetIndex].Wednesdaynbhrs;
        this.nBillDesc = this.timesheet.Timesheets[this.timesheetIndex].Wednesdaydescnb;
        break;
      case 3:
        this.billHrs = this.timesheet.Timesheets[this.timesheetIndex].Thursdayhrs;
        this.billDesc = this.timesheet.Timesheets[this.timesheetIndex].Thursdaydesc;
        this.nBillHrs = this.timesheet.Timesheets[this.timesheetIndex].Thursdaynbhrs;
        this.nBillDesc = this.timesheet.Timesheets[this.timesheetIndex].Thursdaydescnb;
        break;
      case 4:
        this.billHrs = this.timesheet.Timesheets[this.timesheetIndex].Fridayhrs;
        this.billDesc = this.timesheet.Timesheets[this.timesheetIndex].Fridaydesc;
        this.nBillHrs = this.timesheet.Timesheets[this.timesheetIndex].Fridaynbhrs;
        this.nBillDesc = this.timesheet.Timesheets[this.timesheetIndex].Fridaydescnb;
        break;
      case 5:
        this.billHrs = this.timesheet.Timesheets[this.timesheetIndex].Saturdayhrs;
        this.billDesc = this.timesheet.Timesheets[this.timesheetIndex].Saturdaydesc;
        this.nBillHrs = this.timesheet.Timesheets[this.timesheetIndex].Saturdaynbhrs;
        this.nBillDesc = this.timesheet.Timesheets[this.timesheetIndex].Saturdaydescnb;
        break;
      case 6:
        this.billHrs = this.timesheet.Timesheets[this.timesheetIndex].Sundayhrs;
        this.billDesc = this.timesheet.Timesheets[this.timesheetIndex].Sundaydesc;
        this.nBillHrs = this.timesheet.Timesheets[this.timesheetIndex].Sundaynbhrs;
        this.nBillDesc = this.timesheet.Timesheets[this.timesheetIndex].Sundaydescnb;
        break;

      default:
        break;
    }
  }

}
