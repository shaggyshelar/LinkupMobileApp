import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the MyTimesheet page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-timesheet',
  templateUrl: 'my-timesheet.html'
})
export class MyTimesheetPage {

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
    console.log('ionViewDidLoad MyTimesheetPage');
  }

  editClicked(item) {
    alert('Takes you to Edit Timesheet Page');
  }

}
