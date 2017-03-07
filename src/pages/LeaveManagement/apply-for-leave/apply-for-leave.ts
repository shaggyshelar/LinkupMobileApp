import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the ApplyForLeave page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-apply-for-leave',
  templateUrl: 'apply-for-leave.html'
})
export class ApplyForLeavePage {

  StartDate : any = {};
  EndDate : any = {};
  LeaveType : any = {};

  leaveTypes : any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.leaveTypes = [
      {
        value : 0,
        text : 'Leave'
      },
      {
        value : 1,
        text : 'Half Day Leave'
      },
      {
        value : 2,
        text : 'Absent'
      },
      {
        value : 3,
        text : 'Half Day Absent'
      }
    ];
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyForLeavePage');
    console.log('date clicked => ',this.navParams.data);
  }

}
