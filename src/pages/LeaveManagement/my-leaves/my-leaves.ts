import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LeaveService } from '../index';
import { Observable } from 'rxjs/Rx';
import { Leave } from '../models/leave';
import { LeaveDetail } from '../models/leaveDetail';


@Component({
  selector: 'page-my-leaves',
  templateUrl: 'my-leaves.html'
})
export class MyLeavesPage {
  public leaveObs: Observable<Leave>;
  public leaveDetObs: Observable<LeaveDetail>;
  public leaveDetail: LeaveDetail;
  constructor(public navCtrl: NavController, public navParams: NavParams, public leaveService: LeaveService) {

  }

  ionViewDidLoad() {
    this.leaveObs = this.leaveService.getMyLeaves();
    // this.leaveService.getMyLeaves().subscribe(
    //   res => {
    //     console.log("Data from server", res); 
    //     this.leaveObs = res;
    //   });
    console.log('ionViewDidLoad MyLeavesPage');
  }

}
