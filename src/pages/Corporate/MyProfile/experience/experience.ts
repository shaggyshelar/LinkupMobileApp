import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  complexForm : FormGroup;
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
    public viewCtrl: ViewController,
    public fb: FormBuilder) { 
      this.complexForm = fb.group({
      'project' : [null, Validators.required],
      'client' : [null, Validators.required],
      'role' : [null, Validators.required],
      'startdate' : [null, Validators.required],
      'enddate' : [null, Validators.required],
      'responsibility' : [null, Validators.required],
      'description':[null],
      'currentproject':[null],
      'environment':[null]
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
    this.Experience.Project = "";
    this.Experience.Client = "";
    this.Experience.Currentproject;
    this.Experience.Description = "";
    this.Experience.Role = "";
  }
  onSave() {
       //TO DO:Implementation
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
