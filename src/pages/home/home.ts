import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/index';
import { PersonalInfoPage } from '../Corporate/MyProfile/personal-info/personal-info';
import { CertificationPage } from '../Corporate/MyProfile/certification/certification';
import { SkillSetPage } from '../Corporate/MyProfile/skill-set/skill-set';
import { ExperiencePage } from '../Corporate/MyProfile/experience/experience';
/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public authService: AuthService,
              public modalCtrl: ModalController) { 
    console.log('Is Authenticated =',this.authService.isAuthenticated());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  gotoMyprofile() {
    let modal = this.modalCtrl.create(PersonalInfoPage);
    modal.present();
  }
  gotoCertification() {
    let modal = this.modalCtrl.create(CertificationPage);
    modal.present();
  }
  gotoSkill() {
    let modal = this.modalCtrl.create(SkillSetPage);
    modal.present();
  }
   gotoExperience() {
    let modal = this.modalCtrl.create(ExperiencePage);
    modal.present();
  }
}
