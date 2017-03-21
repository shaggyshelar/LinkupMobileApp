import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment/moment';
import { LeaveService } from '../../LeaveManagement/index';
import { EmployeeLeaveBalancePage } from '../employee-leave-balance/employee-leave-balance';
import { SpinnerService } from '../../../providers/index';
/*
  Generated class for the ManageEmployeeLeaveBalance page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-manage-employee-leave-balance',
  templateUrl: 'manage-employee-leave-balance.html',
  providers: [SpinnerService]
})
export class ManageEmployeeLeaveBalancePage {
  employeeLeaveList: any[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public leaveService: LeaveService,
    public spinnerService: SpinnerService) {
    this.employeeLeaveList = [];
  }

  ionViewDidLoad() {
    this.getEmployeeLeaveList();
  }
  getEmployeeLeaveList() {
    let financialYear = moment().year();
    if (moment().month() <= 2) {
      financialYear = financialYear - 1;
    }
    this.spinnerService.createSpinner('Please wait');
    this.leaveService.getEmployeeLeaveBalance(financialYear.toString()).subscribe((res: any) => {
      this.spinnerService.stopSpinner();
      this.employeeLeaveList = res;
    }, error => {
      this.spinnerService.stopSpinner();
    });
  }
  goToEmpLeaveDetail(empLeaveDetails: any) {
    this.navCtrl.push(EmployeeLeaveBalancePage, { selectedEmployee: empLeaveDetails });
  }
}
