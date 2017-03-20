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


  constructor(public navCtrl: NavController, public navParams: NavParams
    , private formBuilder: FormBuilder
    , private _cacheService: CacheService
  ) {
    this.dailyTimesheetForm = this.formBuilder.group({
      billableHours: [{ value: this.navParams.data.readOnly ? this.navParams.data.dailyData.BillableHours : '', disabled: this.navParams.data.readOnly }],
      noteForBillableHours: [{ value: this.navParams.data.readOnly ? this.navParams.data.dailyData.NoteForBillableHours : '', disabled: this.navParams.data.readOnly }],
      nonBillableHours: [{ value: this.navParams.data.readOnly ? this.navParams.data.dailyData.NonBillableHours : '', disabled: this.navParams.data.readOnly }],
      noteForNonBillableHours: [{ value: this.navParams.data.readOnly ? this.navParams.data.dailyData.NoteForNonBillableHours : '', disabled: this.navParams.data.readOnly }],
    });
    this.weekStartDate = moment().add(0, 'weeks').isoWeekday(1).toISOString();
    this.weekEndDate = moment().add(1, 'weeks').isoWeekday(0).toISOString();
    this.dateSelected = moment().toISOString();
    this.timesheet = new Timesheet(null, null, '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0);
    this.timesheetIndex = 999;
  }

  ionViewDidLoad() {
    this.navParams.data.readOnly ? this.viewMyTimesheetMode() : this.enterTimesheetMode();
  }

  viewMyTimesheetMode() {
    this.dailyData = this.navParams.data.dailyData;
    this.isViewModeBillable = this.isViewModeNonBillable = this.navParams.data.readOnly;
    //console.log('viewMyTimesheetMode');
  }

  enterTimesheetMode() {
    if (this._cacheService.exists(this.navParams.data.cacheKey)) {
      this.timesheet = this._cacheService.get(this.navParams.data.cacheKey);
      this.timesheetIndex = this.navParams.data.timesheetIndex;
    }
    console.log('enterTimesheetMode', this.timesheet, this.timesheetIndex);
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
    switch (moment(this.dateSelected).day() - 1) {
      case 0:
        this.timesheet[this.timesheetIndex].Mondayhrs = inputs.billableHours;
        this.timesheet[this.timesheetIndex].Mondaydesc = inputs.noteForBillableHours;
        this.timesheet[this.timesheetIndex].Mondaynbhrs = inputs.nonBillableHours;
        this.timesheet[this.timesheetIndex].Mondaydescnb = inputs.noteForNonBillableHours;
        break;
      case 1:
        this.timesheet[this.timesheetIndex].Tuesdayhrs = inputs.billableHours;
        this.timesheet[this.timesheetIndex].Tuesdaydesc = inputs.noteForBillableHours;
        this.timesheet[this.timesheetIndex].Tuesdaynbhrs = inputs.nonBillableHours;
        this.timesheet[this.timesheetIndex].Tuesdaydescnb = inputs.noteForNonBillableHours;
        break;
      case 2:
        this.timesheet[this.timesheetIndex].Wednesdayhrs = inputs.billableHours;
        this.timesheet[this.timesheetIndex].Wednesdaydesc = inputs.noteForBillableHours;
        this.timesheet[this.timesheetIndex].Wednesdaynbhrs = inputs.nonBillableHours;
        this.timesheet[this.timesheetIndex].Wednesdaydescnb = inputs.noteForNonBillableHours;
        break;
      case 3:
        this.timesheet[this.timesheetIndex].Thursdayhrs = inputs.billableHours;
        this.timesheet[this.timesheetIndex].Thursdaydesc = inputs.noteForBillableHours;
        this.timesheet[this.timesheetIndex].Thursdaynbhrs = inputs.nonBillableHours;
        this.timesheet[this.timesheetIndex].Thursdaydescnb = inputs.noteForNonBillableHours;
        break;
      case 4:
        this.timesheet[this.timesheetIndex].Fridayhrs = inputs.billableHours;
        this.timesheet[this.timesheetIndex].Fridaydesc = inputs.noteForBillableHours;
        this.timesheet[this.timesheetIndex].Fridaynbhrs = inputs.nonBillableHours;
        this.timesheet[this.timesheetIndex].Fridaydescnb = inputs.noteForNonBillableHours;
        break;
      case 5:
        this.timesheet[this.timesheetIndex].Saturdayhrs = inputs.billableHours;
        this.timesheet[this.timesheetIndex].Saturdaydesc = inputs.noteForBillableHours;
        this.timesheet[this.timesheetIndex].Saturdaynbhrs = inputs.nonBillableHours;
        this.timesheet[this.timesheetIndex].Saturdaydescnb = inputs.noteForNonBillableHours;
        break;
      case 6:
        this.timesheet[this.timesheetIndex].Sundayhrs = inputs.billableHours;
        this.timesheet[this.timesheetIndex].Sundaydesc = inputs.noteForBillableHours;
        this.timesheet[this.timesheetIndex].Sundaynbhrs = inputs.nonBillableHours;
        this.timesheet[this.timesheetIndex].Sundaydescnb = inputs.noteForNonBillableHours;
        break;
      default:
        alert('Something went wrong!');
        break;
    }
    
  }

}
