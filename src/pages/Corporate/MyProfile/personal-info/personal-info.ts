import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { PersonalInfo } from './personal-info-model';

@Component({
  selector: 'page-personal-info',
  templateUrl: 'personal-info.html',
})
export class PersonalInfoPage {
  MakeEnable: boolean = true;
  Personal: PersonalInfo = new PersonalInfo();
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController) {
    this.MakeEnable = true;
    this.Personal.EmpID = 10355;
    this.Personal.BloodGroup = "AB+";
    this.Personal.EmpName = "Chetan Badgujar";
    this.Personal.CurrentAddress = "Audumber B SNo 15/7 +BA warje jakat naka, karve nagar, Pune - 411052";
    this.Personal.ContactNumber = 9090909090;
    this.Personal.Email = "chetan.badgujar@eternussolutions.com";
    this.Personal.DOB = "25/06/1992";
    this.Personal.PreviousPFNo = "PU/PUN/0305291/000/0000325";
  }
  ngOnInit() {
    let loader = this.loadingCtrl.create({
      content: "Loading...",
      duration: 3000
    });
    loader.present();
  }
  ionViewDidLoad() {
     //TO DO:Implementation
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  onEdit() {
    this.MakeEnable = false;
  }
  onSave() {
    this.MakeEnable = true;
  }
}
