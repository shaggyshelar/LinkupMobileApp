import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { CertificationInfo } from './certification-model';
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
  Certification: CertificationInfo = new CertificationInfo();
  isCertification: boolean = false;
  isCertificationDate: boolean = false;
  showForm: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CertificationPage');
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  validate() {
    let submitFlag = true;
    if (this.Certification.certification === "" || this.Certification.certification === undefined) {
      this.isCertification = true;
      submitFlag = false;
    }
    else {
      this.isCertification = false;
    }
    if (this.Certification.certificationDate === "" || this.Certification.certificationDate === undefined) {
      this.isCertificationDate = true;
      submitFlag = false;
    }
    else {
      this.isCertificationDate = false;
    }
    return submitFlag;
  }
  onSave() {
    if (this.validate()) {
      console.log('data saved sucessfully')
    }
  }
  onAddForm() {
    this.showForm = true;
    this.Certification.cerificationcode = "";
    this.Certification.certification = "";
    this.Certification.certificationDate = "";
    this.Certification.fromESPL = true;
  }
  onCloseForm() {
    this.showForm = false;
  }
  editList() {
    this.showForm = true;
    this.Certification.cerificationcode = "411-0342";
    this.Certification.certification = "Java";
    this.Certification.certificationDate = "25/06/1992";
    this.Certification.fromESPL = true;
  }
}
