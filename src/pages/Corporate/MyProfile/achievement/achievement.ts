import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-achievement',
  templateUrl: 'achievement.html'
})
export class AchievementPage {

  achievements: any[] = ['winner', 'hacker', 'dark master'];
  showAddEditView: Boolean = false;
  isEditable: Boolean = false;
  achievement: String = '';

  achievementForm: FormGroup;

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public viewCtrl: ViewController
    , public formBuilder: FormBuilder
  ) {
    this.achievementForm = formBuilder.group({
      achievement: ['', Validators.compose([Validators.minLength(3), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AchievementPage');
  }

  addAchievement() {
    this.showAddEditView = !this.showAddEditView;
  }

  close() {
    this.viewCtrl.dismiss({ message: 'Closed achievement' });
  }

  cancelTapped() {
    this.achievement = '';
    this.addAchievement();
    this.editAchievement();
  }

  submitTapped(item) {
    /** Pushing to array temporarily */
    if (this.achievementForm.valid) {
      console.log('submit value => ',item.achievement);
      this.achievements.push(item.achievement);
      this.addAchievement();
      this.editAchievement();
    }

    /**
     * TODO: Make API call for add/edit
     */
  }

  listItemTapped(item) {
    if (this.isEditable) {
      this.achievement = item;
      // this.addAchievement();
      this.showAddEditView = true;
    }
  }

  editAchievement() {
    this.isEditable = true;
  }

}
