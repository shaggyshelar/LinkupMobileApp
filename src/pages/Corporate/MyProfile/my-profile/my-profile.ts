import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

/** Framework Level Imports */
import { AchievementPage } from '../achievement/achievement';
import { EducationPage } from '../education/education';

// Page Imports
import { PersonalInfoPage } from '../personal-info/personal-info';
import { CertificationPage } from '../certification/certification';
import { SkillSetPage } from '../skill-set/skill-set';
import { ExperiencePage } from '../experience/experience';
import { EmploymentHistoryPage } from '../employment-history/employment-history';
import { ProfileDetailsPage } from '../profile-details/profile-details';
/*
  Generated class for the MyProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html'
})
export class MyProfilePage {
  loadProgress = 50;

  constructor(public navCtrl: NavController
  , public navParams: NavParams
  , public modalCtrl: ModalController
  , public viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
     //TO DO:Implementation;
  }
  
  achievementsTapped() {
    let modal = this.modalCtrl.create(AchievementPage,{message:'Welcome'});
    modal.onDidDismiss((data)=> {
      
    });
    modal.present();
    // this.navCtrl.push(AchievementPage,{message:'Welcome'});

  }

  educationTapped() {
    this.navCtrl.push(EducationPage);
  }
  PersonalInfoTapped() {
    let modal = this.modalCtrl.create(PersonalInfoPage);
    modal.present();
  }
  certificationTapped() {
    let modal = this.modalCtrl.create(CertificationPage);
    modal.present();
  }
  experienceTapped() {
    let modal = this.modalCtrl.create(ExperiencePage);
    modal.present();
  }
  skillsetTapped() {
    let modal = this.modalCtrl.create(SkillSetPage);
    modal.present();
  }
  employementHistoryTapped() {
    let modal = this.modalCtrl.create(EmploymentHistoryPage);
    modal.present();
  }
  detailsTapped() {
    let modal = this.modalCtrl.create(ProfileDetailsPage);
    modal.present();
  }
}
