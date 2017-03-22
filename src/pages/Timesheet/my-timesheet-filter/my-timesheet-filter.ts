import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the MyTimesheetFilter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-timesheet-filter',
  templateUrl: 'my-timesheet-filter.html'
})
export class MyTimesheetFilterPage {
  submitted: any;
  approved: any;
  partiallyApproved: any;
  notSubmitted: any;
  pending: any;
  rejected: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    let filterInput = this.navParams.get('filtervalue');
    this.submitted = filterInput[0].submitted;
    this.approved = filterInput[1].approved;
    this.partiallyApproved = filterInput[2].partiallyApproved;
    this.notSubmitted = filterInput[3].notSubmitted;
    this.pending = filterInput[4].pending;
    this.rejected = filterInput[5].rejected;
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  applyFilter() {
    let filterArray = [];
    if(this.submitted === true){
      filterArray.push({'value':'Submitted',model:true,modelValue:'submitted'});
    }
    else{
      filterArray.push({'value':'Submitted',model:false,modelValue:'submitted'});
    }
    if(this.approved === true){
      filterArray.push({'value':'Approved',model:true,modelValue:'approved'});
    }
    else{
      filterArray.push({'value':'Approved',model:false,modelValue:'approved'});
    }
    if(this.partiallyApproved === true){
      filterArray.push({'value':'Partially Approved',model:true,modelValue:'partiallyApproved'});
    }
    else{
      filterArray.push({'value':'Partially Approved',model:false,modelValue:'partiallyApproved'});
    }
    if(this.notSubmitted === true){
      filterArray.push({'value':'Not Submitted',model:true,modelValue:'notSubmitted'});
    }
    else{
      filterArray.push({'value':'Submitted',model:false,modelValue:'submitted'});
    }
    if(this.pending === true){
      filterArray.push({'value':'Pending',model:true,modelValue:'pending'});
    }
    else{
      filterArray.push({'value':'Pending',model:false,modelValue:'pending'});
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
