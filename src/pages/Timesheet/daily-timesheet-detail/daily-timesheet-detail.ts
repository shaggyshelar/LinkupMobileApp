import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the DailyTimesheetDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-daily-timesheet-detail',
  templateUrl: 'daily-timesheet-detail.html'
})
export class DailyTimesheetDetailPage {

  dailyData : any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailyTimesheetDetailPage');
    console.log('data => ', this.navParams.data);
    this.dailyData = this.navParams.data;
  }

}
