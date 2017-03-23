import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the HolidaysFilter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-holidays-filter',
  templateUrl: 'holidays-filter.html'
})
export class HolidaysFilterPage {
  public holidayFilterModel: any;
  public floating: any;
  public fixed: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.holidayFilterModel = { cancelled: true, approved: true, rejected: true, lwp: true, absent: true, halfDay: true }
  }

  ionViewDidLoad() {
    let filterInput = this.navParams.get('filtervalue');
    this.floating = filterInput[0].floating;
    this.fixed = filterInput[1].fixed;
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  applyFilter() {
    let filterArray = [];
    if(this.floating === true){
      filterArray.push({'value':'Floating',model:true,modelValue:'floating'});
    }
    else{
      filterArray.push({'value':'floating',model:false,modelValue:'floating'});
    }
    if(this.fixed === true){
      filterArray.push({'value':'Fixed',model:true,modelValue:'fixed'});
    }
    else{
      filterArray.push({'value':'Fixed',model:false,modelValue:'fixed'});
    }
    this.dismiss(filterArray);
  }
}
