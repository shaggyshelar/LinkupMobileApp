import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HROperation } from '../models/HROperations';
import { LeaveService } from '../../LeaveManagement/index';
import { ToastService } from '../../../providers/shared/services/toast.service';
/*
  Generated class for the ResignedEmployeeLeaves page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-resigned-employee-leaves',
  templateUrl: 'resigned-employee-leaves.html',
  providers : [ToastService]
})
export class ResignedEmployeeLeavesPage {
  HR = new HROperation();
  selectedEmployeeDetails : any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public leaveService:LeaveService, public toastService:ToastService) {
    this.selectedEmployeeDetails = [];
  }

  ionViewDidLoad() {
    this.selectedEmployeeDetails = this.navParams.get('selectedEmp');
    this.showEmployeeDetails(this.selectedEmployeeDetails);
  }
  showEmployeeDetails (selectedEmployee : any) {
    this.HR.Employee = selectedEmployee.EmpID;
    this.HR.LeaveBalance = selectedEmployee.LeaveDetails.LeaveBalance;
    this.HR.ActualLeaveBalance = selectedEmployee.LeaveDetails.ActualBalance;
    this.HR.FHBalance = selectedEmployee.LeaveDetails.FloatingHolidayBalance;
    this.HR.ActualFHBalance = selectedEmployee.LeaveDetails.ActualFHBalance;
    this.HR.LeaveTaken = selectedEmployee.LeaveDetails.LeaveTaken;
    this.HR.RegistrationDate = selectedEmployee.ResignationDate;
  }
  onSubmit() {
    let payload= {
        EmployeeLeaves:{
           LeaveBalance: this.HR.LeaveBalance,
           LeaveTaken: this.HR.LeaveTaken,
           FloatingHolidayBalance: this.HR.FHBalance,
           EmpID:this.HR.Employee,
           ID: this.selectedEmployeeDetails.ID
        },
        ResignationDate:this.HR.RegistrationDate
    }
    this.leaveService.updateResignedEmpLeave(payload).subscribe((res: any) => {
       this.toastService.createToast('Data submitted successfully');
    });
  }
}
