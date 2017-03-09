import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

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
  employeeTimesheet : Observable<any>;
  comment: String = '';

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private employeeTimesheetService : EmployeeTimesheetService
  , public loadingCtrl : LoadingController) {
   }

  ionViewDidLoad() {
    this.timesheetID = this.navParams.data.id;

    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(()=>{
      this.employeeTimesheetService.getTimesheetApprovalData(this.timesheetID).subscribe((res:any)=> {
        // if(res)
          this.employeeTimesheet = res.ApproverTimesheet;
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });
  }

  approveClicked() {
    /** PUT API call  */
    this.navCtrl.pop(ApproveTimesheetPage);
  }

  rejectClicked() {
    /** PUT API call  */
    this.navCtrl.pop(ApproveTimesheetPage);
  }

}
