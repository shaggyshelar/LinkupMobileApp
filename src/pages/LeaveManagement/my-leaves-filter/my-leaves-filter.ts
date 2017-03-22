import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-my-leaves-filter',
  templateUrl: 'my-leaves-filter.html'
})
export class MyLeavesFilterPage {
  rejectedStatus: any;
  cancelledStatus: any;
  approvedStatus: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    //TO DO:Implementation

    let filterInput = this.navParams.get('filtervalue');
    this.rejectedStatus = filterInput[0].rejectedStatus;
    this.cancelledStatus = filterInput[1].cancelledStatus;
    this.approvedStatus = filterInput[2].approvedStatus;
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  applyFilter() {
    let filterArray = [];
    if(this.rejectedStatus === true){
      filterArray.push({'value':'Rejected',model:true,modelValue:'rejectedStatus'});
    }
    else{
      filterArray.push({'value':'Rejected',model:false,modelValue:'rejectedStatus'});
    }
    if(this.cancelledStatus === true){
      filterArray.push({'value':'Cancelled',model:true,modelValue:'cancelledStatus'});
    }
    else{
      filterArray.push({'value':'Cancelled',model:false,modelValue:'cancelledStatus'});
    }
    if(this.approvedStatus === true){
      filterArray.push({'value':'Approved',model:true,modelValue:'approvedStatus'});
    }
    else{
      filterArray.push({'value':'Approved',model:false,modelValue:'approvedStatus'});
    }
    this.dismiss(filterArray);
  }
}
