import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HROperation } from '../models/HROperations';
import { LeaveService } from '../../../pages/LeaveManagement/services/leave.service';
import { ToastService } from '../../../providers/shared/services/toast.service';
/*
  Generated class for the EmployeeLeaveBalance page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-employee-leave-balance',
  templateUrl: 'employee-leave-balance.html',
  providers : [ToastService]
})
export class EmployeeLeaveBalancePage {
  complexForm : FormGroup;
  selectedEmployeeDetails : any;
  HR = new HROperation();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public leaveService:LeaveService,
              public toastService:ToastService,
              public fb: FormBuilder) {
                this.complexForm = fb.group({
                  'adjustmententry' : [null, Validators.required],
                  'currentyear' : [null],
                  'empid' : [null],
                  'employee' : [null],
                  'prevleavebal' : [null],
                  'acuredleave' : [null],
                  'adjustmententrytype' : [null],
                  'paternityentry' : [null],
                  'marriageentry' : [null],
                  'maternityentry' : [null],
                  'leavetaken' : [null],
                  'halfdayleave' : [null],
                  'actualleave' : [null],
                  'absentleave' : [null],
                  'halfdayabsent' : [null],
                });
                this.complexForm.controls['currentyear'].disable();
                this.complexForm.controls['empid'].disable();
                this.complexForm.controls['employee'].disable();
                this.complexForm.controls['prevleavebal'].disable();
                this.complexForm.controls['acuredleave'].disable();
                this.complexForm.controls['paternityentry'].disable();
                this.complexForm.controls['marriageentry'].disable();
                this.complexForm.controls['maternityentry'].disable();
                this.complexForm.controls['leavetaken'].disable();
                this.complexForm.controls['halfdayleave'].disable();
                this.complexForm.controls['actualleave'].disable();
                this.complexForm.controls['absentleave'].disable();
                this.complexForm.controls['halfdayabsent'].disable();

                this.selectedEmployeeDetails = [];
              }

  ionViewDidLoad() {
    this.selectedEmployeeDetails = this.navParams.get('selectedEmployee');
    this.showEmployeeDetails(this.selectedEmployeeDetails);
  }
  showEmployeeDetails (selectedEmp : any) {
    this.HR.CurentYear = selectedEmp.Year;
    this.HR.EmployeeID = selectedEmp.EmpID;
    this.HR.Employee = selectedEmp.Employee.Name;
    this.HR.PrevLeaveBalance = selectedEmp.PLB;
    this.HR.AccuredLeaves = selectedEmp.AccruedLeave;
    this.HR.AdjustmentEntry = selectedEmp.AdjustmentEntry;
    this.HR.PaternityAdjustmentEntry = selectedEmp.PaternityAdjustmentEntry;
    this.HR.MarriageAdjustmentEntry = selectedEmp.MarriageAdjustmentEntry;
    this.HR.MaternityAdjustmentEntry = selectedEmp.MaternityAdjustmentEntry;
    this.HR.LeaveTaken = selectedEmp.LeaveTaken;
    this.HR.HalfDayLeaveTaken = selectedEmp.HalfdayLeaveTaken;
    this.HR.ActualLeaveBalance = selectedEmp.ActualBalance;
    this.HR.AbsentLeaveTaken = selectedEmp.AbsentTaken;
    this.HR.HalfDayAbsent = selectedEmp.HalfdayLeaveTaken;
  }
  onSubmit() {
    let leaveType = '';
    switch (this.HR.AdjustmentEntryType) {
      case 'Marriage Leave': leaveType = 'MarriageAdjustmentEntry';
        break;
      case 'Paternity Leaves': leaveType = 'PaternityAdjustmentEntry';
        break;
      case 'Maternity Leaves': leaveType = 'MaternityAdjustmentEntry';
        break;
    }
    let payload: any = { ID: this.selectedEmployeeDetails.ID };
    payload[leaveType] = this.HR.AdjustmentEntry;
    this.leaveService.updateEmpLeaveBalance(payload).subscribe((res: any) => {
      this.toastService.createToast('Data submitted successfully');
    });
  }

}
