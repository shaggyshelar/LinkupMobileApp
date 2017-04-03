import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'ng2-cache/ng2-cache';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment'
import * as _ from 'lodash/index';

import { PhasesService, ProjectService, TimesheetService, EmployeeTimesheetService } from '../index';
import { AuthService } from '../../../providers/index';
import { Timesheet, emptyTimesheetModel, weekArray, monday, tuesday, wednesday, thursday, friday, saturday, sunday } from '../models/timesheet.model';

import { TaskDetailPage } from '../task-detail/task-detail';
import { EnterTimesheetDetailsPage } from '../enter-timesheet-details/enter-timesheet-details';

@Component({
  selector: 'page-enter-timesheet',
  templateUrl: 'enter-timesheet.html',
  providers: [PhasesService, ProjectService, TimesheetService, AuthService, EmployeeTimesheetService]
})
export class EnterTimesheetPage {

  selectedDate: any;
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
  timesheetID: string;
  timesheetModel: any = {};
  emptyTimesheet: emptyTimesheetModel;
  timesheetStatus: string = 'New';
  weekProjects: weekArray;
  isDataretrived : boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams
    , public alertCtrl: AlertController
    , public phasesService: PhasesService
    , public projectService: ProjectService
    , public loadingCtrl: LoadingController
    , public timesheetService: TimesheetService
    , public _cacheService: CacheService
    , public formBuilder: FormBuilder
    , public authService: AuthService
    , public employeeTimesheetService: EmployeeTimesheetService
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
    this.timesheetID = this.navParams.get('timesheetID');


  }

  ionViewDidLoad() {
    this.getProjects();
    //this.pushTimeSheet();
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
    let time = new Timesheet([{ID:0,Value:''}], {ID:0,Value:''}, '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0);
    this.timesheetList.push(time);
  }
  getEmptyTimesheet() {
    this.timesheetStatus = 'New';
    for (var index = 0; index < 7; index++) {
      var empty: emptyTimesheetModel = new emptyTimesheetModel();
      empty.date = moment(this.weekStartDate).add(index, 'days');
      empty.hours = '00:00';
      this.timesheetList.push(empty);
    }
  }

  getProjects() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.projectService.getMyProjectsForTimesheet({ Date: this.weekStartDate }).subscribe(res => {
        // this.projectList.push({ label: 'Select', value: null });
        for (var index in res) {
          this.projectList.push({ label: res[index].Title, value: res[index] });
        }
        if (this.timesheetID) {
          this.getTimesheetForEdit();
        }
        else {
          this.employeeTimesheetService.getCurrentEmpTimesheetByDate({ Date: new Date() }).subscribe((res: any) => {
            if (res !== null) {
              this.timesheetModel = res;
              this.timesheetID = res.ID;
              this.getTimesheetForEdit();
            }
            else {
              //this.getEmptyTimesheet();
              this.createTimesheetList();
            }
          });
        }
        loader.dismiss();
      }, err => {
        loader.dismiss();
      });
    });
  }

  /** Get Timesheet to Edit */

  getTimesheetForEdit() {
    this.timesheetService.getTimesheetByID(this.timesheetID).subscribe((res: any) => {
      this.timesheetModel = res;
      this.timesheetList = res.Timesheets;
      this.weekStartDate = res.StartDate;
      this.weekEndDate = res.EndDate;
      this.showWeekEnd = new Date(this.weekEndDate);
      this.showWeekStart = new Date(this.weekStartDate);
      this.timesheetStatus = res.SubmittedStatus;
      this.setTotal(res);
      // if (this.timesheetStatus !== 'Approved' && this.timesheetStatus !== 'Submitted') {
      //   for (let i = 0; i < this.timesheetList.length; i++) {
      //     let project = _.find(this.projectList, function (item) {
      //       return item.value !== null && item.value.ID === res.Timesheets[i].Project.ID;
      //     });
      //     this.timesheetList[i].Project = project.value;
      //     this.onProjectChange(project.value, i);
      //   }
      // }
      this.createTimesheetList();
      //console.log(res);
    });
  }

  onProjectChange(selectedProject: any, index: number) {
    this.isError = false;
    this.tasksList[index] = [];
    this.timesheetList[index].ApproverUser = {};
    this.timesheetList[index].ApproverUser.Value = selectedProject.AccountManager.Name;
    this.timesheetList[index].ApproverUser.ID = selectedProject.AccountManager.ID;
    this.phasesService.getPhasesByProject(selectedProject).subscribe((res: any) => {
      this.tasksList[index].push({ label: 'Select', value: null });
      for (var i in res) {
        this.tasksList[index].push({ label: res[i].PhaseName, value: res[i].PhaseName });
      }
    });
  }

  setTotal(total: any) {
    this.totalhours = {
      TotalhrsFriday: total.TotalhrsFriday === null ? 0 : total.TotalhrsFriday,
      TotalhrsMonday: total.TotalhrsMonday === null ? 0 : total.TotalhrsMonday,
      TotalhrsSaturday: total.TotalhrsSaturday === null ? 0 : total.TotalhrsSaturday,
      TotalhrsSunday: total.TotalhrsSunday === null ? 0 : total.TotalhrsSunday,
      TotalhrsThursday: total.TotalhrsThursday === null ? 0 : total.TotalhrsThursday,
      TotalhrsTuesday: total.TotalhrsTuesday === null ? 0 : total.TotalhrsTuesday,
      TotalhrsWednesday: total.TotalhrsWednesday === null ? 0 : total.TotalhrsWednesday,
      TotalhrsTimesheet: total.TotalhrsTimesheet === null ? 0 : total.TotalhrsTimesheet,
    };
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
  }

  cardClick(index) {
    this.cacheKey = this.assembleCacheKey();

    if (this._cacheService.exists(this.cacheKey)) {
      this._cacheService.remove(this.cacheKey);
      this._cacheService.set(this.cacheKey, this.cacheData, { maxAge: 60 * 60 });
    } else {
      this._cacheService.set(this.cacheKey, this.cacheData, { maxAge: 60 * 60 });
    }
    this.navCtrl.push(TaskDetailPage, { caller: 'enter-timesheet', isEnterTimesheet: true, timesheetData: { timesheetIndex: index, cacheKey: this.cacheKey } });
  }

  timesheetClicked(index) {
    this.navCtrl.push(EnterTimesheetDetailsPage, { data: this.weekProjects, index: index, weekstart: this.weekStartDate, myProjects: this.projectList, tStatus: this.timesheetStatus, timesheetData: this.timesheetModel, timesheetList:this.timesheetList
    ,totalhours:this.totalhours });
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
    this.timesheetList = [];
    this.timesheetModel = null;
    this.initTotalHour();
    this.weekStartDate = moment(this.weekStartDate).subtract(1, 'weeks');
    this.weekEndDate = moment(this.weekEndDate).subtract(1, 'weeks');
    this.showWeekEnd = new Date(this.weekEndDate);
    this.showWeekStart = new Date(this.weekStartDate);
    this.timesheetList = [];
    this.cacheData = {};
    /** TODO: get timesheet acc to date selected for edit mode */
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.employeeTimesheetService.getCurrentEmpTimesheetByDate({ Date: this.showWeekStart }).subscribe(res => {
        this.timesheetModel = res;
        if (this.timesheetModel) {
          this.timesheetID = res.ID;
          this.getTimesheetForEdit();
        }
        else {
          // this.getEmptyTimesheet();
          this.createTimesheetList();
        }
        // this.timesheetList = this.cacheData.Timesheets;
        loader.dismiss();
      });
    });
  }

  nextWeekClick() {
    this.timesheetList = [];
    this.timesheetModel = null;
    this.initTotalHour();
    this.weekStartDate = moment(this.weekStartDate).add(1, 'weeks');
    this.weekEndDate = moment(this.weekEndDate).add(1, 'weeks');
    this.showWeekEnd = new Date(this.weekEndDate);
    this.showWeekStart = new Date(this.weekStartDate);
    this.timesheetList = [];
    this.cacheData = {};
    /** TODO: get timesheet acc to date selected for edit mode */
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.employeeTimesheetService.getCurrentEmpTimesheetByDate({ Date: this.showWeekStart }).subscribe(res => {
        this.timesheetModel = res;
        if (this.timesheetModel) {
          this.timesheetID = res.ID;
          this.getTimesheetForEdit();
        }
        else {
          //this.getEmptyTimesheet();
          this.createTimesheetList();
        }
        // this.timesheetList = this.cacheData.Timesheets;
        loader.dismiss();
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

  onPreviousWeek() {
    this.selectedDate = moment(moment(this.selectedDate).subtract(1, 'weeks').isoWeekday(1).format('MM/DD/YYYY')).toDate();
    this.weekEndDate = moment(this.selectedDate).add(1, 'weeks').isoWeekday(0);
    this.weekStartDate = moment(this.selectedDate);
  }
  onNextWeek() {
    this.selectedDate = moment(moment(this.selectedDate).add(1, 'weeks').isoWeekday(1).format('MM/DD/YYYY')).toDate();
    this.weekEndDate = moment(this.selectedDate).add(1, 'weeks').isoWeekday(0);
    this.weekStartDate = moment(this.selectedDate);
  }
  getDate(day: number) {
    return moment(this.weekStartDate).add(day, 'days');
  }
  saveClicked() {

  }
  submitClicked() {

  }

  /** Create Timesheet */

  initializeWeekprojects() {

  }

  createTimesheetList() {
    this.weekProjects = new weekArray();
    for (var index = 0; index < this.timesheetList.length; index++) {
      var project = this.timesheetList[index];
      //if (project.Mondayhrs || project.Mondaynbhrs) {
        var monproj: any = this.createMondayProject(project);
        this.weekProjects.MondayArray.push(monproj);
     // }
      //if (project.Tuesdayhrs || project.Tuesdaynbhrs) {
        this.weekProjects.TuesdayArray.push(this.createTuesdayProject(project));
     // }
    //  if (project.Wednesdayhrs || project.Wednesdaynbhrs) {
        this.weekProjects.WednesdayArray.push(this.createWednesdayProject(project));
    //  }
     // if (project.Thursdayhrs || project.Thursdaynbhrs) {
        this.weekProjects.ThursdayArray.push(this.createThursdayProject(project));
     // }
    //  if (project.Fridayhrs || project.Fridaynbhrs) {
        this.weekProjects.FridayArray.push(this.createFridayProject(project));
    //  }
    //  if (project.Saturdayhrs || project.Saturdaynbhrs) {
        this.weekProjects.SaturdayArray.push(this.createSaturdayProject(project));
    //  }
     // if (project.Sundayhrs || project.Sundaynbhrs) {
        this.weekProjects.SundayArray.push(this.createSundayProject(project));
    //  }

    }

    if (this.weekProjects.MondayArray.length == 0)
      this.weekProjects.MondayArray.push(this.createMondayProject(null));
    if (this.weekProjects.TuesdayArray.length == 0)
      this.weekProjects.TuesdayArray.push(this.createTuesdayProject(null));
    if (this.weekProjects.WednesdayArray.length == 0)
      this.weekProjects.WednesdayArray.push(this.createWednesdayProject(null));
    if (this.weekProjects.ThursdayArray.length == 0)
      this.weekProjects.ThursdayArray.push(this.createThursdayProject(null));
    if (this.weekProjects.FridayArray.length == 0)
      this.weekProjects.FridayArray.push(this.createFridayProject(null));
    if (this.weekProjects.SaturdayArray.length == 0)
      this.weekProjects.SaturdayArray.push(this.createSaturdayProject(null));
    if (this.weekProjects.SundayArray.length == 0)
      this.weekProjects.SundayArray.push(this.createSundayProject(null));

   




  }
  createMondayProject(project: any) {
    var mondayProject: monday = new monday();
    mondayProject.ApproverUser = project ? project.ApproverUser : {ID: 0 , Value : ''};
    mondayProject.ApproverComment = project ? project.ApproverComment : '';
    mondayProject.Billable = project ? project.Billable : '';
    mondayProject.ID = project ? project.ID : '';
    mondayProject.Mondaydesc = project ? project.Mondaydesc : '';
    mondayProject.Mondaydescnb = project ? project.Mondaydescnb : '';
    mondayProject.Mondayhrs = project ? project.Mondayhrs : '';
    mondayProject.Mondaynbhrs = project ? project.Mondaynbhrs : '';
    mondayProject.Project = project ? project.Project : {ID: 0 , Value : ''};
    mondayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    mondayProject.Task = project ? project.Task : '';
    mondayProject.TimesheetID = project ? project.TimesheetID : '';
    mondayProject.TotalhrsMonday = project ? this.totalhours.TotalhrsMonday : '';

    this.isDataretrived = true;
    //mondayProject.date = moment(this.weekStartDate).add(0, 'days');

    return mondayProject;
  }

  createTuesdayProject(project: any) {
    var tuesdayProject: tuesday = new tuesday();
    tuesdayProject.ApproverUser = project ? project.ApproverUser : {ID: 0 , Value : ''};
    tuesdayProject.ApproverComment = project ? project.ApproverComment : '';
    tuesdayProject.Billable = project ? project.Billable : '';
    tuesdayProject.ID = project ? project.ID : '';
    tuesdayProject.Tuesdaydesc = project ? project.Tuesdaydesc : '';
    tuesdayProject.Tuesdaydescnb = project ? project.Tuesdaydescnb : '';
    tuesdayProject.Tuesdayhrs = project ? project.Tuesdayhrs : '';
    tuesdayProject.Tuesdaynbhrs = project ? project.Tuesdaynbhrs : '';
    tuesdayProject.Project = project ? project.Project : {ID: 0 , Value : ''};
    tuesdayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    tuesdayProject.Task = project ? project.Task : '';
    tuesdayProject.TimesheetID = project ? project.TimesheetID : '';
    tuesdayProject.TotalhrsTuesday = project ? this.totalhours.TotalhrsTuesday : '';
    //tuesdayProject.date = moment(this.weekStartDate).add(1, 'days');
    return tuesdayProject;
  }

  createWednesdayProject(project: any) {
    var wednesdayProject: wednesday = new wednesday();
    wednesdayProject.ApproverUser = project ? project.ApproverUser : {ID: 0 , Value : ''};
    wednesdayProject.ApproverComment = project ? project.ApproverComment : '';
    wednesdayProject.Billable = project ? project.Billable : '';
    wednesdayProject.ID = project ? project.ID : '';
    wednesdayProject.Wednesdaydesc = project ? project.Wednesdaydesc : '';
    wednesdayProject.Wednesdaydescnb = project ? project.Wednesdaydescnb : '';
    wednesdayProject.Wednesdayhrs = project ? project.Wednesdayhrs : '';
    wednesdayProject.Wednesdaynbhrs = project ? project.Wednesdaynbhrs : '';
    wednesdayProject.Project = project ? project.Project : {ID: 0 , Value : ''};
    wednesdayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    wednesdayProject.Task = project ? project.Task : '';
    wednesdayProject.TimesheetID = project ? project.TimesheetID : '';
    wednesdayProject.TotalhrsWednesday = project ? this.totalhours.TotalhrsWednesday : '';
    //wednesdayProject.date = moment(this.weekStartDate).add(2, 'days');
    return wednesdayProject;
  }

  createThursdayProject(project: any) {
    var thursdayProject: thursday = new thursday();
    thursdayProject.ApproverUser = project ? project.ApproverUser : {ID: 0 , Value : ''};
    thursdayProject.ApproverComment = project ? project.ApproverComment : '';
    thursdayProject.Billable = project ? project.Billable : '';
    thursdayProject.ID = project ? project.ID : '';
    thursdayProject.Thursdaydesc = project ? project.Thursdaydesc : '';
    thursdayProject.Thursdaydescnb = project ? project.Thursdaydescnb : '';
    thursdayProject.Thursdayhrs = project ? project.Thursdayhrs : '';
    thursdayProject.Thursdaynbhrs = project ? project.Thursdaynbhrs : '';
    thursdayProject.Project = project ? project.Project : {ID: 0 , Value : ''};
    thursdayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    thursdayProject.Task = project ? project.Task : '';
    thursdayProject.TimesheetID = project ? project.TimesheetID : '';
    thursdayProject.TotalhrsThursday = project ? this.totalhours.TotalhrsThursday : '';
    //thursdayProject.date = moment(this.weekStartDate).add(3, 'days');
    return thursdayProject;
  }

  createFridayProject(project: any) {
    var fridayProject: friday = new friday();
    fridayProject.ApproverUser = project ? project.ApproverUser : {ID: 0 , Value : ''};
    fridayProject.ApproverComment = project ? project.ApproverComment : '';
    fridayProject.Billable = project ? project.Billable : '';
    fridayProject.ID = project ? project.ID : '';
    fridayProject.Fridaydesc = project ? project.Fridaydesc : '';
    fridayProject.Fridaydescnb = project ? project.Fridaydescnb : '';
    fridayProject.Fridayhrs = project ? project.Fridayhrs : '';
    fridayProject.Fridaynbhrs = project ? project.Fridaynbhrs : '';
    fridayProject.Project = project ? project.Project : {ID: 0 , Value : ''};
    fridayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    fridayProject.Task = project ? project.Task : '';
    fridayProject.TimesheetID = project ? project.TimesheetID : '';
    fridayProject.TotalhrsFriday = project ? this.totalhours.TotalhrsFriday : '';
    //fridayProject.date = moment(this.weekStartDate).add(4, 'days');
    return fridayProject;
  }
  createSaturdayProject(project: any) {
    var saturdayProject: saturday = new saturday();
    saturdayProject.ApproverUser = project ? project.ApproverUser : {ID: 0 , Value : ''};
    saturdayProject.ApproverComment = project ? project.ApproverComment : '';
    saturdayProject.Billable = project ? project.Billable : '';
    saturdayProject.ID = project ? project.ID : '';
    saturdayProject.Saturdaydesc = project ? project.Saturdaydesc : '';
    saturdayProject.Saturdaydescnb = project ? project.Saturdaydescnb : '';
    saturdayProject.Saturdayhrs = project ? project.Saturdayhrs : '';
    saturdayProject.Saturdaynbhrs = project ? project.Saturdaynbhrs : '';
    saturdayProject.Project = project ? project.Project : {ID: 0 , Value : ''};
    saturdayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    saturdayProject.Task = project ? project.Task : '';
    saturdayProject.TimesheetID = project ? project.TimesheetID : '';
    saturdayProject.TotalhrsSaturday = project ? this.totalhours.TotalhrsSaturday : '';
    //saturdayProject.date = moment(this.weekStartDate).add(5, 'days');
    return saturdayProject;
  }
  createSundayProject(project: any) {
    var sundayProject: sunday = new sunday();
    sundayProject.ApproverUser = project ? project.ApproverUser : {ID: 0 , Value : ''};
    sundayProject.ApproverComment = project ? project.ApproverComment : '';
    sundayProject.Billable = project ? project.Billable : '';
    sundayProject.ID = project ? project.ID : '';
    sundayProject.Sundaydesc = project ? project.Sundaydesc : '';
    sundayProject.Sundaydescnb = project ? project.Sundaydescnb : '';
    sundayProject.Sundayhrs = project ? project.Sundayhrs : '';
    sundayProject.Sundaynbhrs = project ? project.Sundaynbhrs : '';
    sundayProject.Project = project ? project.Project : {ID: 0 , Value : ''};
    sundayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    sundayProject.Task = project ? project.Task : '';
    sundayProject.TimesheetID = project ? project.TimesheetID : '';
    sundayProject.TotalhrsSunday = project ? this.totalhours.TotalhrsSunday : '';
    //sundayProject.date = moment(this.weekStartDate).add(6, 'days');
    return sundayProject;
  }

  checkDescription() {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let i = 0; i < this.timesheetList.length; i++) {
      for (let j = 0; j < days.length; j++) {
        let billableDayHrs = this.timesheetList[i][days[j] + 'hrs'];
        let billableDayDesc = this.timesheetList[i][days[j] + 'desc'];
        let nonBillableDayHrs = this.timesheetList[i][days[j] + 'nbhrs'];
        let nonBillableDayDesc = this.timesheetList[i][days[j] + 'descnb'];
        if (billableDayHrs && billableDayHrs !== null && billableDayHrs !== '') {
          if (!billableDayDesc || billableDayDesc === null || billableDayDesc === '') {
            return false;
          }
        }
        if (nonBillableDayHrs && nonBillableDayHrs !== null && nonBillableDayHrs !== '') {
          if (!nonBillableDayDesc || nonBillableDayDesc === null || nonBillableDayDesc === '') {
            return false;
          }
        }
      }
    }
    return true;
  }
  checkTotalHours() {
    if (moment(this.totalhours.TotalhrsMonday, 'HH:mm').diff(moment('8:00', 'HH:mm')) < 0) {
      return false;
    }
    if (moment(this.totalhours.TotalhrsTuesday, 'HH:mm').diff(moment('8:00', 'HH:mm')) < 0) {
      return false;
    }
    if (moment(this.totalhours.TotalhrsWednesday, 'HH:mm').diff(moment('8:00', 'HH:mm')) < 0) {
      return false;
    }
    if (moment(this.totalhours.TotalhrsThursday, 'HH:mm').diff(moment('8:00', 'HH:mm')) < 0) {
      return false;
    }
    if (moment(this.totalhours.TotalhrsFriday, 'HH:mm').diff(moment('8:00', 'HH:mm')) < 0) {
      return false;
    }
    return true;
  }
  checkProjectAndTask() {
    this.isError = false;
    let timesheet = this.timesheetList[this.timesheetList.length - 1];
    if (!timesheet.Project || timesheet.Project === null) {
      this.isError = true;
      //this.errorMessage = 'Please select Project';
      return false;
    }
    if (!timesheet.Task || timesheet.Task === null || timesheet.Task === '') {
      this.isError = true;
      //this.errorMessage = 'Please select Task';
      return false;
    }
    return true;
  }


  //  saveNotes() {
  //   if (this.notes && this.notes !== null) {
  //     this.timesheetList[this.dialog.index][this.dialog.property] = this.notes.trim();
  //   }
  //   this.dialogVisible = false;
  // }

  saveTimsheet() {
    this.isError = false;
    if (!this.checkProjectAndTask()) {
      return;
    }
    let payload = this.getPayload(true);
    this.timesheetService.saveTimesheet(payload).subscribe((res: any) => {
      //this.onCancel();
      this.navCtrl.pop();
    });
  }

  onSendForApproval() {
    if (!this.checkProjectAndTask()) {
      return;
    }
    if (!this.checkTotalHours()) {
      this.isError = true;
     // this.errorMessage = 'Please make total hours of all days atleast 8 to submit timesheet';
      return;
    }
    if (!this.checkDescription()) {
      this.isError = true;
      //this.errorMessage = 'You cannot add empty Description!';
      return;
    }

      let payload = this.getPayload(false);
    this.timesheetService.submitTimesheet(payload).subscribe((res: any) => {
    });
    // this.timesheetService.submitTimesheet().subscribe((res: any) => {
    //   console.log(res);
    // });

  }

   getPayload(isSave: boolean) {
    let payload: any = {};
    for (var key in this.totalhours) {
      payload[key] = this.totalhours[key];
    }
    payload.ApproverUser = [];
    for (let i = 0; i < this.timesheetList.length; i++) {
      payload.ApproverUser.push(this.timesheetList[i].ApproverUser);
      this.timesheetList[i].WeekNumber = moment(this.weekStartDate).week();
      this.timesheetList[i].Project.Value = this.timesheetList[i].Project.Value;
      this.timesheetList[i].ProjectTimesheetStatus = isSave ? 'Not Submitted' : 'Submitted';
      this.timesheetList[i].StartDate = this.weekStartDate;
      this.timesheetList[i].EndDate = this.weekStartDate;
      this.timesheetList[i].TimesheetStartDate = this.weekStartDate;
      this.timesheetList[i].TimesheetEndDate = this.weekEndDate;
      this.timesheetList[i].ApproverComment = null;
      this.timesheetList[i].TimesheetStatus = 'Active';
      this.timesheetList[i].TimesheetID = this.timesheetID;
    }
    payload.Timesheets = this.timesheetList;
    payload.Employee = this.currentUserDetail.Employee;
    payload.EmployeeName = this.currentUserDetail.Employee.Name;
    payload.EmployeeDepartment = this.currentUserDetail.Department.Value;
    payload.TimesheetStartDate = this.weekStartDate;
    payload.TimesheetEndDate = this.weekEndDate;
    payload.StartDate = this.weekStartDate;
    payload.EndDate = this.weekEndDate;
    payload.BillableHours = '0';
    payload.NonBillableHours = '45';
    payload.SubmittedStatus = isSave ? 'Not Submitted' : 'Submitted';
    payload.WeekNumber = moment(this.weekStartDate).week();
    payload.CalendarYear = '2016';
    payload.ID = this.timesheetID;
    return payload;
  }

}



/**
 * timesheet index => index of card
 * isSubmitted => false
 */