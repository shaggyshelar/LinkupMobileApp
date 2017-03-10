import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController,ModalController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { ApproveTimesheetDetailsPage } from '../approve-timesheet-details/approve-timesheet-details';

import { EmployeeTimesheetService } from '../index';
import { EmployeeTimeSheet } from '../models/employee-timesheet.model';
import { ApproveTimesheetFilterPage } from '../approve-timesheet-filter/approve-timesheet-filter';

@Component({
  selector: 'page-approve-timesheet',
  templateUrl: 'approve-timesheet.html'
})
export class ApproveTimesheetPage {

  public approveEmployee : Observable<EmployeeTimesheetService>;
  public isDescending:boolean = true;
  constructor(public navCtrl: NavController
  , public navParams: NavParams
  , private employeeTimesheetService : EmployeeTimesheetService
  , public loadingCtrl : LoadingController
  , public actionSheetCtrl : ActionSheetController
  , public modalCtrl: ModalController) {

   }

  ionViewDidLoad() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(()=>{
      this.employeeTimesheetService.getApproverPendingTimesheets().subscribe((res:any)=> {
        if(res.length > 0) {
          this.approveEmployee = res.reverse();
          localStorage.setItem('approveTimesheetsBadgeCount', res.length);
        }
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });
  }

  itemTapped(entry) {
    this.navCtrl.push(ApproveTimesheetDetailsPage, {id: entry.ID});
  }
  onFilter() {
    let modal = this.modalCtrl.create(ApproveTimesheetFilterPage);
    modal.present();
  }
  onSort() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sort Your Timesheets',
      buttons: [
        {
          text: 'Date Ascending',
          role: 'date ascending',
          handler: () => {
            if(this.isDescending === false) {
             // this.approveEmployee.ApproverUser.reverse();
              this.isDescending = true;
            }
          }
        },{
          text: 'Date Descending',
          role: 'date descending',
          handler: () => {
            if(this.isDescending) {
             // this.approveEmployee.reverse();
              this.isDescending = false;
            }
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    actionSheet.present();
  }

}
