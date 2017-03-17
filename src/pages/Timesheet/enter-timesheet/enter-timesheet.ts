import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'ng2-cache/ng2-cache';

import * as moment from 'moment'

import { PhasesService, ProjectService, TimesheetService } from '../index';

import { Timesheet } from '../models/timesheet.model';

import { TaskDetailPage } from '../task-detail/task-detail';

@Component({
  selector: 'page-enter-timesheet',
  templateUrl: 'enter-timesheet.html',
  providers: [PhasesService, ProjectService, TimesheetService]
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

  addedProject: any[];
  addedTask: any[];
  aproverUser: any;
  //

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public alertCtrl: AlertController
    , public phasesService: PhasesService
    , public projectService: ProjectService
    , public loadingCtrl: LoadingController
    , public timesheetService: TimesheetService
    , public _cacheService: CacheService
  ) {
    this.weekStartDate = moment().add(0, 'weeks').isoWeekday(1);
    this.weekEndDate = moment().add(1, 'weeks').isoWeekday(0);
    this.projectList = [];
    this.timesheetList = [];
    this.tasksList = [];
    this.addedProject = [];
    this.addedTask = [];
    this.aproverUser = {};
  }

  ionViewDidLoad() {
    // this.navParams.data.readOnly ? this.getTimesheetData(this.navParams.data.payload.ID) : ;
    this.getProjects();
  }

  // getTimesheetData(ID) {
  //   var loader = this.loadingCtrl.create({
  //     content: 'Please wait...'
  //   });

  //   loader.present().then(() => {
  //     this.timesheetService.getMyTimesheet(ID).subscribe((res: any) => {
  //       console.log('res', res);
  //       this.timesheetList = res.Timesheets;
  //       for(var index in res.Timesheets){
  //         res.Timesheets[index].project;
  //       }
  //       loader.dismiss();
  //     }, (err: any) => {
  //       loader.dismiss();
  //     });
  //   });

  // }

  addProjectClicked() {
    this.pushTimeSheet();
  }

  pushTimeSheet() {
    let time = new Timesheet(null, null, '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0);
    this.timesheetList.push(time);
  }

  getProjects() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.projectService.getMyProjectsForTimesheet({ Date: this.weekStartDate }).subscribe(res => {
        this.projectList.push({ label: 'Select', value: null });
        for (var index in res) {
          this.projectList.push({ label: res[index].Title, value: res[index] });
        }
        console.log('getProjects => ', res);
        loader.dismiss();
      }, err => {
        loader.dismiss();
      });
    });
  }

  closeClicked(index) {
    this.timesheetList.splice(index, 1);
    this.tasksList.splice(index, 1);
    if (this.timesheetList.length === 0) {
      this.pushTimeSheet();
    }
  }

  projectChanged(event, index) {
    this.aproverUser = event.value.AccountManager;
    this.addedProject[index] = event;
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.tasksList[index] = [];
      this.phasesService.getPhasesByProject(event.value).subscribe((res: any) => {
        this.tasksList[index].push({ label: 'Select', value: null });
        for (var i in res) {
          this.tasksList[index].push({ label: res[i].PhaseName, value: res[i].PhaseName });
        }
        console.log('projectChanged => ', res);
        loader.dismiss();
      }, err => {
        loader.dismiss();
      });
    });
    this.timesheetList[index].Project.ID = event.value.ID;
    this.timesheetList[index].Project.Title = event.value.Title;
    this.timesheetList[index].ApproverUser = event.value.AccountManager;
  }

  phaseChanged(event, index) {
    this.addedTask[index] = event;
    this.projectCount[index] = { phase: event };
    this.timesheetList[index].Task = event.label;
    this.currentTaskIndex = index;
  }

  cardClick(index) {
    console.log(this.timesheetList);
    var name = 'enterTimesheet-' + moment().add(0, 'weeks').isoWeekday(1).format('D/M') + '-' + moment().add(1, 'weeks').isoWeekday(0).format('D/M');
    // var cacheData = {
    //   timesheet: new Timesheet(this.aproverUser, this.changedProject, this.changedTask, '', '', '', '', '', '', '',
    //     '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0)
    // };

    if (this._cacheService.exists(name)) {
      this._cacheService.remove(name);
      this._cacheService.set(name, this.timesheetList, { maxAge: 60 * 60 });
    } else {
      this._cacheService.set(name, this.timesheetList, { maxAge: 60 * 60 });
    }
    // this.cardSelectionIndex = index;
    this.navCtrl.push(TaskDetailPage, { caller: 'enter-timesheet', isEnterTimesheet: true, timesheetData: { timesheetIndex: index, cacheKey: name } });
  }

  submitTimesheetClicked() {

  }

  saveTimesheetClicked() {

  }
}
