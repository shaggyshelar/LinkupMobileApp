import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';

import { MessageService, SpinnerService, EmployeeDiscrepancyService, AuthService } from '../../providers/index';

import { ApplyForLeavePage } from '../LeaveManagement/apply-for-leave/apply-for-leave';
import { Discrepancy } from './discrepancy';
import { LeaveService } from '../LeaveManagement/services/leave.service';
import { LeaveTypeMasterService } from '../../providers/shared/master/leaveTypeMaster.service';

@Component({
  selector: 'page-discrepancy-modal',
  templateUrl: 'biometric-discrepancy-modal.html'
})
export class DiscrepancyModalPage {
  userDetail: any;
  discrepancyData: any;
  biometricReasons: any[];
  leaveTypes: any[] = [];
  showReason: boolean;
  showDateRange: boolean;
  wasLeaveTaken: boolean;
  data: Discrepancy;
  complexForm: FormGroup;
  minDate: any;
  maxDate: any;
  reasonID: number = 999;
  constructor(public navCtrl: NavController, public navParams: NavParams
    , public discrepancyService: EmployeeDiscrepancyService
    , public fb: FormBuilder
    , public auth: AuthService
    , public leaveService: LeaveService
    , public leaveMaster: LeaveTypeMasterService
    , public viewCtrl: ViewController
    , private toastCtrl: ToastController
  ) {
    this.discrepancyData = [];
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
    var data = this.navParams.data;
    data.forEach(element => {
      this.discrepancyData.push(element);
    });
    this.checkIfAlreadyApplied();
    this.getReasonsMaster();
    // this.initModel();
  }

  ionViewDidLoad() { }

  getTypeofLeaves() {
    this.leaveMaster.getLeaveTypes().subscribe((res) => {
      res.forEach(element => {
        this.leaveTypes.push({ Id: res.ID, Value: res.Name });
      });
    });
  }

  checkIfAlreadyApplied() {
    var discrepancyDates = [];
    var discrepancyIndex = [];
    var spliced = []
    this.discrepancyData.forEach((element, index) => {
      this.leaveService.getCurrentUserLeaveDiscrepancy({ Date: element.LeaveDate }).subscribe(res => {
        if (res.length > 0)
          discrepancyDates = res;
      });
    });

    /* Check entries that match discrepancy and applied leave WRT date */
    if (discrepancyDates.length > 0)
      this.discrepancyData.forEach((element, index) => {
        discrepancyDates.forEach((item) => {
          if (element.LeaveDate == item.StartDate) {
            discrepancyIndex.push(index);
          }
        });
      });

    /* Separate discrepancy (in this.discrepancyData) and applied leave (in spliced[]) */
    if (discrepancyIndex.length > 0) {
      discrepancyIndex.forEach(item => {
        var splice = this.discrepancyData.splice(item, 1);
        if (splice.length > 0)
          splice.forEach(element => {
            spliced.push(element);
          });
      });
    }

    /* TODO : Assemble contents (of spliced[]) for update API call */
    var payload = [];
    spliced.forEach(element => {
      payload.push({
        ID: element.ID,
        Employee: this.userDetail.Employee,
        Approvers: [],
        Department: this.userDetail.Department.Value,
        LeaveDate: element.LeaveDate,
        LeaveReason: 'Leave',
        ReasonDetails: 'Leave',
        EmployeeID: this.userDetail.EmpID
      });
    });

    /* TODO : Make API call for each entry's contents in spliced[]  */
    payload.forEach(element => {
      this.discrepancyService.updateEmployeeDiscrepancy(element).subscribe(res => {
        if (res.StatusCode == 1) {
          // this.toastPresent('Entry submitted successfully');
          // this.clearLocalstorageFlags();
        } else {
          this.toastPresent(res.Message);
        }
      }, err => {
      });
    });
  }

  initModel() {
    return {
      ID: 0,
      Employee: { Name: '', ID: 0 },
      Approvers: [],
      Department: '',
      LeaveDate: '',
      LeaveReason: '',
      ReasonDetails: '',
      EmployeeID: 0,
      ApproverStatus: ''
    };
  }

  getReasonsMaster() {
    this.discrepancyService.getBioMetricReasons().subscribe(res => {
      this.biometricReasons = res;
    });

  }

