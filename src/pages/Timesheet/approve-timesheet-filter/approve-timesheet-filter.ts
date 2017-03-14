import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-approve-timesheet-filter',
  templateUrl: 'approve-timesheet-filter.html'
})
export class ApproveTimesheetFilterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

  ionViewDidLoad() {

  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  applyFilter() {
    this.dismiss({});
  }
}
