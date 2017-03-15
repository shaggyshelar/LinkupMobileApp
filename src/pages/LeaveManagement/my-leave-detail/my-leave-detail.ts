import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,Events } from 'ionic-angular';
import { LeaveDetail } from '../models/leaveDetail';
import { LeaveService } from '../index';
import { Leave } from '../models/leave';
import { SpinnerService } from '../../../providers/index';
import { Toast } from 'ionic-native';


/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the MyLeaveDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-leave-detail',
  templateUrl: 'my-leave-detail.html',
  providers: [LeaveService, SpinnerService]
})
export class MyLeaveDetailPage {
  public leaveid: string;
  public leaveObs: Observable<Leave>;
  public today: Date;
  public leaveList: Leave[];
  public approverObs: Observable<Leave>;
  public activeProjectsObs: Observable<Leave>;
  public selectedLeave: any;
  public isCancellable: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public leaveService: LeaveService,
    public spinnerService: SpinnerService,
    public alertCtrl: AlertController,
    public leaveStatusChangedEvent: Events) {
    this.leaveid = navParams.get('leaveid');
    this.selectedLeave = navParams.get('leave');
    this.today = new Date();
    this.isCancellable = false;
  }

  ionViewDidLoad() {
    this.getLeaveDetailsData();
  }

  /* Get Leave details */
  getLeaveDetailsData() {
    this.leaveList = [];

    this.spinnerService.createSpinner('Please wait..');
    this.leaveService.getLeaveDetailByRefID(this.leaveid).subscribe((res: any) => {
      this.leaveObs = res;
    });
    this.leaveService.getApproverListByRefID(this.leaveid).subscribe((res: any) => {
      this.approverObs = res;
    });
    this.leaveService.getActiveProjects().subscribe((res: any) => {
      this.activeProjectsObs = res;
      this.spinnerService.stopSpinner();
    });
    this.checkIfApproved();


  }
  checkIfApproved() {
    if (this.selectedLeave.Status === 'Pending') {
      this.isCancellable = true;
    }
  }
  cancelClicked() {
    this.spinnerService.createSpinner('Please wait..');
    let leaveTobeCancelled = {
      Status: 'Cancelled',
      LeaveRequestMasterId: this.leaveid,
      ID: this.selectedLeave.ID
    };
    this.leaveService.deleteLeaveRecord(leaveTobeCancelled).subscribe(res => {
      if (res) {
        this.spinnerService.stopSpinner();
       // this.leaveStatusChangedEvent.publish('Delected Leave','status');
       this.showToast('Leave Canceled');
        this.navCtrl.pop();
      } else {
        this.spinnerService.stopSpinner();
      }
    });
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Leave',
      message: 'Do you want to cancel selected leave?',
      buttons: [
        {
          text: 'NO',
          handler: () => {
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.cancelClicked();
          }
        }
      ]
    });
    confirm.present();
  }

  showToast(message: string) {
        Toast.show(message, '5000', 'center').subscribe(
          toast => {
            console.log(toast);
           }
         );
    }

}
