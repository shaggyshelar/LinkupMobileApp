import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

/** Framework Level Imports */
import { AchievementPage } from '../achievement/achievement';
import { EducationPage } from '../education/education';
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
    console.log('ionViewDidLoad MyProfilePage');
  }
  
  achievementsTapped() {
    let modal = this.modalCtrl.create(AchievementPage,{message:'Welcome'});
    modal.onDidDismiss((data)=> {
      console.log(data);
    });
    modal.present();
    // this.navCtrl.push(AchievementPage,{message:'Welcome'});

  }

  educationTapped() {
    this.navCtrl.push(EducationPage);
  }

}
