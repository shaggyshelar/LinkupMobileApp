import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'ng2-cache/ng2-cache';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment'
import * as _ from 'lodash/index';

import { ToastService } from '../../../providers/shared/services/toast.service';
import { PhasesService, ProjectService, TimesheetService, EmployeeTimesheetService } from '../index';
import { AuthService } from '../../../providers/index';
import { Timesheet, emptyTimesheetModel, weekArray, monday, tuesday, wednesday, thursday, friday, saturday, sunday } from '../models/timesheet.model';

import { TaskDetailPage } from '../task-detail/task-detail';
import { EnterTimesheetDetailsPage } from '../enter-timesheet-details/enter-timesheet-details';

@Component({
  selector: 'page-enter-timesheet',
  templateUrl: 'enter-timesheet.html',
  providers: [PhasesService, ProjectService, TimesheetService, AuthService, EmployeeTimesheetService, ToastService]
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
  timesheetStatus: string = 'New Timesheet';
  weekProjects: weekArray;
  isDataretrived: boolean = false;
  currentWkStrt: any = {};
  isDailyHoursComplete: boolean = false;
  isDayScrollable: any[] = [0, 0, 0, 0, 0, 0, 0];
  isLeaveApproved: boolean;
  allowNextWeekClick: boolean = true;


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
    , public toastService: ToastService
  ) {
    this.currentWkStrt = moment().add(0, 'weeks').isoWeekday(1);
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
    this.isLeaveApproved = true;
    this.currentUserDetail = JSON.parse(localStorage.getItem('loggedInUserDetails'));
    this.timesheetID = this.navParams.get('timesheetID');
    // this.getProjects();

  }

  ionViewDidLoad() {
    this.getProjects();
  }

  ionViewDidEnter() {
    // this.timesheetID = this.
  }

  /** Uncomment the code below during deployment */
  allowPeekNextWeek() {
    // let date = /*this.timesheetModel == {} || this.timesheetModel == null ? this.timesheetModel.StartDate : */this.showWeekStart.toISOString();
    // if (moment(moment(date).format('MM-DD-YYYY')).isSameOrAfter(moment().add(0, 'weeks').isoWeekday(1).format('MM-DD-YYYY'))) {
    //   this.allowNextWeekClick = false;
    // } else {
    //   this.allowNextWeekClick = true;
    // }
  }

  ionViewWillEnter() {
  }

  addProjectClicked() {
    this.pushTimeSheet();
    this.newIndex = this.timesheetList.length;
  }

  pushTimeSheet() {
    let time = new Timesheet();
    time.ID = 0;
    time.ProjectTimesheetStatus = 'New Timesheet';
    this.timesheetList.push(time);
  }
  getEmptyTimesheet() {
    this.timesheetStatus = 'New Timesheet';
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
    this.allowPeekNextWeek();
  }

  /** Get Timesheet to Edit */

  getTimesheetForEdit() {
    this.timesheetService.getTimesheetByID(this.timesheetID).subscribe((res: any) => {
      this.timesheetModel = res;
      // console.log('timesheet => ', this.timesheetModel);
      this.timesheetList = res.Timesheets;

      //START : Add PendingApprover to res.Timesheets[] object from res.PendingApprovers
      this.timesheetList.forEach((element, index) => {
        this.timesheetList[index].PendingApprover = { Value: null, ID: 0 };
      });
      //END

      //START : handleing 'Inactive' status
      // var bufTimesheet = [];
      // this.timesheetList.forEach((element, index) => {
      //   if (element.ProjectTimesheetStatus != 'Inactive')
      //     bufTimesheet.push(element);
      // });
      // this.timesheetList = [];
      // this.timesheetList = bufTimesheet;
      //End : handleing 'Inactive' status

      if (res.Timesheets.length < 1) {
        this.pushTimeSheet
      }
      this.weekStartDate = res.StartDate;
      this.weekEndDate = res.EndDate;
      this.showWeekEnd = new Date(this.weekEndDate);
      this.showWeekStart = new Date(this.weekStartDate);
      // if (moment(moment(this.currentWkStrt).format('mm-DD-YYYY')).after(moment(this.weekStartDate).format('mm-DD-YYYY'), 'day'))
      //   this.timesheetStatus = 'New';
      // else
      this.timesheetStatus = res.SubmittedStatus;
      // for (var i = 0; i < this.timesheetList.length; i++) {
      //   if (typeof this.timesheetList[i].ID === 'undefined')
      //     this.timesheetList[i].ID = 0;
      // }
      // console.log('timesheetList => ', this.timesheetList);
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
      this.allowPeekNextWeek();
    });
  }

  onProjectChange(selectedProject: any, index: number) {
    this.isError = false;
    this.tasksList[index] = [];
    this.timesheetList[index].ApproverUser = {};
    this.timesheetList[index].ApproverUser.Value = selectedProject.AccountManager.Name;
    this.timesheetList[index].ApproverUser.ID = selectedProject.AccountManager.ID;
    this.timesheetList[index].PendingApprover = {};
    this.timesheetList[index].PendingApprover.Value = selectedProject.AccountManager.Name;
    this.timesheetList[index].PendingApprover.ID = selectedProject.AccountManager.ID;
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
    this.navCtrl.push(EnterTimesheetDetailsPage, {
      data: this.weekProjects, index: index, weekstart: this.weekStartDate, myProjects: this.projectList, tStatus: this.timesheetStatus, timesheetData: this.timesheetModel, timesheetList: this.timesheetList
      , totalhours: this.totalhours
    });
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

    // console.log(this.cacheData);
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
    this.timesheetID = '';
    /** TODO: get timesheet acc to date selected for edit mode */
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.employeeTimesheetService.getCurrentEmpTimesheetByDate({ Date: moment(new Date(this.showWeekStart)).add(1, 'days').toISOString() }).subscribe(res => {
        this.timesheetModel = res;
        if (this.timesheetModel) {
          this.timesheetID = res.ID;
          this.getTimesheetForEdit();
        }
        else {
          // this.getEmptyTimesheet();
          this.timesheetStatus = 'New Timesheet';
          this.createTimesheetList();
        }
        // this.timesheetList = this.cacheData.Timesheets;
        loader.dismiss();
        this.allowPeekNextWeek();
      });
    });
  }

  nextWeekClick() {
    // alert();
    this.timesheetList = [];
    this.timesheetModel = null;
    this.initTotalHour();
    this.weekStartDate = moment(this.weekStartDate).add(1, 'weeks');
    this.weekEndDate = moment(this.weekEndDate).add(1, 'weeks');
    this.showWeekEnd = new Date(this.weekEndDate);
    this.showWeekStart = new Date(this.weekStartDate);
    this.timesheetList = [];
    this.cacheData = {};
    this.timesheetID = '';
    /** TODO: get timesheet acc to date selected for edit mode */
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.employeeTimesheetService.getCurrentEmpTimesheetByDate({ Date: moment(new Date(this.showWeekStart)).add(1, 'days').toISOString() }).subscribe(res => {
        this.timesheetModel = res;
        if (this.timesheetModel) {
          this.timesheetID = res.ID;
          this.getTimesheetForEdit();
        }
        else {
          //this.getEmptyTimesheet();
          this.timesheetStatus = 'New Timesheet';
          this.createTimesheetList();
        }
        // this.timesheetList = this.cacheData.Timesheets;
        loader.dismiss();
        this.allowPeekNextWeek();
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



    this.scrollIconCalculate();
    this.leaveTaskValidation();
  }
  createMondayProject(project: any) {
    var mondayProject: monday = new monday();
    mondayProject.ApproverUser = project ? project.ApproverUser : { ID: 0, Value: '' };
    mondayProject.PendingApprover = project ? project.PendingApprover : { ID: 0, Value: '' };
    mondayProject.ApproverComment = project ? project.ApproverComment : '';
    mondayProject.Billable = project ? project.Billable : '';
    mondayProject.ID = project ? project.ID : '';
    mondayProject.Mondaydesc = project ? project.Mondaydesc : null;
    mondayProject.Mondaydescnb = project ? project.Mondaydescnb : null;
    mondayProject.Mondayhrs = project ? project.Mondayhrs : null;
    mondayProject.Mondaynbhrs = project ? project.Mondaynbhrs : null;
    mondayProject.Project = project ? project.Project : { ID: 0, Value: '' };
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
    tuesdayProject.ApproverUser = project ? project.ApproverUser : { ID: 0, Value: '' };
    tuesdayProject.PendingApprover = project ? project.PendingApprover : { ID: 0, Value: '' };
    tuesdayProject.ApproverComment = project ? project.ApproverComment : '';
    tuesdayProject.Billable = project ? project.Billable : '';
    tuesdayProject.ID = project ? project.ID : '';
    tuesdayProject.Tuesdaydesc = project ? project.Tuesdaydesc : null;
    tuesdayProject.Tuesdaydescnb = project ? project.Tuesdaydescnb : null;
    tuesdayProject.Tuesdayhrs = project ? project.Tuesdayhrs : null;
    tuesdayProject.Tuesdaynbhrs = project ? project.Tuesdaynbhrs : null;
    tuesdayProject.Project = project ? project.Project : { ID: 0, Value: '' };
    tuesdayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    tuesdayProject.Task = project ? project.Task : '';
    tuesdayProject.TimesheetID = project ? project.TimesheetID : '';
    tuesdayProject.TotalhrsTuesday = project ? this.totalhours.TotalhrsTuesday : '';
    //tuesdayProject.date = moment(this.weekStartDate).add(1, 'days');
    return tuesdayProject;
  }

  createWednesdayProject(project: any) {
    var wednesdayProject: wednesday = new wednesday();
    wednesdayProject.ApproverUser = project ? project.ApproverUser : { ID: 0, Value: '' };
    wednesdayProject.PendingApprover = project ? project.ApproverUser : { ID: 0, Value: '' };
    wednesdayProject.ApproverComment = project ? project.ApproverComment : '';
    wednesdayProject.Billable = project ? project.Billable : '';
    wednesdayProject.ID = project ? project.ID : '';
    wednesdayProject.Wednesdaydesc = project ? project.Wednesdaydesc : null;
    wednesdayProject.Wednesdaydescnb = project ? project.Wednesdaydescnb : null;
    wednesdayProject.Wednesdayhrs = project ? project.Wednesdayhrs : null;
    wednesdayProject.Wednesdaynbhrs = project ? project.Wednesdaynbhrs : null;
    wednesdayProject.Project = project ? project.Project : { ID: 0, Value: '' };
    wednesdayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    wednesdayProject.Task = project ? project.Task : '';
    wednesdayProject.TimesheetID = project ? project.TimesheetID : '';
    wednesdayProject.TotalhrsWednesday = project ? this.totalhours.TotalhrsWednesday : '';
    //wednesdayProject.date = moment(this.weekStartDate).add(2, 'days');
    return wednesdayProject;
  }

  createThursdayProject(project: any) {
    var thursdayProject: thursday = new thursday();
    thursdayProject.ApproverUser = project ? project.ApproverUser : { ID: 0, Value: '' };
    thursdayProject.PendingApprover = project ? project.PendingApprover : { ID: 0, Value: '' };
    thursdayProject.ApproverComment = project ? project.ApproverComment : '';
    thursdayProject.Billable = project ? project.Billable : '';
    thursdayProject.ID = project ? project.ID : '';
    thursdayProject.Thursdaydesc = project ? project.Thursdaydesc : null;
    thursdayProject.Thursdaydescnb = project ? project.Thursdaydescnb : null;
    thursdayProject.Thursdayhrs = project ? project.Thursdayhrs : null;
    thursdayProject.Thursdaynbhrs = project ? project.Thursdaynbhrs : null;
    thursdayProject.Project = project ? project.Project : { ID: 0, Value: '' };
    thursdayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    thursdayProject.Task = project ? project.Task : '';
    thursdayProject.TimesheetID = project ? project.TimesheetID : '';
    thursdayProject.TotalhrsThursday = project ? this.totalhours.TotalhrsThursday : '';
    //thursdayProject.date = moment(this.weekStartDate).add(3, 'days');
    return thursdayProject;
  }

  createFridayProject(project: any) {
    var fridayProject: friday = new friday();
    fridayProject.ApproverUser = project ? project.ApproverUser : { ID: 0, Value: '' };
    fridayProject.PendingApprover = project ? project.PendingApprover : { ID: 0, Value: '' };
    fridayProject.ApproverComment = project ? project.ApproverComment : '';
    fridayProject.Billable = project ? project.Billable : '';
    fridayProject.ID = project ? project.ID : '';
    fridayProject.Fridaydesc = project ? project.Fridaydesc : null;
    fridayProject.Fridaydescnb = project ? project.Fridaydescnb : null;
    fridayProject.Fridayhrs = project ? project.Fridayhrs : null;
    fridayProject.Fridaynbhrs = project ? project.Fridaynbhrs : null;
    fridayProject.Project = project ? project.Project : { ID: 0, Value: '' };
    fridayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    fridayProject.Task = project ? project.Task : '';
    fridayProject.TimesheetID = project ? project.TimesheetID : '';
    fridayProject.TotalhrsFriday = project ? this.totalhours.TotalhrsFriday : '';
    //fridayProject.date = moment(this.weekStartDate).add(4, 'days');
    return fridayProject;
  }
  createSaturdayProject(project: any) {
    var saturdayProject: saturday = new saturday();
    saturdayProject.ApproverUser = project ? project.ApproverUser : { ID: 0, Value: '' };
    saturdayProject.PendingApprover = project ? project.PendingApprover : { ID: 0, Value: '' };
    saturdayProject.ApproverComment = project ? project.ApproverComment : '';
    saturdayProject.Billable = project ? project.Billable : '';
    saturdayProject.ID = project ? project.ID : '';
    saturdayProject.Saturdaydesc = project ? project.Saturdaydesc : null;
    saturdayProject.Saturdaydescnb = project ? project.Saturdaydescnb : null;
    saturdayProject.Saturdayhrs = project ? project.Saturdayhrs : null;
    saturdayProject.Saturdaynbhrs = project ? project.Saturdaynbhrs : null;
    saturdayProject.Project = project ? project.Project : { ID: 0, Value: '' };
    saturdayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    saturdayProject.Task = project ? project.Task : '';
    saturdayProject.TimesheetID = project ? project.TimesheetID : '';
    saturdayProject.TotalhrsSaturday = project ? this.totalhours.TotalhrsSaturday : '';
    //saturdayProject.date = moment(this.weekStartDate).add(5, 'days');
    return saturdayProject;
  }
  createSundayProject(project: any) {
    var sundayProject: sunday = new sunday();
    sundayProject.ApproverUser = project ? project.ApproverUser : { ID: 0, Value: '' };
    sundayProject.PendingApprover = project ? project.PendingApprover : { ID: 0, Value: '' };
    sundayProject.ApproverComment = project ? project.ApproverComment : '';
    sundayProject.Billable = project ? project.Billable : '';
    sundayProject.ID = project ? project.ID : '';
    sundayProject.Sundaydesc = project ? project.Sundaydesc : null;
    sundayProject.Sundaydescnb = project ? project.Sundaydescnb : null;
    sundayProject.Sundayhrs = project ? project.Sundayhrs : null;
    sundayProject.Sundaynbhrs = project ? project.Sundaynbhrs : null;
    sundayProject.Project = project ? project.Project : { ID: 0, Value: '' };
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
      this.toastService.createToast('8 hours of work needed on Monday. Timesheet will not be submitted.');
      return false;
    }
    if (moment(this.totalhours.TotalhrsTuesday, 'HH:mm').diff(moment('8:00', 'HH:mm')) < 0) {
      this.toastService.createToast('8 hours of work needed on Tuesday. Timesheet will not be submitted.');
      return false;
    }
    if (moment(this.totalhours.TotalhrsWednesday, 'HH:mm').diff(moment('8:00', 'HH:mm')) < 0) {
      this.toastService.createToast('8 hours of work needed on Wednesday. Timesheet will not be submitted.');
      return false;
    }
    if (moment(this.totalhours.TotalhrsThursday, 'HH:mm').diff(moment('8:00', 'HH:mm')) < 0) {
      this.toastService.createToast('8 hours of work needed on Thursday. Timesheet will not be submitted.');
      return false;
    }
    if (moment(this.totalhours.TotalhrsFriday, 'HH:mm').diff(moment('8:00', 'HH:mm')) < 0) {
      this.toastService.createToast('8 hours of work needed on Friday. Timesheet will not be submitted.');
      return false;
    }
    this.isDailyHoursComplete = true;
    return true;
  }
  checkProjectAndTask() {
    this.isError = false;
    if (this.timesheetList.length == 0) {
      this.isError = true;
      return false;
    }
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
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.isError = false;
    if (!this.checkProjectAndTask()) {
      return;
    }
    let payload = this.getPayload(true);
    console.log('saving payload=> ', payload);
    loader.present().then(() => {
      this.timesheetService.saveTimesheet(payload).subscribe((res: any) => {
        //this.onCancel();
        if (res.StatusCode == 1) { this.navCtrl.pop(); loader.dismiss(); this.toastService.createToast("Timesheet Saved"); }
        else { this.toastService.createToast(res.Message); loader.dismiss(); }
      }, err => {
        loader.dismiss();
        console.log('err', err);
      });
    });
  }

  onSendForApproval() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    if (!this.checkProjectAndTask()) {
      return;
    }
    // if(!this.checkSubmitDateValid()) {
    //   this.toastService.createToast('Cannot submit timesheet before Friday.');
    //   return;
    // }
    if (!this.checkTotalHours()) {
      this.isError = true;
      // this.errorMessage = 'Please make total hours of all days atleast 8 to submit timesheet';
      return;
    }
    // if (!this.checkDescription()) {
    //   this.isError = true;
    //   //this.errorMessage = 'You cannot add empty Description!';
    //   return;
    // }

    loader.present().then(() => {

      let payload = this.getPayload(false);
      console.log('sending for approval payload=> ', payload);
      this.timesheetService.submitTimesheet(payload).subscribe((res: any) => {
        if (res.StatusCode == 1) { this.navCtrl.pop(); loader.dismiss(); this.toastService.createToast("Timesheet Submitted") }
        else { this.toastService.createToast(res.Message); loader.dismiss(); }
      }, err => {
        loader.dismiss();
      });
      // this.timesheetService.submitTimesheet().subscribe((res: any) => {
      //   console.log(res);
      // });
    });

  }

  getPayload(isSave: boolean) {

    let payload: any = {};
    for (var key in this.totalhours) {
      payload[key] = this.totalhours[key];
    }
    payload.ApproverUser = [];
    payload.PendingApprovers = [];
    if (this.timesheetModel)
      if (this.timesheetModel.PendingApprovers != null)
        payload.PendingApprovers = this.timesheetModel.PendingApprovers;
    for (let i = 0; i < this.timesheetList.length; i++) {
      payload.ApproverUser.push(this.timesheetList[i].ApproverUser);
      if (this.timesheetList[i].PendingApprover.Value != null)
        payload.PendingApprovers.push(this.timesheetList[i].PendingApprover);
      this.timesheetList[i].WeekNumber = moment(this.weekStartDate).week();
      this.timesheetList[i].Project.Value = this.timesheetList[i].Project.Value;
      if (this.timesheetList[i].ProjectTimesheetStatus != 'Inactive')
        this.timesheetList[i].ProjectTimesheetStatus = isSave ? 'Not Submitted' : 'Submitted';
      this.timesheetList[i].StartDate = this.weekStartDate;
      this.timesheetList[i].EndDate = this.weekEndDate;
      this.timesheetList[i].TimesheetStartDate = this.weekStartDate;
      this.timesheetList[i].TimesheetEndDate = this.weekEndDate;
      this.timesheetList[i].ApproverComment = null;
      this.timesheetList[i].TimesheetStatus = 'Active';
      this.timesheetList[i].TimesheetID = this.timesheetID;
      this.timesheetList[i].ID = this.timesheetList[i].ID ? this.timesheetList[i].ID : 0;
    }
    // payload.PendingApprovers = payload.ApproverUser
    payload.Title = this.currentUserDetail.EmpID;
    payload.Timesheets = this.timesheetList;
    payload.Employee = this.currentUserDetail.Employee;
    payload.EmployeeName = this.currentUserDetail.Employee.Name;
    payload.EmployeeDepartment = this.currentUserDetail.Department.Value;
    payload.TimesheetStartDate = this.weekStartDate;
    payload.TimesheetEndDate = this.weekEndDate;
    payload.StartDate = this.weekStartDate;
    payload.EndDate = this.weekEndDate;
    payload.BillableHours = this.totalBillableHrs();
    payload.NonBillableHours = this.totalNBillableHrs();
    payload.SubmittedStatus = isSave ? 'Not Submitted' : 'Submitted';
    payload.WeekNumber = moment(this.weekStartDate).week();
    payload.CalendarYear = moment(this.weekStartDate).format('YYYY');
    payload.ID = this.timesheetID;
    return payload;
  }

  totalBillableHrs() {
    var week = this.weekProjects;
    var bHrs = 0;
    var bMins = 0;
    for (var i = 0; i < week.MondayArray.length; i++) {
      bHrs += week.MondayArray[i].Mondayhrs ? parseInt(week.MondayArray[i].Mondayhrs.split(':')[0]) : 0;
      bHrs += week.TuesdayArray[i].Tuesdayhrs ? parseInt(week.TuesdayArray[i].Tuesdayhrs.split(':')[0]) : 0;
      bHrs += week.WednesdayArray[i].Wednesdayhrs ? parseInt(week.WednesdayArray[i].Wednesdayhrs.split(':')[0]) : 0;
      bHrs += week.ThursdayArray[i].Thursdayhrs ? parseInt(week.ThursdayArray[i].Thursdayhrs.split(':')[0]) : 0;
      bHrs += week.FridayArray[i].Fridayhrs ? parseInt(week.FridayArray[i].Fridayhrs.split(':')[0]) : 0;
      bHrs += week.SaturdayArray[i].Saturdayhrs ? parseInt(week.SaturdayArray[i].Saturdayhrs.split(':')[0]) : 0;
      bHrs += week.SundayArray[i].Sundayhrs ? parseInt(week.SundayArray[i].Sundayhrs.split(':')[0]) : 0;
      bMins += week.MondayArray[i].Mondayhrs ? parseInt(week.MondayArray[i].Mondayhrs.split(':')[1]) : 0;
      bMins += week.TuesdayArray[i].Tuesdayhrs ? parseInt(week.TuesdayArray[i].Tuesdayhrs.split(':')[1]) : 0;
      bMins += week.WednesdayArray[i].Wednesdayhrs ? parseInt(week.WednesdayArray[i].Wednesdayhrs.split(':')[1]) : 0;
      bMins += week.ThursdayArray[i].Thursdayhrs ? parseInt(week.ThursdayArray[i].Thursdayhrs.split(':')[1]) : 0;
      bMins += week.FridayArray[i].Fridayhrs ? parseInt(week.FridayArray[i].Fridayhrs.split(':')[1]) : 0;
      bMins += week.SaturdayArray[i].Saturdayhrs ? parseInt(week.SaturdayArray[i].Saturdayhrs.split(':')[1]) : 0;
      bMins += week.SundayArray[i].Sundayhrs ? parseInt(week.SundayArray[i].Sundayhrs.split(':')[1]) : 0;
    }
    bHrs += Math.round((bMins / 60));
    bMins = (bMins % 60);
    return (bHrs < 10 ? '0' + bHrs : bHrs) + ':' + (bMins < 10 ? '0' + bMins : bMins);
  }

  totalNBillableHrs() {
    var week = this.weekProjects;
    var nbHrs = 0;
    var nbMins = 0;
    for (var i = 0; i < week.MondayArray.length; i++) {
      nbHrs += week.MondayArray[i].Mondaynbhrs ? parseInt(week.MondayArray[i].Mondaynbhrs.split(':')[0]) : 0;
      nbHrs += week.TuesdayArray[i].Tuesdaynbhrs ? parseInt(week.TuesdayArray[i].Tuesdaynbhrs.split(':')[0]) : 0;
      nbHrs += week.WednesdayArray[i].Wednesdaynbhrs ? parseInt(week.WednesdayArray[i].Wednesdaynbhrs.split(':')[0]) : 0;
      nbHrs += week.ThursdayArray[i].Thursdaynbhrs ? parseInt(week.ThursdayArray[i].Thursdaynbhrs.split(':')[0]) : 0;
      nbHrs += week.FridayArray[i].Fridaynbhrs ? parseInt(week.FridayArray[i].Fridaynbhrs.split(':')[0]) : 0;
      nbHrs += week.SaturdayArray[i].Saturdaynbhrs ? parseInt(week.SaturdayArray[i].Saturdaynbhrs.split(':')[0]) : 0;
      nbHrs += week.SundayArray[i].Sundaynbhrs ? parseInt(week.SundayArray[i].Sundaynbhrs.split(':')[0]) : 0;
      nbMins += week.MondayArray[i].Mondaynbhrs ? parseInt(week.MondayArray[i].Mondaynbhrs.split(':')[1]) : 0;
      nbMins += week.TuesdayArray[i].Tuesdaynbhrs ? parseInt(week.TuesdayArray[i].Tuesdaynbhrs.split(':')[1]) : 0;
      nbMins += week.WednesdayArray[i].Wednesdaynbhrs ? parseInt(week.WednesdayArray[i].Wednesdaynbhrs.split(':')[1]) : 0;
      nbMins += week.ThursdayArray[i].Thursdaynbhrs ? parseInt(week.ThursdayArray[i].Thursdaynbhrs.split(':')[1]) : 0;
      nbMins += week.FridayArray[i].Fridaynbhrs ? parseInt(week.FridayArray[i].Fridaynbhrs.split(':')[1]) : 0;
      nbMins += week.SaturdayArray[i].Saturdaynbhrs ? parseInt(week.SaturdayArray[i].Saturdaynbhrs.split(':')[1]) : 0;
      nbMins += week.SundayArray[i].Sundaynbhrs ? parseInt(week.SundayArray[i].Sundaynbhrs.split(':')[1]) : 0;
    }
    nbHrs += Math.round((nbMins / 60));
    nbMins = (nbMins % 60);
    return (nbHrs < 10 ? '0' + nbHrs : nbHrs) + ':' + (nbMins < 10 ? '0' + nbMins : nbMins);
  }

  scrollIconCalculate() {
    this.isDayScrollable = [0, 0, 0, 0, 0, 0, 0];
    for (var index = 0; index < this.weekProjects.MondayArray.length; index++) {
      if (this.weekProjects.MondayArray[index].ProjectTimesheetStatus != 'Inactive') {
        this.weekProjects.MondayArray[index].Mondayhrs || this.weekProjects.MondayArray[index].Mondaynbhrs ? this.isDayScrollable[0]++ : null;
        this.weekProjects.TuesdayArray[index].Tuesdayhrs || this.weekProjects.TuesdayArray[index].Tuesdaynbhrs ? this.isDayScrollable[1]++ : null;
        this.weekProjects.WednesdayArray[index].Wednesdayhrs || this.weekProjects.WednesdayArray[index].Wednesdaynbhrs ? this.isDayScrollable[2]++ : null;
        this.weekProjects.ThursdayArray[index].Thursdayhrs || this.weekProjects.ThursdayArray[index].Thursdaynbhrs ? this.isDayScrollable[3]++ : null;
        this.weekProjects.FridayArray[index].Fridayhrs || this.weekProjects.FridayArray[index].Fridaynbhrs ? this.isDayScrollable[4]++ : null;
        this.weekProjects.SaturdayArray[index].Saturdayhrs || this.weekProjects.SaturdayArray[index].Saturdaynbhrs ? this.isDayScrollable[5]++ : null;
        this.weekProjects.SundayArray[index].Sundayhrs || this.weekProjects.SundayArray[index].Sundaynbhrs ? this.isDayScrollable[6]++ : null;
      }
    }
  }

  leaveTaskValidation() {
    /**
     * Handles multiple Leave/Absent records
     */
    let leave: any[] = []
      , unapproved: any[] = [];
    leave = this.weekProjects.MondayArray.filter((item, index) => {
      return ((item.Project.Value.indexOf('Leave') > -1) || (item.Project.Value.indexOf('Absent') > -1));
    });
    unapproved = leave.filter((item, index) => {
      return item.ProjectTimesheetStatus != 'Approved';
    });
    if (unapproved.length > 0) {
      this.isLeaveApproved = false;
      this.toastService.createToast('You can not submit timesheet until your leave is approved');
    } else
      this.isLeaveApproved = true;
    
    /**
     * Handles only 1 Leave/Absent record
     */
    // var leave = this.weekProjects.MondayArray.find((item, index) => {
    //   return ((item.Project.Value.indexOf('Leave') > -1) || (item.Project.Value.indexOf('Absent') > -1))
    // });

    // if (leave) {
    //   if (leave.ProjectTimesheetStatus != 'Approved') {
    //     this.isLeaveApproved = false;
    //     this.toastService.createToast('You can not submit timesheet until your leave is approved');
    //   }
    // } else
    //   this.isLeaveApproved = true;
  }

  // checkSubmitDateValid() {
  //   return moment().isSameOrAfter(moment(this.weekStartDate).add(4, 'days'));
  // }

}



/**
 * timesheet index => index of card
 * isSubmitted => false
 */