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

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {}

  ionViewDidLoad() {
     //TO DO:Implementation
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

}
