import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HROperation } from '../models/HROperations';
/*
  Generated class for the ResignedEmployeeLeaves page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-resigned-employee-leaves',
  templateUrl: 'resigned-employee-leaves.html'
})
export class ResignedEmployeeLeavesPage {
  HR = new HROperation();
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResignedEmployeeLeavesPage');
  }

}
