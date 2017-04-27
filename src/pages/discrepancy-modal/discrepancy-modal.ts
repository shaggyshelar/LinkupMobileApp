import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';

import { MessageService, SpinnerService, EmployeeDiscrepancyService, AuthService } from '../../providers/index';

import { ApplyForLeavePage } from '../LeaveManagement/apply-for-leave/apply-for-leave';
import { Discrepancy } from './discrepancy';

/*
  Generated class for the DiscrepancyModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-discrepancy-modal',
  templateUrl: 'discrepancy-modal.html'
})
export class DiscrepancyModalPage {
  userDetail: any;
  discrepancyData: any;
  biometricReasons: any[];
  showReason: boolean;
  showDateRange: boolean;
  wasLeaveTaken: boolean;
  data: Discrepancy;
  complexForm: FormGroup;
  minDate: any;
  constructor(public navCtrl: NavController, public navParams: NavParams
    , public discrepancyService: EmployeeDiscrepancyService
    , public fb: FormBuilder
    , public auth: AuthService
    , public viewCtrl: ViewController
  ) {
    this.discrepancyData = {};
    this.biometricReasons = [];
    this.showReason = false;
    this.showDateRange = false;
    this.wasLeaveTaken = false;
    this.complexForm = fb.group({
      'Reason': [, Validators.required],
      'SpecifyReason': [],
      'From': [],
      'To': []
    });
    this.userDetail = this.auth.getCurrentUser();
    this.discrepancyData = this.navParams.data;
    console.log('discrepancyData => ', this.discrepancyData);
    this.getReasonsMaster();
    this.initModel();
  }

  ionViewDidLoad() {

  }

  initModel() {
    // this.data = {
    //   ID: 0,
    //   Employee: { Name: '', ID: 0 },
    //   SpecifyReason: '',
    //   From: '',
    //   To: ''
    // };
  }

  getReasonsMaster() {
    this.discrepancyService.getBioMetricReasons().subscribe(res => {
      this.biometricReasons = res;
      console.log('reasons => ', res);
    });

  }

  submitPayload(formValue) {
    // this.data.Employee = this.userDetail.Employee;
    // this.data.SpecifyReason = formValue.SpecifyReason;
    // this.data.From = moment(formValue.From).toISOString();
    // this.data.To = moment(formValue.To).toISOString();
    // this.data.ID = this.discrepancyData.ID;
    // console.log('discrepancy payload =>', this.data);
  }

  submitClick(formValue) {
    if (this.wasLeaveTaken) {
      // this.navCtrl.push(ApplyForLeavePage, { date: this.discrepancyData.LeaveDate });
      // this.wasLeaveTaken = false;
      this.viewCtrl.dismiss({
        date: this.discrepancyData.LeaveDate,
        wasLeaveTaken: this.wasLeaveTaken
      });
    } else {
      this.submitPayload(formValue);
      // POST API Call
      // this.navCtrl.pop();
      this.viewCtrl.dismiss({
        date: null,
        wasLeaveTaken: this.wasLeaveTaken
      });
    }
  }

  reasonChanged(event) {
    var filtered = {};
    if (event && event.trim() != '') {
      filtered = this.biometricReasons.find((item) => {
        return (item.Reason.toLowerCase().indexOf(event.toLowerCase()) > -1);
      });
    }

    this.updateView(filtered);
    this.updateForm(event);
  }

  updateView(filtered) {
    switch (filtered.ID) {
      case 1:   //WFH
        this.showDateRange = true;
        this.showReason = false;
        break;

      case 2:   //Leave
        this.showReason = false;
        this.showDateRange = false;
        this.wasLeaveTaken = true;
        break;

      case 3:   //Clientside
        this.showReason = false;
        this.showDateRange = true;
        break;

      case 5:   //Out of Office Duty
        this.showReason = true;
        this.showDateRange = true;
        break;

      case 6:   //Other
        this.showReason = true;
        this.showDateRange = false;
        break;
    }
  }

  updateForm(reasonValue) {
    this.complexForm = this.fb.group({
      'Reason': [reasonValue, Validators.required],
      'SpecifyReason': [null, this.showReason ? Validators.required : null],
      'From': [null, this.showDateRange ? Validators.required : null],
      'To': [null, this.showDateRange ? Validators.required : null]
    });
  }

  fromDateChanged(event) {
    this.minDate = moment(event.month.text + '/' + event.day.text + '/' + event.year.text).toISOString();
    console.log('from date change => ', this.minDate);
  }

}
