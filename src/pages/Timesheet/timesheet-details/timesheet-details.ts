import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import * as moment from 'moment/moment';

import { TimesheetService } from '../index';
import { Timesheet } from '../models/timesheet.model';

import { TaskDetailPage } from '../task-detail/task-detail';

@Component({
  selector: 'page-timesheet-details',
  templateUrl: 'timesheet-details.html'
})
export class TimesheetDetailsPage {
  timesheetID: Number = 0;
  employeeTimesheet : any;
  timesheets : any;

  dayRec: any={
    start: null,
    end: null,
    days: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams
    , private timesheetService: TimesheetService
    , public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {

    switch (this.navParams.data.caller) {
      case 'enter-timesheet':
        //console.log('enter-timesheet => timesheet-details');
        this.enterTimesheet();
        break;
      case 'my-timesheet':
        //console.log('my-timesheet => timesheet-details');
        this.getMyTimesheetDetails(this.navParams.data.payload.ID);
        break;

      default:
        //console.log('unknown => timesheet-details');
        this.enterTimesheet();
        break;
    }

    

  }

  enterTimesheet() {
    this.getMyTimesheetDetails(1);  //getting stub data
    // this.navCtrl.push(DailyTimesheetDetailPage, { readOnly: false });
  }

  getMyTimesheetDetails(id) {
    this.timesheetID = id;

    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.timesheetService.getMyTimesheet(id).subscribe((res: any) => {
        this.employeeTimesheet = res;
        this.timesheets = res.Timesheets;
        console.log(res);
        console.log(this.employeeTimesheet.Timesheets.length);
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });

  }

  itemClicked(rec) {
    this.navCtrl.push(TaskDetailPage, rec);
  }

  // arrangeDays() {
  //   console.log(this.employeeTimesheet.StartDate);
  //   this.dayRec = {
  //     start: moment(this.employeeTimesheet.StartDate),
  //     end: moment(this.employeeTimesheet.EndDate)
  //   };
  //   var dayData = [];
  //   for (var i = 0; i < 7; i++) {
     
  //      dayData.push({
  //         day: moment(this.employeeTimesheet.StartDate).add(i,'days'),
  //       });
     
  //   }

  //   this.dayRec.days = dayData;
  //   console.log(this.dayRec.start);
  //   console.log(this.dayRec.end);


  // }

}
