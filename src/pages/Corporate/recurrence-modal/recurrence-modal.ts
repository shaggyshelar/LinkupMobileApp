import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the RecurranceModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-recurrence-modal',
  templateUrl: 'recurrence-modal.html'
})
export class RecurrenceModalPage {

  pattern: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams
  , public viewCtrl: ViewController
  ) {
    this.pattern = [
      'Daily',
      'Weekly',
      'Monthly',
      'Yearly'
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecurranceModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss({data : null});
  }

}
