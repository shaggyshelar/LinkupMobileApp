import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  complexForm : FormGroup;
  Certification: CertificationInfo = new CertificationInfo();
  isCertification: boolean = false;
  isCertificationDate: boolean = false;
  showForm: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public fb: FormBuilder) { 
      this.complexForm = fb.group({
      'certification' : [null, Validators.required],
      'certificationcode' : [null, Validators.required],
      'certificationdate' : [null, Validators.required],
      'uploadcertificate' : [null, Validators.required]
    })
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CertificationPage');
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  onSave() {
      console.log('data saved sucessfully');
  }
  onAddForm() {
    this.showForm = true;
    this.Certification.certificationcode = "";
    this.Certification.certification = "";
    this.Certification.certificationDate = "";
    this.Certification.fromESPL = true;
  }
  onCloseForm() {
    this.showForm = false;
  }
  editList() {
    this.showForm = true;
    this.Certification.certificationcode = "411-0342";
    this.Certification.certification = "Java";
    this.Certification.certificationDate = "25/06/1992";
    this.Certification.fromESPL = true;
  }
}
