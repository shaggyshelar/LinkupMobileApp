import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the LeaveApprovalFilter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-leave-approval-filter',
  templateUrl: 'leave-approval-filter.html'
})
export class LeaveApprovalFilterPage {
  pending : any;
  approved: any;
  rejected: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    let filterInput = this.navParams.get('filtervalue');
    this.pending = filterInput[0].pending;
    this.approved = filterInput[1].approved;
    this.rejected = filterInput[2].rejected;
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  applyFilter() {
    let filterArray = [];
    if(this.pending === true){
      filterArray.push({'value':'Pending',model:true,modelValue:'pending'});
    }
    else{
      filterArray.push({'value':'Pending',model:false,modelValue:'pending'});
    }
    if(this.approved === true){
      filterArray.push({'value':'Approved',model:true,modelValue:'approved'});
    }
    else{
      filterArray.push({'value':'Approved',model:false,modelValue:'approved'});
    }
    if(this.rejected === true){
      filterArray.push({'value':'Rejected',model:true,modelValue:'rejected'});
    }
    else{
      filterArray.push({'value':'Rejected',model:false,modelValue:'rejected'});
    }
    this.dismiss(filterArray);
  }
}
