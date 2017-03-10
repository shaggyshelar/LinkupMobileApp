import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SkillInfo } from './skill-set-model';

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
  complexForm : FormGroup;
  skill: SkillInfo = new SkillInfo();
  showForm: boolean = false;
  isSkillType: boolean = false;
  isSkill: boolean = false;
  MakeEnable: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public fb: FormBuilder) { 
      this.complexForm = fb.group({
      'skilltype' : [null, Validators.required],
      'skills' : [null, Validators.required]
    })
    }

  ionViewDidLoad() {
     //TO DO:Implementation
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  onAddForm() {
    this.showForm = true;
    this.skill.SkillType = "";
    this.skill.Skills = "";
  }
  onSave() {
       //TO DO:Implementation
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
