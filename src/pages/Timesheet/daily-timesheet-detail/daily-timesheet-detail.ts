import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-daily-timesheet-detail',
  templateUrl: 'daily-timesheet-detail.html'
})
export class DailyTimesheetDetailPage {

  dailyData : any = {};
  dailyTimesheetForm : FormGroup;
  isViewModeBillable : Boolean = true;
  isViewModeNonBillable : Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private formBuilder: FormBuilder
  ) {
    this.dailyTimesheetForm = this.formBuilder.group({
      billableHours:['',Validators.compose([Validators.required])],
      noteForBillableHours:['',Validators.compose([Validators.required])],
      nonBillableHours:['',Validators.compose([Validators.required])],
      noteForNonBillableHours:['',Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailyTimesheetDetailPage');
    console.log('data => ', this.navParams.data);
    this.dailyData = this.navParams.data;
  }

}
