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
import { Timesheet,emptyTimesheetModel,weekArray,monday,tuesday,wednesday,thursday,friday,saturday,sunday } from '../models/timesheet.model';

import { TaskDetailPage } from '../task-detail/task-detail';

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
  emptyTimesheet: emptyTimesheetModel ;
  timesheetStatus: string = 'New';
  weekProjects:weekArray;

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
  getEmptyTimesheet()
  {
    for (var index = 0; index < 7; index++) {
      var empty:emptyTimesheetModel = new emptyTimesheetModel();
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
        this.projectList.push({ label: 'Select', value: null });
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

            }
            else{
              this.getEmptyTimesheet();
            }
            console.log(res);
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
      this.timesheetStatus = res.SubmittedStatus;
      this.setTotal(res);
      if (this.timesheetStatus !== 'Approved' && this.timesheetStatus !== 'Submitted') {
        for (let i = 0; i < this.timesheetList.length; i++) {
          let project = _.find(this.projectList, function (item) {
            return item.value !== null && item.value.ID === res.Timesheets[i].Project.ID;
          });
          this.timesheetList[i].Project = project.value;
          this.onProjectChange(project.value, i);
        }
      }
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
    this.timesheetList = [];
    this.cacheData = {};
    /** TODO: get timesheet acc to date selected for edit mode */
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.employeeTimesheetService.getCurrentEmpTimesheetByDate({ Date: this.showWeekStart }).subscribe(res => {
        this.timesheetModel = res;
         if(this.timesheetModel)
        {

        }
        else{
          this.getEmptyTimesheet();
        }
        // this.timesheetList = this.cacheData.Timesheets;
        console.log(res);
        loader.dismiss();
      });
    });
  }

  nextWeekClick() {
    this.weekStartDate = this.weekStartDate.add(1, 'w');
    this.weekEndDate = this.weekEndDate.add(1, 'w');
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
        if(this.timesheetModel)
        {

        }
        else{
          this.getEmptyTimesheet();
        }
        // this.timesheetList = this.cacheData.Timesheets;
        console.log(res);
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
    return moment(this.weekStartDate).isoWeekday(day);
  }
  saveClicked()
  {

  }
  submitClicked()
  {

  }

  /** Create Timesheet */

  initializeWeekprojects()
  {

  }

createTimesheetList()
{
  this.weekProjects = new weekArray();
  for (var index = 0; index < this.timesheetList.length; index++) {
    var project = this.timesheetList[index];
    if(project.Mondayhrs ||project.Mondaynbhrs )
    {
      var monproj:any = this.createMondayProject(project);
      this.weekProjects.MondayArray.push(monproj);
    }
    if(project.Tuesdayhrs ||project.Tuesdaynbhrs )
    {
      this.weekProjects.TuesdayArray.push(this.createTuesdayProject(project));
    }
    if(project.Wednesdayhrs ||project.Wednesdaynbhrs )
    {
      this.weekProjects.WednesdayArray.push(this.createWednesdayProject(project));
    }
    if(project.Thursdayhrs ||project.Thursdaynbhrs )
    {
      this.weekProjects.ThursdayArray.push(this.createThursdayProject(project));
    }
    if(project.Fridayhrs ||project.Fridaynbhrs )
    {
      this.weekProjects.FridayArray.push(this.createFridayProject(project));
    }
    if(project.Saturdayhrs ||project.Saturdaynbhrs )
    {
      this.weekProjects.SaturdayArray.push(this.createSaturdayProject(project));
    }
     if(project.Sundayhrs ||project.Sundaynbhrs )
    {
      this.weekProjects.SundayArray.push(this.createSundayProject(project));
    }
  }
  console.log('Week Data ===' + this.weekProjects);
}
createMondayProject(project:any)
{
  var mondayProject:monday = new monday();
  mondayProject.ApproverUser = project.ApproverUser;
  mondayProject.ApproverComment = project.ApproverComment;
  mondayProject.Billable = project.Billable;
  mondayProject.ID = project.ID;
  mondayProject.Mondaydesc = project.Mondaydesc;
  mondayProject.Mondaydescnb = project.Mondaydescnb;
  mondayProject.Mondayhrs = project.Mondayhrs;
  mondayProject.Mondaynbhrs = project.Mondaynbhrs;
  mondayProject.Project = project.Project;
  mondayProject.ProjectTimesheetStatus = project.ProjectTimesheetStatus;
  mondayProject.Task = project.Task;
  mondayProject.TimesheetID = project.TimesheetID;
  mondayProject.TotalhrsMonday = this.totalhours.TotalhrsMonday;
  return mondayProject;
}

createTuesdayProject(project:any)
{
  var tuesdayProject:tuesday = new tuesday();
  tuesdayProject.ApproverUser = project.ApproverUser;
  tuesdayProject.ApproverComment = project.ApproverComment;
  tuesdayProject.Billable = project.Billable;
  tuesdayProject.ID = project.ID;
  tuesdayProject.Tuesdaydesc = project.Tuesdaydesc;
  tuesdayProject.Tuesdaydescnb = project.Tuesdaydescnb;
  tuesdayProject.Tuesdayhrs = project.Tuesdayhrs;
  tuesdayProject.Tuesdaynbhrs = project.Tuesdaynbhrs;
  tuesdayProject.Project = project.Project;
  tuesdayProject.ProjectTimesheetStatus = project.ProjectTimesheetStatus;
  tuesdayProject.Task = project.Task;
  tuesdayProject.TimesheetID = project.TimesheetID;
  tuesdayProject.TotalhrsTuesday = this.totalhours.TotalhrsTuesday;
  return tuesdayProject;
}

