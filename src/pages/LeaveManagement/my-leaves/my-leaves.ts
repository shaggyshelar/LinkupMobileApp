import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LeaveService } from '../index';
import { Observable } from 'rxjs/Rx';
import { Leave } from '../models/leave';
import { LeaveDetail } from '../models/leaveDetail';
import { AlertController, ItemSliding } from 'ionic-angular';

@Component({
  selector: 'page-my-leaves',
  templateUrl: 'my-leaves.html'
})
export class MyLeavesPage {
  public leaveObs: Observable<Leave>;
  public leaveDetObs: Observable<LeaveDetail>;
  public leaveDetail: LeaveDetail;
  constructor(public navCtrl: NavController, public navParams: NavParams, public leaveService: LeaveService,
    public alertCtrl: AlertController) {

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

  goToLeaveDetail(leaveData: any) {
    // go to the session detail page
    // and pass in the session data
    //this.navCtrl.push(SessionDetailPage, sessionData);
  }

  editLeave(slidingItem: ItemSliding, leaveData: any) {
    let alert = this.alertCtrl.create({
      title: 'Edit Leave',
      buttons: [{
        text: 'OK',
        handler: () => {
          // close the sliding item
          slidingItem.close();
        }
      }]
    });
    alert.present();
  }
}
