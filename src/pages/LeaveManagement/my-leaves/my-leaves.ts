import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { LeaveService } from '../index';


@Component({
  selector: 'page-my-leaves',
  templateUrl: 'my-leaves.html'
})
export class MyLeavesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyLeavesPage');
  }

}
