import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import * as moment from 'moment'

import { PhasesService, ProjectService } from '../index';

import { Timesheet } from '../models/timesheet.model';

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
  currentTaskIndex: number = 0;
  cardSelectionIndex: number;

  projectData: any = {};

  /** New Approach */
  timesheetList: any[];
  weekStartDate: any = {};
  weekEndDate: any = {};
  projectList: any[];
  tasksList: any[];
  //

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public alertCtrl: AlertController
    , public phasesService: PhasesService
    , public projectService: ProjectService
    , public loadingCtrl: LoadingController
  ) {
    this.weekStartDate = moment().add(0, 'weeks').isoWeekday(1);
    this.weekEndDate = moment().add(1, 'weeks').isoWeekday(0);
    this.projectList = [];
    this.timesheetList = [];
    this.tasksList = [];
  }

  ionViewDidLoad() {
  }

  addProjectClicked() {
    this.pushTimeSheet();
    this.getProjects();
  }

  pushTimeSheet() {
    let time = new Timesheet(null, null, '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0);
    this.timesheetList.push(time);
  }

  getProjects() {
    this.projectService.getMyProjectsForTimesheet({ Date: this.weekStartDate }).subscribe(res => {
      this.projectList.push({ label: 'Select', value: null });
      for (var index in res) {
        this.projectList.push({ label: res[index].Title, value: res[index] });
      }
    });
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
            this.currentTaskIndex--;
          }
        }
      ]
    });
    alert.present();
  }

  projectChanged(event, index) {
    this.tasksList[index] = [];
    this.phasesService.getPhasesByProject(event.value).subscribe((res: any) => {
      this.tasksList[index].push({ label: 'Select', value: null });
      for (var i in res) {
        this.tasksList[index].push({ label: res[i].PhaseName, value: res[i].PhaseName });
      }
    });
  }

  phaseChanged(event, i) {
    this.projectCount[i] = { phase: event };
    this.currentTaskIndex = i;
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
