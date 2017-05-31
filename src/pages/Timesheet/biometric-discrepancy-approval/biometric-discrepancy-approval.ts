import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';

import * as moment from 'moment';

import { AuthService } from '../../../providers/index';
import { EmployeeDiscrepancyService } from '../../../providers/index'
/*
  Generated class for the BiometricDiscrepancyApproval page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-biometric-discrepancy-approval',
  templateUrl: 'biometric-discrepancy-approval.html'
})
export class BiometricDiscrepancyApprovalPage {

  discrepancies: any[] = [];
  isApprove: boolean = true;
  isLongPressed: boolean = false;
  isPullToRefresh: boolean = false;
  isAuthorized: boolean = true;
  isDataReceived: boolean = true;
  selectedCount: number = 0;
  currentUser: any = {};

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public toastCtrl: ToastController
    , public loadingCtrl: LoadingController
    , public alert: AlertController
    , public discrepancyService: EmployeeDiscrepancyService
    , public auth: AuthService
  ) {
    this.currentUser = this.auth.getCurrentUser();
    /** Check authorization for module display with "isAuthorized" */
  }

  ionViewDidLoad() {
    this.isPullToRefresh = false;
    this.getDiscrepancyData();
  }

  getDiscrepancyData() {
    /** TODO : API call via service */
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.discrepancies = [];
    loader.present().then(() => {
      this.discrepancyService.getDiscrepancyForApproval(this.isPullToRefresh).subscribe(res => {
        res.forEach((element, index) => {
          let mod: any = moment(element.LeaveDate).day() % 7;
          let bgCol = '';
          /** Tells day of week case 1 = Monday*/
          switch (mod) {
            case 0: bgCol = '#659BE0'; break;
            case 1: bgCol = '#337AB7'; break;
            case 2: bgCol = '#3B3F51'; break;
            case 3: bgCol = '#36C6D3'; break;
            case 4: bgCol = '#ED6B75'; break;
            case 5: bgCol = '#F1C40F'; break;
            case 6: bgCol = '#8E44AD'; break;
          }
          this.discrepancies.push({
            Employee: element.Employee,
            Approvers: element.Approvers,
            LeaveDate: element.LeaveDate,
            LeaveReason: element.LeaveReason,
            ReasonDetails: element.ReasonDetails,
            ApproverComment: element.ApproverComment,
            EmployeeID: element.EmployeeID,
            ApproverStatus: element.ApproverStatus,
            ApprovedBy: element.ApprovedBy,
            ID: element.ID,
            color: 'white',
            isSelected: false,
            badgeColor: bgCol
          });
        });
        loader.dismiss();
        this.isDataReceived = true;
      }, err => {
        loader.dismiss();
        this.isDataReceived = true;
      });
    });
  }

  clicked(item, index) {
    if (this.isLongPressed) {
      !this.discrepancies[index].isSelected ? this.setSelectedDiscrepancyAs(true, index) : this.setSelectedDiscrepancyAs(false, index);
    } else {
      /** TODO : Show details */
    }
  }
  longPressed(item, index) {
    this.isLongPressed = true;
    !this.discrepancies[index].isSelected ? this.setSelectedDiscrepancyAs(true, index) : this.setSelectedDiscrepancyAs(false, index);
  }
  selectAll() {
    this.discrepancies.forEach((element, index) => {
      this.setSelectedDiscrepancyAs(true, index);
    });
  }
  setSelectedDiscrepancyAs(flag, index) {
    if (flag) {
      this.discrepancies[index].color = "#8ea3c5";
      this.discrepancies[index].isSelected = true;
    } else {
      this.discrepancies[index].color = "white";
      this.discrepancies[index].isSelected = false;
    }

    this.selectedCount = 0;
    this.discrepancies.forEach(element => {
      if (element.isSelected)
        this.selectedCount++;
    });
    this.selectedCount === 0 ? this.isLongPressed = false : this.isLongPressed = true;
  }

  doRefresh(refresher) {
    this.discrepancies = [];
    this.isPullToRefresh = true;
    this.discrepancyService.getDiscrepancyForApproval(this.isPullToRefresh).subscribe((res: any) => {
      refresher.complete();
      res.forEach(element => {
        let mod: any = moment(element.LeaveDate).date() % 7;
        let bgCol = '';
        /** Tells day of week case 1 = Monday*/
        switch (mod) {
          case 0: bgCol = '#659BE0'; break;
          case 1: bgCol = '#337AB7'; break;
          case 2: bgCol = '#3B3F51'; break;
          case 3: bgCol = '#36C6D3'; break;
          case 4: bgCol = '#ED6B75'; break;
          case 5: bgCol = '#F1C40F'; break;
          case 6: bgCol = '#8E44AD'; break;
        }
        this.discrepancies.push({
          Employee: element.Employee,
          Approvers: element.Approvers,
          LeaveDate: element.LeaveDate,
          LeaveReason: element.LeaveReason,
          ReasonDetails: element.ReasonDetails,
          ApproverComment: element.ApproverComment,
          EmployeeID: element.EmployeeID,
          ApproverStatus: element.ApproverStatus,
          ApprovedBy: element.ApprovedBy,
          ID: element.ID,
          color: 'white',
          isSelected: false,
          badgeColor: bgCol
        });
      });
      this.isDataReceived = true;
    }, err => {
      this.isDataReceived = true;
      refresher.complete();
    });
  }

  approve() {
    this.isApprove = true;
    this.updateRecords();
  }
  reject() {
    this.isApprove = false;
    this.updateRecords();
  }

  sendUpdatedRecord(comment, status) {
    let selected = [];
    for (var index = 0; index < this.discrepancies.length; index++) {
      if (this.discrepancies[index].isSelected) {
        selected.push({
          Employee: this.discrepancies[index].Employee,
          Approvers: this.discrepancies[index].Approvers,
          LeaveDate: this.discrepancies[index].LeaveDate,
          LeaveReason: this.discrepancies[index].LeaveReason,
          ReasonDetails: this.discrepancies[index].ReasonDetails,
          ApproverComment: comment,
          EmployeeID: this.discrepancies[index].EmployeeID,
          ApproverStatus: status,
          ApprovedBy: this.currentUser.Employee,
          ID: this.discrepancies[index].ID,
        });
      }
    }
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present().then(() => {
      selected.forEach(item => {
        this.discrepancyService.updateEmployeeDiscrepancy(item).subscribe(res => {
          if (res.StatusCode == 1) {
            loader.dismiss();
            this.presentToast('Records updated.');
          } else {
            loader.dismiss();
            this.presentToast(res.Message);
          }
          // loader.dismiss();
        }, err => {
          loader.dismiss();
        });
      });
    });
    this.getDiscrepancyData();
  }

  updateRecords() {
    /** TODO : Update records with API call via service */
    let promptConfig = {
      title: this.isApprove ? 'Approve Discrepancy' : 'Reject Discrepancy',
      message: 'Comment is a mandatory field*',
      inputs: [
        {
          name: 'comment',
          placeholder: 'Comment'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            this.isLongPressed = false;
            this.discrepancies.forEach((item, index) => {
              this.setSelectedDiscrepancyAs(false, index);
            });
          }
        },
        {
          text: this.isApprove ? 'Approve' : 'Reject',
          handler: data => {
            if (data.comment.trim() != '') {
              this.sendUpdatedRecord(data.comment, this.isApprove ? 'Approved' : 'Rejected');
              this.isLongPressed = false;
              /** TODO : START : Remove this */
              // this.getDiscrepancyData();
              /** TODO : END : Remove this */
            } else {
              this.presentToast('Comment is not valid, action will not be completed.');
            }
          }
        }
      ]
    };
    let prompt = this.alert.create(promptConfig);
    prompt.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}
