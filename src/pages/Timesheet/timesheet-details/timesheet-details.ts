import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ApproveTimesheetPage } from '../approve-timesheet/approve-timesheet';
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

  leaveData = {
      Employee: {
        Name: "Aradhana Chindhade",
        ID: 334
      },
      EmpID: null,
      SubmittedStatus: "Approved",
      Comments: "Approved by Super Approval Kunal Kirankumar Adhikari",
      BillableTotal: "6:30",
      NonBillableTotal: "4:0",
      TotalHours: "10:30",
      ApproverTimesheet: [
        {
          Date: "Monday, 24-Oct-16",
          Project: {
            Value: "ESPL - Practice Management - MSPlus",
            ID: 25
          },
          Task: "SelfStudy/Bench",
          BillableHours: null,
          NonBillableHours: "01:00",
          TotalHours: "1:0",
          NoteForBillableHours: null,
          NoteForNonBillableHours: "TL Meeting for planning project coverage during diwali based on team's leave plans "
        },
        {
          Date: "Tuesday, 25-Oct-16",
          Project: {
            Value: "ESPL - Practice Management - MSPlus",
            ID: 25
          },
          Task: "SelfStudy/Bench",
          BillableHours: null,
          NonBillableHours: "01:00",
          TotalHours: "1:0",
          NoteForBillableHours: null,
          NoteForNonBillableHours: "TL Meeting for planning project coverage during diwali based on team's leave plans "
        },
        {
          Date: "Wednesday, 26-Oct-16",
          Project: {
            Value: "ESPL - Practice Management - MSPlus",
            ID: 25
          },
          Task: "SelfStudy/Bench",
          BillableHours: null,
          NonBillableHours: "01:00",
          TotalHours: "1:0",
          NoteForBillableHours: null,
          NoteForNonBillableHours: "TL Meeting for planning project coverage during diwali based on team's leave plans "
        },
        {
          Date: "Thursday, 27-Oct-16",
          Project: {
            Value: "ESPL - Practice Management - MSPlus",
            ID: 25
          },
          Task: "SelfStudy/Bench",
          BillableHours: null,
          NonBillableHours: "01:00",
          TotalHours: "1:0",
          NoteForBillableHours: null,
          NoteForNonBillableHours: "TL Meeting for planning project coverage during diwali based on team's leave plans "
        },
        {
          Date: "Friday, 28-Oct-16",
          Project: {
            Value: "ESPL - Practice Management - MSPlus",
            ID: 25
          },
          Task: "SelfStudy/Bench",
          BillableHours: null,
          NonBillableHours: "01:00",
          TotalHours: "1:0",
          NoteForBillableHours: null,
          NoteForNonBillableHours: "TL Meeting for planning project coverage during diwali based on team's leave plans "
        },
      ],
      ID: 0
    };
  comment: String = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimesheetDetailsPage');
    this.leaveData = this.navParams.data;
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
