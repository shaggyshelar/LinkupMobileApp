import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { ApproveTimesheetDetailsPage } from '../approve-timesheet-details/approve-timesheet-details';

import { EmployeeTimesheetService } from '../index';
import { EmployeeTimeSheet } from '../models/employee-timesheet.model';


@Component({
  selector: 'page-approve-timesheet',
  templateUrl: 'approve-timesheet.html'
})
export class ApproveTimesheetPage {

  public approveEmployee : Observable<EmployeeTimesheetService>;

  constructor(public navCtrl: NavController
  , public navParams: NavParams
  , private employeeTimesheetService : EmployeeTimesheetService
  , public loadingCtrl : LoadingController) {

   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveTimesheetPage');
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(()=>{
      this.employeeTimesheetService.getApproverPendingTimesheets().subscribe((res:any)=> {
        if(res.length > 0)
          this.approveEmployee = res.reverse();
        console.log('approveEmployee => ', this.approveEmployee[0]);
        loader.dismiss();
      });
    });
  }

  itemTapped(entry) {
    this.navCtrl.push(ApproveTimesheetDetailsPage, {id: entry.ID});
  }

}
