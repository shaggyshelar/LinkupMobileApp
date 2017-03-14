import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'ng2-cache/ng2-cache';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EmployeeTimesheetService } from '../index';

import { ApproveTimesheetPage } from '../approve-timesheet/approve-timesheet';
/*
  Generated class for the TimesheetDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-approve-timesheet-details',
  templateUrl: 'approve-timesheet-details.html'
})
export class ApproveTimesheetDetailsPage {

  timesheetID: Number = 0;
  employeeTimesheet: any;
  payload: any;
  comment: String = '';
  approveTimesheetForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , private employeeTimesheetService: EmployeeTimesheetService
    , public loadingCtrl: LoadingController
    , public cacheService: CacheService
    , public formBuilder: FormBuilder
  ) {
    this.approveTimesheetForm = formBuilder.group({
      comment: ['', Validators.compose([Validators.minLength(3), Validators.required])]
    });
  }

  ionViewDidLoad() { }
  ionViewDidEnter() {
    this.timesheetID = this.navParams.data.id;

    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.employeeTimesheetService.getTimesheetApprovalData(this.timesheetID).subscribe((res: any) => {
        // if(res)
        this.employeeTimesheet = res.ApproverTimesheet;
        this.payload = res;
        console.log(JSON.stringify(res));
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });
  }

  approveClicked() {
    if (this.approveTimesheetForm.valid) {
      var loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loader.present().then(() => {
        this.payload.Comments = this.comment;
        this.employeeTimesheetService.approveTimesheet(this.payload).subscribe(res => {
          this.clearCache();
          loader.dismiss();
          console.log(res);
          this.navCtrl.pop();
        }, (err) => {
          loader.dismiss();
          this.navCtrl.pop();
        });
      });
    }

  }

  rejectClicked() {
    if (this.approveTimesheetForm.valid) {
      var loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loader.present().then(() => {
        this.payload.Comments = this.comment;
        this.employeeTimesheetService.rejectTimesheet(this.payload).subscribe(res => {
          this.clearCache();
          loader.dismiss();
          this.navCtrl.pop();
        }, (err) => {
          loader.dismiss();
          this.navCtrl.pop();
        });
      });
    }
  }

  clearCache() {
    if (this.cacheService.exists('timesheetApprovalData' + this.timesheetID)) {
      this.cacheService.remove('timesheetApprovalData' + this.timesheetID);
    }
  }

}