  submitRangedPayload(formValue) {
    let toForm = moment(formValue.To).add(1, 'day');
    let fromForm = moment(formValue.From);
    let dayDiff = moment(toForm).diff(fromForm, 'days');
    let payload: Discrepancy[] = [];
    for (var index = 0; index <= dayDiff; index++) {
      payload.push({
        ID: this.discrepancyData[index].ID,
        Employee: this.userDetail.Employee,
        Approvers: [],
        Department: this.userDetail.Department.Value,
        LeaveDate: this.discrepancyData[index].LeaveDate,
        LeaveReason: formValue.Reason,
        ReasonDetails: formValue.SpecifyReason,
        EmployeeID: this.userDetail.EmpID,
        ApproverStatus: ''
      });
    }

    return payload;
  }

  submitPayload(formValue) {
    let payload: Discrepancy = this.initModel();
    payload.ID = this.discrepancyData[0].ID;
    payload.Employee = this.userDetail.Employee;
    payload.Approvers = [];
    payload.Department = this.userDetail.Department.Value;
    payload.LeaveDate = this.discrepancyData[0].LeaveDate;
    payload.LeaveReason = formValue.Reason;
    payload.ReasonDetails = formValue.SpecifyReason;
    payload.EmployeeID = this.userDetail.EmpID;
    return payload;
  }

  submitClick(formValue) {
    if (this.wasLeaveTaken) {
      localStorage.setItem('discrepancyDataToApplyLeave', JSON.stringify(this.discrepancyData));
      this.viewCtrl.dismiss({
        date: this.discrepancyData[0].LeaveDate,
        wasLeaveTaken: this.wasLeaveTaken
      });
    }
    else {
      this.submitPayload(formValue);
      if (this.reasonID == 1 || this.reasonID == 3 || this.reasonID == 5) {
        var errMsg, okFlag;
        var payload = this.submitRangedPayload(formValue);

        payload.forEach((entry, index) => {
          this.discrepancyService.updateEmployeeDiscrepancy(entry).subscribe(res => {
            res.StatusCode == 1 ? this.toastPresent('Entry submitted successfully') : this.toastPresent(res.Message);
          });
          this.clearLocalstorageFlags();
        });

      }
      if (this.reasonID == 6) {

        this.discrepancyService.updateEmployeeDiscrepancy(this.submitPayload(formValue)).subscribe(res => {
          if (res.StatusCode == 1) {
            this.toastPresent('Entry submitted successfully');
            this.clearLocalstorageFlags();
          } else {
            this.toastPresent(res.Message);
          }
        }, err => {
        });

      }
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
    this.reasonID = filtered.ID;
    switch (filtered.ID) {
      case 1:   //WFH
        this.showDateRange = true;
        this.showReason = false;
        this.wasLeaveTaken = false;
        break;

      case 2:   //Leave
        this.showReason = false;
        this.showDateRange = false;
        this.wasLeaveTaken = true;
        break;

      case 3:   //Clientside
        this.showReason = false;
        this.showDateRange = true;
        this.wasLeaveTaken = false;
        break;

      case 5:   //Out of Office Duty
        this.showReason = true;
        this.showDateRange = true;
        this.wasLeaveTaken = false;
        break;

      case 6:   //Other
        this.showReason = true;
        this.showDateRange = false;
        this.wasLeaveTaken = false;
        break;
    }
  }

  updateForm(reasonValue) {
    this.complexForm = this.fb.group({
      'Reason': [reasonValue, Validators.required],
      'SpecifyReason': [null, this.showReason ? Validators.required : null],
      'From': [this.discrepancyData[0].LeaveDate, this.showDateRange ? Validators.required : null],
      'To': [null, this.showDateRange ? Validators.required : null]
    });
    this.minDate = moment(this.discrepancyData[0].LeaveDate).format('YYYY-MM-DD');
    this.maxDate = moment(this.minDate).add(5, 'years').format('YYYY-MM-DD');
  }

  fromDateChanged(event) {
    this.minDate = moment(event.month.text + '/' + event.day.text + '/' + event.year.text).add(1, 'days').toISOString();
    this.maxDate = moment(this.minDate).add(5, 'years').toISOString();
  }

  toastPresent(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

  clearLocalstorageFlags() {
    localStorage.removeItem('blockHardwareBackButton');
    localStorage.removeItem('biometricDiscrepancyPresent');
  }
}
