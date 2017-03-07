import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TimesheetDetailsPage } from '../timesheet-details/timesheet-details';

/*
  Generated class for the ApproveTimesheet page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-approve-timesheet',
  templateUrl: 'approve-timesheet.html'
})
export class ApproveTimesheetPage {

  timeRec : any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.timeRec = [
      {
        ApproverUser: 'Kunal Adhikari',
        StartDate: '06/03/2017',
        EndDate: '12/03/2017',
        BillableHours:'40:0',
        NonBillableHours:'0:0',
        Status:'Approved',
        SubmissionDate: '10/03/2017'
      },
      {
        ApproverUser: 'Kunal Adhikari',
        StartDate: '13/03/2017',
        EndDate: '19/03/2017',
        BillableHours:'40:0',
        NonBillableHours:'0:0',
        Status:'Pending',
        SubmissionDate: '18/03/2017'
      },
      {
        ApproverUser: 'Kunal Adhikari',
        StartDate: '20/03/2017',
        EndDate: '26/03/2017',
        BillableHours:'40:0',
        NonBillableHours:'0:0',
        Status:'Rejected',
        SubmissionDate: '18/03/2017'
      },
    ];
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveTimesheetPage');
  }

  itemTapped(entry) {
    this.navCtrl.push(TimesheetDetailsPage, entry);
  }

}
