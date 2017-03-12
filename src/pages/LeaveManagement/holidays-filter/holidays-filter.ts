import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the HolidaysFilter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-holidays-filter',
  templateUrl: 'holidays-filter.html'
})
export class HolidaysFilterPage {
  public holidayFilterModel: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.holidayFilterModel = { cancelled: true, approved: true, rejected: true, lwp: true, absent: true, halfDay: true }
  }

  ionViewDidLoad() {
    //TO DO:Implementation
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  applyFilter() {
    this.dismiss(this.holidayFilterModel);
  }
}