createWednesdayProject(project:any)
{
  var wednesdayProject:wednesday = new wednesday();
  wednesdayProject.ApproverUser = project.ApproverUser;
  wednesdayProject.ApproverComment = project.ApproverComment;
  wednesdayProject.Billable = project.Billable;
  wednesdayProject.ID = project.ID;
  wednesdayProject.Wednesdaydesc = project.Wednesdaydesc;
  wednesdayProject.Wednesdaydescnb = project.Wednesdaydescnb;
  wednesdayProject.Wednesdayhrs = project.Wednesdayhrs;
  wednesdayProject.Wednesdaynbhrs = project.Wednesdaynbhrs;
  wednesdayProject.Project = project.Project;
  wednesdayProject.ProjectTimesheetStatus = project.ProjectTimesheetStatus;
  wednesdayProject.Task = project.Task;
  wednesdayProject.TimesheetID = project.TimesheetID;
  wednesdayProject.TotalhrsWednesday = this.totalhours.TotalhrsWednesday;
  return wednesdayProject;
}

createThursdayProject(project:any)
{
  var thursdayProject:thursday = new thursday();
  thursdayProject.ApproverUser = project.ApproverUser;
  thursdayProject.ApproverComment = project.ApproverComment;
  thursdayProject.Billable = project.Billable;
  thursdayProject.ID = project.ID;
  thursdayProject.Thursdaydesc = project.Thursdaydesc;
  thursdayProject.Thursdaydescnb = project.Thursdaydescnb;
  thursdayProject.Thursdayhrs = project.Thursdayhrs;
  thursdayProject.Thursdaynbhrs = project.Thursdaynbhrs;
  thursdayProject.Project = project.Project;
  thursdayProject.ProjectTimesheetStatus = project.ProjectTimesheetStatus;
  thursdayProject.Task = project.Task;
  thursdayProject.TimesheetID = project.TimesheetID;
  thursdayProject.TotalhrsThursday = this.totalhours.TotalhrsThursday;
  return thursdayProject;
}

createFridayProject(project:any)
{
  var fridayProject:friday = new friday();
  fridayProject.ApproverUser = project.ApproverUser;
  fridayProject.ApproverComment = project.ApproverComment;
  fridayProject.Billable = project.Billable;
  fridayProject.ID = project.ID;
  fridayProject.Fridaydesc = project.Fridaydesc;
  fridayProject.Fridaydescnb = project.Fridaydescnb;
  fridayProject.Fridayhrs = project.Fridayhrs;
  fridayProject.Fridaynbhrs = project.Fridaynbhrs;
  fridayProject.Project = project.Project;
  fridayProject.ProjectTimesheetStatus = project.ProjectTimesheetStatus;
  fridayProject.Task = project.Task;
  fridayProject.TimesheetID = project.TimesheetID;
  fridayProject.TotalhrsFriday = this.totalhours.TotalhrsFriday;
  return fridayProject;
}
createSaturdayProject(project:any)
{
  var saturdayProject:saturday = new saturday();
  saturdayProject.ApproverUser = project.ApproverUser;
  saturdayProject.ApproverComment = project.ApproverComment;
  saturdayProject.Billable = project.Billable;
  saturdayProject.ID = project.ID;
  saturdayProject.Saturdaydesc = project.Saturdaydesc;
  saturdayProject.Saturdaydescnb = project.Saturdaydescnb;
  saturdayProject.Saturdayhrs = project.Saturdayhrs;
  saturdayProject.Saturdaynbhrs = project.Saturdaynbhrs;
  saturdayProject.Project = project.Project;
  saturdayProject.ProjectTimesheetStatus = project.ProjectTimesheetStatus;
  saturdayProject.Task = project.Task;
  saturdayProject.TimesheetID = project.TimesheetID;
  saturdayProject.TotalhrsSaturday = this.totalhours.TotalhrsSaturday;
  return saturdayProject;
}
createSundayProject(project:any)
{
  var sundayProject:sunday = new sunday();
  sundayProject.ApproverUser = project.ApproverUser;
  sundayProject.ApproverComment = project.ApproverComment;
  sundayProject.Billable = project.Billable;
  sundayProject.ID = project.ID;
  sundayProject.Sundaydesc = project.Sundaydesc;
  sundayProject.Sundaydescnb = project.Sundaydescnb;
  sundayProject.Sundayhrs = project.Sundayhrs;
  sundayProject.Sundaynbhrs = project.Sundaynbhrs;
  sundayProject.Project = project.Project;
  sundayProject.ProjectTimesheetStatus = project.ProjectTimesheetStatus;
  sundayProject.Task = project.Task;
  sundayProject.TimesheetID = project.TimesheetID;
  sundayProject.TotalhrsSunday = this.totalhours.TotalhrsSunday;
  return sundayProject;
}

}



/**
 * timesheet index => index of card
 * isSubmitted => false
 */