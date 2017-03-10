import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

// import { EmployeeTimesheetService } from '../index';

import { DailyTimesheetDetailPage } from '../daily-timesheet-detail/daily-timesheet-detail';

/*
  Generated class for the TimesheetDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-timesheet-details',
  templateUrl: 'timesheet-details.html'
})
export class TimesheetDetailsPage {
  timesheetID : Number = 0;
  employeeTimesheet = [
    {Date:"Monday, 1/27/2017",Project:{Value:"MMC",ID:219},Task:"Development",BillableHours:null,NonBillableHours:"08:00",TotalHours:"8:0",NoteForBillableHours:null,NoteForNonBillableHours:"xzfg"},{Date:"Tuesday, 1/28/2017",Project:{Value:"MMC",ID:219},Task:"Development",BillableHours:null,NonBillableHours:"08:00",TotalHours:"8:0",NoteForBillableHours:null,NoteForNonBillableHours:"dfg"},{Date:"Wednesday, 1/29/2017",Project:{Value:"MMC",ID:219},Task:"Development",BillableHours:null,NonBillableHours:"08:00",TotalHours:"8:0",NoteForBillableHours:null,NoteForNonBillableHours:"fujfuj"},{Date:"Thursday, 1/30/2017",Project:{Value:"MMC",ID:219},Task:"Development",BillableHours:null,NonBillableHours:"08:00",TotalHours:"8:0",NoteForBillableHours:null,NoteForNonBillableHours:"dj"},{Date:"Friday, 1/31/2017",Project:{Value:"MMC",ID:219},Task:"Development",BillableHours:null,NonBillableHours:"08:00",TotalHours:"8:0",NoteForBillableHours:null,NoteForNonBillableHours:"dyjj"}
    ];
  constructor(public navCtrl: NavController, public navParams: NavParams
  // , private employeeTimesheetService : EmployeeTimesheetService
  , public loadingCtrl : LoadingController) {
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimesheetDetailsPage');
    this.timesheetID = this.navParams.data.id;

    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    /** TODO: Implement API Service call, Loader  */
    // loader.present().then(()=>{
    //   this.employeeTimesheetService.getTimesheetApprovalData(this.timesheetID).subscribe((res:any)=> {
    //     // if(res)
    //       this.employeeTimesheet = res.ApproverTimesheet;
    //     console.log('employeeTimesheet => ', res.ApproverTimesheet);
        
    //     loader.dismiss();
    //   });
    // });
  }

  recordTapped(rec) {
    console.log('rec => ',rec);
    this.navCtrl.push(DailyTimesheetDetailPage, rec);
  }

}
