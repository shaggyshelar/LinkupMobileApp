import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the LeaveDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-leave-details',
  templateUrl: 'leave-details.html'
})
export class LeaveDetailsPage {

  public leaveDetails: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.leaveDetails = this.navParams.get('leaveDetails');
  }

  ionViewDidLoad() {

  }


  close() {
    this.viewCtrl.dismiss({ message: 'Closed achievement' });
  }

}
