import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { PhasesService, ProjectService } from '../index';

import { TimesheetDetailsPage } from '../timesheet-details/timesheet-details';

@Component({
  selector: 'page-enter-timesheet',
  templateUrl: 'enter-timesheet.html'
})
export class EnterTimesheetPage {

  projectCount: any[] = [];
  projects: Observable<any>[];
  phases: Observable<any>[];

  project: any = '';
  phase: any = '';
  currentTaskIndex = 0;
  cardSelectionIndex: Number;

  projectData: any = {};


  constructor(public navCtrl: NavController, public navParams: NavParams
    , public alertCtrl: AlertController
    , public phasesService: PhasesService
    , public projectService: ProjectService
    , public loadingCtrl: LoadingController
  ) { this.project = {} }

  ionViewDidLoad() {

  }

  getProjects() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.projectService.getProjectList().subscribe((res) => {
        if (res)
          this.projects = res;
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });

  }

  addProjectClicked() {
    this.getProjects();
    this.projectCount.push({ project: null, phase: null });
    this.currentTaskIndex = this.projectCount.length - 1;
    // this.projectCount.push(this.projectCount.length);
  }

  closeClicked(i) {
    let alert = this.alertCtrl.create({
      title: 'Confirm deletion',
      message: 'Do you want to delete this?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.projectCount.splice(i, 1);
          }
        }
      ]
    });
    alert.present();
  }

  projectChanged(event) {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.phasesService.getPhasesByProject(this.project).subscribe((res) => {
        if (res)
          this.phases = res;
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
      });
    });
  }

  phaseChanged(event) {
    this.projectCount.push({
      project: this.project,
      phase: this.phase
    });
  }

  cardClick(index) {
    this.cardSelectionIndex = index;
    this.navCtrl.push(TimesheetDetailsPage, { caller: 'enter-timesheet', timesheetID: index });
  }

  submitTimesheetClicked() {

  }

  saveTimesheetClicked() {

  }
}
