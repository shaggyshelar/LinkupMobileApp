import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SkillInfo } from '../../../../models/skill-model';

/*
  Generated class for the SkillSet page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-skill-set',
  templateUrl: 'skill-set.html'
})
export class SkillSetPage {
  skill: SkillInfo = new SkillInfo();
  showForm: boolean = false;
  isSkillType: boolean = false;
  isSkill: boolean = false;
  MakeEnable: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SkillSetPage');
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  onAddForm() {
    this.showForm = true;
    this.skill.SkillType = "";
    this.skill.Skills = "";
  }
  validate() {
    let submitFlag = true;
    if (this.skill.SkillType === "" || this.skill.SkillType === undefined) {
      this.isSkillType = true;
      submitFlag = false;
    }
    else {
      this.isSkillType = false;
    }
    if (this.skill.Skills === "" || this.skill.Skills === undefined) {
      this.isSkill = true;
      submitFlag = false;
    }
    else {
      this.isSkill = false;
    }
    return submitFlag;
  }
  onSave() {
    if (this.validate()) {
      console.log('data saved sucessfully')
    }
  }
  onCloseForm() {
    this.showForm = false;
  }
  editList() {
    this.showForm = true;
    this.skill.SkillType = "Language/Technology";
    this.skill.Skills = "AngujarJS, AngularJS 2, HTML5, CSS, Javascript, JQuery, Ionic framework, Asp.net, MVC";
  }
}
