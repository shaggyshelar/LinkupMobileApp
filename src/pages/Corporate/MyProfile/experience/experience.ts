import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ExperienceInfo } from './experience-model';

/*
  Generated class for the Experience page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-experience',
  templateUrl: 'experience.html'
})
export class ExperiencePage {
  Experience: ExperienceInfo = new ExperienceInfo();
  showForm: boolean = false;
  isProject: boolean = false;
  isClient: boolean = false;
  isRole: boolean = false;
  isEnddate: boolean = false;
  isStartdate: boolean = false;
  isResponsibilities: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExperiencePage');
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  onAddForm() {
    this.showForm = true;
    this.Experience.Project = "";
    this.Experience.Client = "";
    this.Experience.Currentproject;
    this.Experience.Description = "";
    this.Experience.Role = "";
  }
  validate() {
    let submitFlag = true;
    if (this.Experience.Project === "" || this.Experience.Project === undefined) {
      this.isProject = true;
      submitFlag = false;
    }
    else {
      this.isProject = false;
    }
    if (this.Experience.Client === "" || this.Experience.Client === undefined) {
      this.isClient = true;
      submitFlag = false;
    }
    else {
      this.isClient = false;
    }
    if (this.Experience.Role === "" || this.Experience.Role === undefined) {
      this.isRole = true;
      submitFlag = false;
    }
    else {
      this.isRole = false;
    }
    if (this.Experience.Startdate === "" || this.Experience.Startdate === undefined) {
      this.isEnddate = true;
      submitFlag = false;
    }
    else {
      this.isEnddate = false;
    }
    if (this.Experience.Enddate === "" || this.Experience.Enddate === undefined) {
      this.isStartdate = true;
      submitFlag = false;
    }
    else {
      this.isStartdate = false;
    }
    if (this.Experience.Responsibilities === "" || this.Experience.Responsibilities === undefined) {
      this.isResponsibilities = true;
      submitFlag = false;
    }
    else {
      this.isResponsibilities = false;
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
    this.Experience.Project = "Linkup Portal";
    this.Experience.Client = "Eternus solutions";
    this.Experience.Currentproject = true;
    this.Experience.Description = " Linkup Portal Linkup PortalLinkup Portal Linkup Portal Linkup Portal";
    this.Experience.Role = "software developer";
  }
}
