import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { PhasesService, ProjectService, EmployeeTimesheetService } from '../index';

@Component({
  selector: 'page-enter-timesheet',
  templateUrl: 'enter-timesheet.html'
})
export class EnterTimesheetPage {

  projectCount: any[] = [0];
  projects: Observable<any>[];
  phases: Observable<any>[];

  project: any;
  phase: any;
  cardSelectionIndex : Number;

  projectData: any = {};


  constructor(public navCtrl: NavController, public navParams: NavParams
    , public alertCtrl: AlertController
    , public phasesService: PhasesService
    , public projectService: ProjectService
    , public loadingCtrl: LoadingController
  ) { this.project = {} }

  ionViewDidLoad() {
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
    /**
     * TODO: API Service call to get all projects
     */
    this.projectCount.push(this.projectCount.length);
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
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            //console.log('Buy clicked');
            this.projectCount.splice(i, 1);
          }
        }
      ]
    });
    alert.present();
  }

  projectChanged(event) {
    /** 
     * TODO: 
     * API Service call to get all tasks under selected project
     */
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

  phaseChanged($event) {

  }

  cardClick(index) {
    this.cardSelectionIndex = index;
    alert('Card no. '+index);
  }

  submitTimesheetClicked() {
    
  }

  saveTimesheetClicked() {

  }
}
