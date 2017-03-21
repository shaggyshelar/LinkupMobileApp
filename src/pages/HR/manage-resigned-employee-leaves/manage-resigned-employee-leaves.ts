import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LeaveService } from '../../LeaveManagement/index';
import { ResignedEmployeeLeavesPage } from '../resigned-employee-leaves/resigned-employee-leaves';
import { SpinnerService } from '../../../providers/index';
/*
  Generated class for the ManageResignedEmployeeLeaves page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-manage-resigned-employee-leaves',
  templateUrl: 'manage-resigned-employee-leaves.html',
  providers: [SpinnerService]
})
export class ManageResignedEmployeeLeavesPage {
  resignedEmpList: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public leaveService: LeaveService, public spinnerService: SpinnerService) {
    this.resignedEmpList = [];
  }

  ionViewDidLoad() {
    this.getResignedEmployeeList()
  }
  getResignedEmployeeList() {
    this.spinnerService.createSpinner('Please wait');
    this.leaveService.getResignedEmployeeLeave().subscribe((res: any) => {
      this.spinnerService.stopSpinner();
      this.resignedEmpList = res;
    }, error => {
      this.spinnerService.stopSpinner();
    });
  }
  goToResignedEmpDetail(resignedEmp: any) {
    this.navCtrl.push(ResignedEmployeeLeavesPage, { selectedEmp: resignedEmp });
  }

}
