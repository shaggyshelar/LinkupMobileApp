import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DailyTimesheet } from '../models/daily-timesheet.model';

@Component({
  selector: 'page-daily-timesheet-detail',
  templateUrl: 'daily-timesheet-detail.html'
})
export class DailyTimesheetDetailPage {

  dailyData : DailyTimesheet;
  dailyTimesheetForm : FormGroup;
  isViewModeBillable : Boolean = true;
  isViewModeNonBillable : Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private formBuilder: FormBuilder
  ) {
    this.dailyTimesheetForm = this.formBuilder.group({
      billableHours:[{value: this.navParams.data.readOnly ? this.navParams.data.dailyData.BillableHours :'' , disabled: this.navParams.data.readOnly}],
      noteForBillableHours:[{value: this.navParams.data.readOnly ? this.navParams.data.dailyData.NoteForBillableHours :'' , disabled: this.navParams.data.readOnly}],
      nonBillableHours:[{value: this.navParams.data.readOnly ? this.navParams.data.dailyData.NonBillableHours :'' , disabled: this.navParams.data.readOnly}],
      noteForNonBillableHours:[{value: this.navParams.data.readOnly ? this.navParams.data.dailyData.NoteForNonBillableHours :'' , disabled: this.navParams.data.readOnly}],
    });
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
    //console.log('enterTimesheetMode');
    this.dailyData.BillableHours = this.dailyData.NonBillableHours = this.dailyData.NoteForBillableHours = this.dailyData.NoteForNonBillableHours = '';
  }

}
