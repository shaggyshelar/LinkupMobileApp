import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'ng2-cache/ng2-cache';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  currentTaskIndex: number = 0;

  timesheetList: any[];

  showWeekStart: Date;
  showWeekEnd: Date;

  weekStartDate: any = {};
  weekEndDate: any = {};
  projectList: any[];
  tasksList: any[];

  addedProject: any[];
  addedTask: any[];
  aproverUser: any;
  cacheKey: string;
  cacheData: any;
  totalhours: any;
  isError: boolean;
  timesheetForm: FormGroup
  currentUserDetail: any;
  revisiting: boolean;
  newIndex: any;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public alertCtrl: AlertController
    , public phasesService: PhasesService
    , public projectService: ProjectService
    , public loadingCtrl: LoadingController
    , public timesheetService: TimesheetService
    , public _cacheService: CacheService
    , public formBuilder: FormBuilder
  ) {
    this.weekStartDate = moment().add(0, 'weeks').isoWeekday(1);
    this.weekEndDate = moment().add(1, 'weeks').isoWeekday(0);
    this.showWeekEnd = new Date(this.weekEndDate);
    this.showWeekStart = new Date(this.weekStartDate);
    this.projectList = [];
    this.timesheetList = [];
    this.tasksList = [];
    this.addedProject = [];
    this.addedTask = [];
    this.aproverUser = {};
    this.cacheKey = '';
    this.cacheData = {};
    this.initTotalHour();
    this.revisiting = false;
    this.currentUserDetail = JSON.parse(localStorage.getItem('loggedInUserDetails'));
  }

  ionViewDidLoad() {
    this.getProjects();
  }

  ionViewDidEnter() {
    if (this._cacheService.exists(this.cacheKey)) {
      // this.timesheetList = JSON.parse(this._cacheService.get(this.cacheKey));
      this.cacheData = this._cacheService.get(this.cacheKey);
      this.revisiting = true;
    }
  }

  addProjectClicked() {
    this.pushTimeSheet();
    this.newIndex = this.timesheetList.length;
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

  isDropDownValid(event) {
    if (event === { label: 'Select', value: null })
      return false;
    return true;
  }

  projectChanged(event, index) {
    if (this.isDropDownValid(event)) {
      this.isError = false;

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
          loader.dismiss();
        }, err => {
          loader.dismiss();
        });
      });
      this.timesheetList[index].Project.ID = event.value.ID;
      this.timesheetList[index].Project.Title = event.value.Title;
      this.timesheetList[index].Project.Value = event.value.Title;
      this.timesheetList[index].ApproverUser = {
        ID: event.value.AccountManager.ID,
        Value: event.value.AccountManager.Name
      };

    } else {
      this.isError = true;
    }
  }

  phaseChanged(event, index) {
    console.log('phaseChanged => ', event);
    if (this.isDropDownValid(event)) {
      this.isError = false;
      this.addedTask[index] = event;
      this.projectCount[index] = { phase: event };
      this.timesheetList[index].Task = event.label;
      this.currentTaskIndex = index;
      // this.cacheData = { Timesheets: this.timesheetList };

      this.revisiting ? this.handleNew() : this.objectAssembly();
      console.log('cacheData => ', this.cacheData);
    } else {
      this.isError = true;
    }

  }

  handleNew() {
    this.cacheData.Timesheet[this.cacheData.Timesheet.length] = this.timesheetList[this.timesheetList.length];
    console.log('phase changed cacheData', this.cacheData);
    console.log('phase changed timesheetList', this.timesheetList);
  }

  cardClick(index) {
    console.log(this.timesheetList);
    this.cacheKey = this.assembleCacheKey();
    console.log('name => ', this.cacheKey);

    if (this._cacheService.exists(this.cacheKey)) {
      this._cacheService.remove(this.cacheKey);
      this._cacheService.set(this.cacheKey, this.cacheData, { maxAge: 60 * 60 });
    } else {
      this._cacheService.set(this.cacheKey, this.cacheData, { maxAge: 60 * 60 });
    }
    this.navCtrl.push(TaskDetailPage, { caller: 'enter-timesheet', isEnterTimesheet: true, timesheetData: { timesheetIndex: index, cacheKey: this.cacheKey } });
  }

  assembleCacheKey() {
    return 'enterTimesheet-' + this.weekStartDate.add(0, 'weeks').isoWeekday(1).format('D/M') + '-' + this.weekEndDate.add(1, 'weeks').isoWeekday(0).format('D/M');
  }

  submitTimesheetClicked() {

  }

  totalAllHours() { }

  saveTimesheetClicked() {
    this.isError = false;

    // "SubmittedStatus": "Not Submitted",
    // "WeekNumber": "09",
    // this.timesheetService.saveTimesheet(this.cacheData).subscribe( res => {
    //   console.log('save clicked, response => ', res);
    // }, err => {
    //   console.log('save clicked, errror response => ', err);
    // });

    console.log(this.cacheData);
  }

  objectAssembly() {
    // for (var i in this.cacheData.Timesheets)
    // for (var key in this.totalhours) {
    //   this.cacheData.Timesheets[i][key] = this.totalhours[key];
    // }
    this.cacheData.ApproverUser = [];
    this.cacheData.Timesheets = [];
    var user = [], tSheet = [];
    for (let i = 0; i < this.timesheetList.length; i++) {
      user.push(this.timesheetList[i].ApproverUser);
      tSheet.push(
        {
          WeekNumber: moment(this.weekStartDate).week(),
          ProjectTimesheetStatus: 'Saved',
          StartDate: this.weekStartDate,
          EndDate: this.weekStartDate,
          TimesheetStartDate: this.weekStartDate,
          TimesheetEndDate: this.weekEndDate,
          ApproverComment: null,
          TimesheetStatus: 'Active',
          Mondayhrs: '',
          Mondaydesc: '',
          Tuesdayhrs: '',
          Tuesdaydesc: '',
          Wednesdayhrs: '',
          Wednesdaydesc: '',
          Thursdayhrs: '',
          Thursdaydesc: '',
          Fridayhrs: '',
          Fridaydesc: '',
          Saturdayhrs: '',
          Saturdaydesc: '',
          Sundayhrs: '',
          Sundaydesc: '',
          Mondaynbhrs: '',
          Tuesdaynbhrs: '',
          Wednesdaynbhrs: '',
          Thursdaynbhrs: '',
          Fridaynbhrs: '',
          Saturdaynbhrs: '',
          Sundaynbhrs: '',
          Mondaydescnb: '',
          Tuesdaydescnb: '',
          Wednesdaydescnb: '',
          Thursdaydescnb: '',
          Fridaydescnb: '',
          Saturdaydescnb: '',
          Sundaydescnb: '',
          Project: this.timesheetList[i].Project,
          ApproverUser: this.timesheetList[i].ApproverUser
        });
    }
    this.cacheData = {
      Timesheets: tSheet,
      ApproverUser: user,
      Employee: this.currentUserDetail.Employee,
      EmployeeName: this.currentUserDetail.Employee.Name,
      EmployeeDepartment: this.currentUserDetail.Department.Value,
      TimesheetStartDate: this.weekStartDate,
      TimesheetEndDate: this.weekEndDate,
      StartDate: this.weekStartDate,
      EndDate: this.weekEndDate,
      BillableHours: '0',
      NonBillableHours: '45',
      SubmittedStatus: 'Not Submitted',
      WeekNumber: moment(this.weekStartDate).week(),
      CalendarYear: '2016',
      TotalhrsFriday: 0,
      TotalhrsMonday: 0,
      TotalhrsSaturday: 0,
      TotalhrsSunday: 0,
      TotalhrsThursday: 0,
      TotalhrsTuesday: 0,
      TotalhrsWednesday: 0,
      TotalhrsTimesheet: 0,
      Total: 0
    }
  }

  lastWeekClick() {
    this.weekStartDate = this.weekStartDate.subtract(1, 'w');
    this.weekEndDate = this.weekEndDate.subtract(1, 'w');
    this.showWeekEnd = new Date(this.weekEndDate);
    this.showWeekStart = new Date(this.weekStartDate);

    /** TODO: get timesheet acc to date selected for edit mode */
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.timesheetService.getCurrentEmpTimesheetByDate(this.showWeekStart).subscribe(res => {
        this.cacheData = res;
        this.timesheetList = this.cacheData.Timesheets;
        console.log(res);
      });
    });
  }

  nextWeekClick() {
    this.weekStartDate = this.weekStartDate.add(1, 'w');
    this.weekEndDate = this.weekEndDate.add(1, 'w');
    this.showWeekEnd = new Date(this.weekEndDate);
    this.showWeekStart = new Date(this.weekStartDate);

    /** TODO: get timesheet acc to date selected for edit mode */
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.timesheetService.getCurrentEmpTimesheetByDate(this.showWeekStart).subscribe(res => {
        this.cacheData = res;
        this.timesheetList = this.cacheData.Timesheets;
        console.log(res);
      });
    });
  }

  initTotalHour() {
    this.totalhours = {
      TotalhrsFriday: 0,
      TotalhrsMonday: 0,
      TotalhrsSaturday: 0,
      TotalhrsSunday: 0,
      TotalhrsThursday: 0,
      TotalhrsTuesday: 0,
      TotalhrsWednesday: 0,
      TotalhrsTimesheet: 0,
      Total: 0
    };
  }
}

/**
 * timesheet index => index of card
 * isSubmitted => false
 */