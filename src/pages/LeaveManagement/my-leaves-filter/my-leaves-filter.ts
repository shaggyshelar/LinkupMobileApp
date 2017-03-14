import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-my-leaves-filter',
  templateUrl: 'my-leaves-filter.html'
})
export class MyLeavesFilterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    //TO DO:Implementation
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  applyFilter() {
    this.dismiss({});
  }
}
