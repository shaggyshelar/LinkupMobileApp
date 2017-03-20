import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HROperation } from '../models/HROperations';
/*
  Generated class for the EmployeeLeaveBalance page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-employee-leave-balance',
  templateUrl: 'employee-leave-balance.html'
})
export class EmployeeLeaveBalancePage {
  complexForm : FormGroup;
  HR = new HROperation();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fb: FormBuilder) {
                this.complexForm = fb.group({
                  'adjustmententry' : [null, Validators.required],
                  'currentyear' : [null],
                  'empid' : [null],
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
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmployeeLeaveBalancePage');
  }

}
