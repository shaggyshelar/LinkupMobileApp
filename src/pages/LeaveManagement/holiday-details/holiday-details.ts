import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the HolidayDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-holiday-details',
  templateUrl: 'holiday-details.html'
})
export class HolidayDetailsPage {
  public selectedHoliday: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedHoliday = navParams.get('holiday');
  }

  ionViewDidLoad() {
  }

}
