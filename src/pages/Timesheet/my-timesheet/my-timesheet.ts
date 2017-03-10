import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { EmployeeTimesheetService } from '../index';

import { TimesheetDetailsPage } from '../timesheet-details/timesheet-details';
import { EnterTimesheetPage } from '../enter-timesheet/enter-timesheet';

/** TODO: TimesheetDetails Import */

@Component({
  selector: 'page-my-timesheet',
  templateUrl: 'my-timesheet.html'
})
export class MyTimesheetPage {

  timesheetRec: Observable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams
  , private employeeTimesheetService : EmployeeTimesheetService
  , public loadingCtrl : LoadingController) {
   }

  ionViewDidLoad() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(()=>{
      this.employeeTimesheetService.getMyTimesheets().subscribe((res:any)=> {
        if(res.length > 0)
          this.timesheetRec = res;
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
        //console.log(err);
      }
      );
    });

  }

  editClicked(item) {
    alert('Takes you to Edit Timesheet Page');
  }

  itemClicked(entry) {
    //alert('id => '+ entry.ID);
    this.navCtrl.push(TimesheetDetailsPage, {payload: entry, caller : 'my-timesheet'});
  }

  addFabClicked() {
    this.navCtrl.push(EnterTimesheetPage , { caller : 'my-timesheet' });
  }

}
