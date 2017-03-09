import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the LeaveApprovalFilter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-leave-approval-filter',
  templateUrl: 'leave-approval-filter.html'
})
export class LeaveApprovalFilterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveApprovalFilterPage');
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}
