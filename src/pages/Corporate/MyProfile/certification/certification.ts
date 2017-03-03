import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
import { CertificationInfo } from '../../../../models/certification-model';
/*
  Generated class for the Certification page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-certification',
  templateUrl: 'certification.html'
})
export class CertificationPage {
  Certification : CertificationInfo = new CertificationInfo();
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CertificationPage');
  }
  dismiss(data) {
      this.viewCtrl.dismiss(data);
  }
  onSave(){
    if(this.Certification.certification === ""){
      console.log('invalid name');
    }
    if(this.Certification.certificationDate === ""){
       console.log('invalid date');
    }
  }
}
