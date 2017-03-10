import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';

/*
  Generated class for the ApproveTimesheetFilter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-approve-timesheet-filter',
  templateUrl: 'approve-timesheet-filter.html'
})
export class ApproveTimesheetFilterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {}

  ionViewDidLoad() {
    
  }
   dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

}
