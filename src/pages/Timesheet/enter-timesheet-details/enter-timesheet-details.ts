import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Timesheet, emptyTimesheetModel, weekArray, monday, tuesday, wednesday, thursday, friday, saturday, sunday } from '../models/timesheet.model';
import { PhasesService, ProjectService, TimesheetService, EmployeeTimesheetService } from '../index';
import { Slides } from 'ionic-angular';
import * as moment from 'moment'
import * as _ from 'lodash/index';
/*
  Generated class for the EnterTimesheetDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-enter-timesheet-details',
  templateUrl: 'enter-timesheet-details.html',
  providers: [PhasesService]
})
export class EnterTimesheetDetailsPage {

  @ViewChild('mySlider') slides: Slides;
  @ViewChild(Content) content: Content;
  weekProjects: weekArray;
  selectedIndex: number = 0;
  timesheetStatus: string = 'New';
  weekStartDate: any;
  dateTitle: any;
  Day1Form: FormGroup;
  projectList: any[];
  tasksList: Array<any[]>;
  simpleColumns: any[];
  timesheetDetails: any;
  timesheetList: any[];
  totalhours: any;
  dailyTotalhours: any[] = [];
  deletedTaskIndex: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public phasesService: PhasesService) {
    this.timesheetList = [];
    this.weekProjects = this.navParams.get('data');
    this.selectedIndex = this.navParams.get('index');
    this.weekStartDate = this.navParams.get('weekstart');
    this.projectList = this.navParams.get('myProjects');
    //this.cleanseProjectList();

    this.timesheetStatus = this.navParams.get('tStatus');
    this.timesheetDetails = this.navParams.get('timesheetData');
    this.timesheetList = this.navParams.get('timesheetList');
    this.totalhours = this.navParams.get('totalhours');
    this.calcDailyHours();
    if (this.timesheetList.length == 0)
      this.pushTimeSheet();

    this.tasksList = [];

    this.dateTitle = this.getDate(0);
    if (!(this.timesheetStatus == 'Approved' || this.timesheetStatus == 'Submitted' || this.timesheetStatus == 'Rejected')) {
      this.getTask();
    }
    this.Day1Form = fb.group({
      'clientname': [null, Validators.required],
    });


  }

  cleanseProjectList() {
    for (var i = 0; i < this.projectList.length; i++) {
      if (this.projectList[i].label === 'Holiday') {
        this.projectList.splice(i, 1);
      }
    }
    for (var i = 0; i < this.projectList.length; i++) {
      if (this.projectList[i].label === 'Leave') {
        this.projectList.splice(i, 1);
      }
    }
  }

  ionViewDidEnter() {

    this.goToSlide();
  }

  pushTimeSheet() {
    let time = new Timesheet();
    this.timesheetList.push(time);
  }

  ionViewWillLeave() {
    if (this.timesheetStatus != 'Approved' && this.timesheetStatus != 'Submitted' && this.timesheetStatus != 'Rejected') {
      this.cleanTimesheet();
      this.SaveData();
    }

  }

  saveClicked() {
    console.log('popping timesheetList => ', this.timesheetList);
    this.navCtrl.pop();
  }

  slideChanged() {
    this.selectedIndex = this.slides.getActiveIndex();
    this.dateTitle = this.getDate(this.selectedIndex);
  }
  goToSlide() {
    this.slides.slideTo(this.selectedIndex, 300);
    this.dateTitle = this.getDate(this.selectedIndex);
  }

  /** Get Dates */

  getDate(day: number) {
    return moment(this.weekStartDate).add(day, 'days').format('ddd DD MMM');
  }

  addClicked() {
    if (this.checkProjectAndTask() == false)
      return;

    this.weekProjects.MondayArray.push(this.createMondayProject(null));
    this.weekProjects.TuesdayArray.push(this.createTuesdayProject(null));
    this.weekProjects.WednesdayArray.push(this.createWednesdayProject(null));
    this.weekProjects.ThursdayArray.push(this.createThursdayProject(null));
    this.weekProjects.FridayArray.push(this.createFridayProject(null));
    this.weekProjects.SaturdayArray.push(this.createSaturdayProject(null));
    this.weekProjects.SundayArray.push(this.createSundayProject(null));
    this.pushTimeSheet();

    /**
     * scroll to the new task added
     */
    setTimeout(() => {
      var id = this.weekProjects.MondayArray.length - 1;
      let yOffset = document.getElementById(id.toString()).offsetTop;
      this.content.scrollTo(0, yOffset, 250);
    }, 1000);
  }

  getTask() {
    if (this.weekProjects.MondayArray[0].Project.Value.length > 0) {
      for (var index = 0; index < this.weekProjects.MondayArray.length; index++) {
        this.onProjectChange(this.weekProjects.MondayArray[index].Project.Value, index, 'Monday');
      }
    }
  }

  onProjectChange(selectedProjectname: string, index: number, day: string) {
    var selectedProject: any = this.getSelectedProject(selectedProjectname);
    this.setApproverUser(day, index, selectedProject);
    // this.isError = false;
    this.tasksList[index] = [];
    // this.timesheetList[index].ApproverUser = {};
    // this.timesheetList[index].ApproverUser.Value = selectedProject.AccountManager.Name;
    // this.timesheetList[index].ApproverUser.ID = selectedProject.AccountManager.ID;


    this.phasesService.getPhasesByProject(selectedProject).subscribe((res: any) => {
      // this.tasksList[index].push({ label: 'Select', value: null });
      for (var i in res) {
        this.tasksList[index].push({ label: res[i].PhaseName, value: res[i].PhaseName });
      }
    });
  }

  onTaskChange(selectedProjecttask: string, index: number, day: string) {
    this.setTimesheetTask(day, index, selectedProjecttask);
  }

  setTimesheetTask(day: string, index: number, selectedProjectTask: string) {
    this.weekProjects.MondayArray[index].Task = selectedProjectTask;
    this.weekProjects.TuesdayArray[index].Task = selectedProjectTask;
    this.weekProjects.WednesdayArray[index].Task = selectedProjectTask;
    this.weekProjects.ThursdayArray[index].Task = selectedProjectTask;
    this.weekProjects.FridayArray[index].Task = selectedProjectTask;
    this.weekProjects.SaturdayArray[index].Task = selectedProjectTask;
    this.weekProjects.SundayArray[index].Task = selectedProjectTask;


  }
  setApproverUser(day: string, index: number, selectedProject: any) {

    this.weekProjects.MondayArray[index].Project.Value = selectedProject.Title;
    this.weekProjects.MondayArray[index].Project.ID = selectedProject.ID;
    this.weekProjects.MondayArray[index].ApproverUser.Value = selectedProject.AccountManager.Name;
    this.weekProjects.MondayArray[index].ApproverUser.ID = selectedProject.AccountManager.ID;

    this.weekProjects.TuesdayArray[index].Project.Value = selectedProject.Title;
    this.weekProjects.TuesdayArray[index].Project.ID = selectedProject.ID;
    this.weekProjects.TuesdayArray[index].ApproverUser.Value = selectedProject.AccountManager.Name;
    this.weekProjects.TuesdayArray[index].ApproverUser.ID = selectedProject.AccountManager.ID;

    this.weekProjects.WednesdayArray[index].Project.Value = selectedProject.Title;
    this.weekProjects.WednesdayArray[index].Project.ID = selectedProject.ID;
    this.weekProjects.WednesdayArray[index].ApproverUser.Value = selectedProject.AccountManager.Name;
    this.weekProjects.WednesdayArray[index].ApproverUser.ID = selectedProject.AccountManager.ID;

    this.weekProjects.ThursdayArray[index].Project.Value = selectedProject.Title;
    this.weekProjects.ThursdayArray[index].Project.ID = selectedProject.ID;
    this.weekProjects.ThursdayArray[index].ApproverUser.Value = selectedProject.AccountManager.Name;
    this.weekProjects.ThursdayArray[index].ApproverUser.ID = selectedProject.AccountManager.ID;

    this.weekProjects.FridayArray[index].Project.Value = selectedProject.Title;
    this.weekProjects.FridayArray[index].Project.ID = selectedProject.ID;
    this.weekProjects.FridayArray[index].ApproverUser.Value = selectedProject.AccountManager.Name;
    this.weekProjects.FridayArray[index].ApproverUser.ID = selectedProject.AccountManager.ID;

    this.weekProjects.SaturdayArray[index].Project.Value = selectedProject.Title;
    this.weekProjects.SaturdayArray[index].Project.ID = selectedProject.ID;
    this.weekProjects.SaturdayArray[index].ApproverUser.Value = selectedProject.AccountManager.Name;
    this.weekProjects.SaturdayArray[index].ApproverUser.ID = selectedProject.AccountManager.ID;


    this.weekProjects.SundayArray[index].Project.Value = selectedProject.Title;
    this.weekProjects.SundayArray[index].Project.ID = selectedProject.ID;
    this.weekProjects.SundayArray[index].ApproverUser.Value = selectedProject.AccountManager.Name;
    this.weekProjects.SundayArray[index].ApproverUser.ID = selectedProject.AccountManager.ID;

  }

  getSelectedProject(selectedProjectname: string) {
    var selectedProject: any;

    this.projectList.forEach(element => {
      if (selectedProjectname == element.label) {
        selectedProject = element.value;
      }
    });
    return selectedProject;
  }
  checkSelectedProjectBillable(selectedProjectname: string) {
    var selectedProject: any;
    var isbillable: boolean = false;

    this.projectList.forEach(element => {
      if (selectedProjectname == element.label) {
        selectedProject = element.value;
        if (selectedProject.BillableNonBillable == 'Billable')
          isbillable = true;
        else
          isbillable = false;
      }
    });

    return isbillable;
  }

  getIndexOfSelectedProject(selectedProjectname: string) {
    var pindex: number = 0;
    for (var index = 0; index < this.projectList.length; index++) {
      var element = this.projectList[index];
      if (selectedProjectname == element.label) {
        pindex = index;
        return pindex;
      }
    }
    return pindex;
  }

  cleanTimesheet() {
    // var flag0,flag1,flag2,flag3,flag4,flag5,flag6 = false;
    let idxSplice: number[] = [];
    let idxKeep: number[] = [];
    for (var index = 0; index < this.weekProjects.MondayArray.length; index++) {
      if (this.deletedTaskIndex == index)
        continue;
      var flag0, flag1, flag2, flag3, flag4, flag5, flag6 = false;
      if (((this.weekProjects.MondayArray[index].Mondaynbhrs == '00:00' || !this.weekProjects.MondayArray[index].Mondaynbhrs) && !this.weekProjects.MondayArray[index].Mondaydesc.trim()) && ((this.weekProjects.MondayArray[index].Mondayhrs == '00:00' || !this.weekProjects.MondayArray[index].Mondayhrs) && !this.weekProjects.MondayArray[index].Mondaydescnb.trim())) {
        flag0 = true;
      } else {
        idxKeep.push(index); flag0 = false;
      } if (((this.weekProjects.TuesdayArray[index].Tuesdaynbhrs == '00:00' || !this.weekProjects.TuesdayArray[index].Tuesdaynbhrs) && !this.weekProjects.TuesdayArray[index].Tuesdaydesc.trim()) && ((this.weekProjects.TuesdayArray[index].Tuesdayhrs == '00:00' || !this.weekProjects.TuesdayArray[index].Tuesdayhrs) && !this.weekProjects.TuesdayArray[index].Tuesdaydescnb.trim())) {
        flag1 = true;
      } else {
        idxKeep.push(index); flag1 = false;
      } if (((this.weekProjects.WednesdayArray[index].Wednesdaynbhrs == '00:00' || !this.weekProjects.WednesdayArray[index].Wednesdaynbhrs) && !this.weekProjects.WednesdayArray[index].Wednesdaydesc.trim()) && ((this.weekProjects.WednesdayArray[index].Wednesdayhrs == '00:00' || !this.weekProjects.WednesdayArray[index].Wednesdayhrs) && !this.weekProjects.WednesdayArray[index].Wednesdaydescnb.trim())) {
        flag2 = true;
      } else {
        idxKeep.push(index); flag2 = false;
      } if (((this.weekProjects.ThursdayArray[index].Thursdaynbhrs == '00:00' || !this.weekProjects.ThursdayArray[index].Thursdaynbhrs) && !this.weekProjects.ThursdayArray[index].Thursdaydesc.trim()) && ((this.weekProjects.ThursdayArray[index].Thursdayhrs == '00:00' || !this.weekProjects.ThursdayArray[index].Thursdayhrs) && !this.weekProjects.ThursdayArray[index].Thursdaydescnb.trim())) {
        flag3 = true;
      } else {
        idxKeep.push(index); flag3 = false;
      } if (((this.weekProjects.FridayArray[index].Fridaynbhrs == '00:00' || !this.weekProjects.FridayArray[index].Fridaynbhrs) && !this.weekProjects.FridayArray[index].Fridaydesc.trim()) && ((this.weekProjects.FridayArray[index].Fridayhrs == '00:00' || !this.weekProjects.FridayArray[index].Fridayhrs) && !this.weekProjects.FridayArray[index].Fridaydescnb.trim())) {
        flag4 = true;
      } else {
        idxKeep.push(index); flag4 = false;
      } if (((this.weekProjects.SaturdayArray[index].Saturdaynbhrs == '00:00' || !this.weekProjects.SaturdayArray[index].Saturdaynbhrs) && !this.weekProjects.SaturdayArray[index].Saturdaydesc.trim()) && ((this.weekProjects.SaturdayArray[index].Saturdayhrs == '00:00' || !this.weekProjects.SaturdayArray[index].Saturdayhrs) && !this.weekProjects.SaturdayArray[index].Saturdaydescnb.trim())) {
        flag5 = true;
      } else {
        idxKeep.push(index); flag5 = false;
      } if (((this.weekProjects.SundayArray[index].Sundaynbhrs == '00:00' || !this.weekProjects.SundayArray[index].Sundaynbhrs) && !this.weekProjects.SundayArray[index].Sundaydesc.trim()) && ((this.weekProjects.SundayArray[index].Sundayhrs == '00:00' || !this.weekProjects.SundayArray[index].Sundayhrs) && !this.weekProjects.SundayArray[index].Sundaydescnb.trim())) {
        flag6 = true;
      } else {
        idxKeep.push(index); flag6 = false;
      } if (flag0 && flag1 && flag2 && flag3 && flag4 && flag5 && flag6) idxSplice.push(index);
    }
    idxSplice.forEach(element => {
      this.weekProjects.MondayArray.splice(element, 1);
      this.weekProjects.TuesdayArray.splice(element, 1);
      this.weekProjects.WednesdayArray.splice(element, 1);
      this.weekProjects.ThursdayArray.splice(element, 1);
      this.weekProjects.FridayArray.splice(element, 1);
      this.weekProjects.SaturdayArray.splice(element, 1);
      this.weekProjects.SundayArray.splice(element, 1);
      this.timesheetList.splice(element);
    });
    console.log('after splicing','weekProjects =>', this.weekProjects, 'timesheetList =>', this.timesheetList);

    if (this.weekProjects.MondayArray.length == 0) {
      this.weekProjects.MondayArray.push(this.createMondayProject(null));
      this.weekProjects.TuesdayArray.push(this.createTuesdayProject(null));
      this.weekProjects.WednesdayArray.push(this.createWednesdayProject(null));
      this.weekProjects.ThursdayArray.push(this.createThursdayProject(null));
      this.weekProjects.FridayArray.push(this.createFridayProject(null));
      this.weekProjects.SaturdayArray.push(this.createSaturdayProject(null));
      this.weekProjects.SundayArray.push(this.createSundayProject(null));
      this.pushTimeSheet();
    }
    console.log('leaving cleanTimesheet','weekProjects =>', this.weekProjects, 'timesheetList =>', this.timesheetList);
  }

  SaveData() {
    for (var index = 0; index < this.weekProjects.MondayArray.length; index++) {
      if (this.deletedTaskIndex == index)
        continue;

      this.timesheetList[index].ApproverUser = this.weekProjects.MondayArray[index].ApproverUser;
      this.timesheetList[index].Project = this.weekProjects.MondayArray[index].Project;
      this.timesheetList[index].Task = this.weekProjects.MondayArray[index].Task;
      this.timesheetList[index].Mondayhrs = this.weekProjects.MondayArray[index].Mondayhrs;
      this.timesheetList[index].Mondaydesc = this.weekProjects.MondayArray[index].Mondaydesc;
      this.timesheetList[index].Mondaydesc = this.weekProjects.MondayArray[index].Mondaydesc;
      this.timesheetList[index].Mondaynbhrs = this.weekProjects.MondayArray[index].Mondaynbhrs;
      this.timesheetList[index].Mondaydescnb = this.weekProjects.MondayArray[index].Mondaydescnb;
      this.timesheetList[index].ApproverComment = this.weekProjects.MondayArray[index].ApproverComment;
      this.timesheetList[index].ProjectTimesheetStatus = this.weekProjects.MondayArray[index].ProjectTimesheetStatus;
      this.timesheetList[index].Billable = this.weekProjects.MondayArray[index].Billable;
      this.timesheetList[index].TimesheetID = this.weekProjects.MondayArray[index].TimesheetID;
      this.timesheetList[index].UpdationFlag = this.weekProjects.MondayArray[index].UpdationFlag;
      this.timesheetList[index].ID = this.weekProjects.MondayArray[index].ID;

      // this.timesheetList[index].TotalhrsMonday = this.weekProjects.MondayArray[index].TotalhrsMonday;
    }

    // for (var index = 0; index < this.weekProjects.TuesdayArray.length; index++) {
    //   this.timesheetList[index].ApproverUser = this.weekProjects.TuesdayArray[index].ApproverUser;
    //   this.timesheetList[index].Project = this.weekProjects.TuesdayArray[index].Project;
    //   this.timesheetList[index].Task = this.weekProjects.TuesdayArray[index].Task;
    //   this.timesheetList[index].Tuesdayhrs = this.weekProjects.TuesdayArray[index].Tuesdayhrs;
    //   this.timesheetList[index].Tuesdaydesc = this.weekProjects.TuesdayArray[index].Tuesdaydesc;
    //   this.timesheetList[index].Tuesdaydesc = this.weekProjects.TuesdayArray[index].Tuesdaydesc;
    //   this.timesheetList[index].Tuesdaynbhrs = this.weekProjects.TuesdayArray[index].Tuesdaynbhrs;
    //   this.timesheetList[index].Tuesdaydescnb = this.weekProjects.TuesdayArray[index].Tuesdaydescnb;
    //   this.timesheetList[index].ApproverComment = this.weekProjects.TuesdayArray[index].ApproverComment;
    //   this.timesheetList[index].ProjectTimesheetStatus = this.weekProjects.TuesdayArray[index].ProjectTimesheetStatus;
    //   this.timesheetList[index].Billable = this.weekProjects.TuesdayArray[index].Billable;
    //   this.timesheetList[index].TimesheetID = this.weekProjects.TuesdayArray[index].TimesheetID;
    //   this.timesheetList[index].UpdationFlag = this.weekProjects.TuesdayArray[index].UpdationFlag;
    //   this.timesheetList[index].ID = this.weekProjects.TuesdayArray[index].ID;
    //   // this.timesheetList[index].TotalhrsMonday = this.weekProjects.TuesdayArray[index].TotalhrsTuesday;
    // }

    for (var index = 0; index < this.weekProjects.TuesdayArray.length; index++) {
      if (this.deletedTaskIndex == index)
        continue;
      this.timesheetList[index].ApproverUser = this.weekProjects.TuesdayArray[index].ApproverUser;
      this.timesheetList[index].Project = this.weekProjects.TuesdayArray[index].Project;
      this.timesheetList[index].Task = this.weekProjects.TuesdayArray[index].Task;
      this.timesheetList[index].Tuesdayhrs = this.weekProjects.TuesdayArray[index].Tuesdayhrs;
      this.timesheetList[index].Tuesdaydesc = this.weekProjects.TuesdayArray[index].Tuesdaydesc;
      this.timesheetList[index].Tuesdaydesc = this.weekProjects.TuesdayArray[index].Tuesdaydesc;
      this.timesheetList[index].Tuesdaynbhrs = this.weekProjects.TuesdayArray[index].Tuesdaynbhrs;
      this.timesheetList[index].Tuesdaydescnb = this.weekProjects.TuesdayArray[index].Tuesdaydescnb;
      this.timesheetList[index].ApproverComment = this.weekProjects.TuesdayArray[index].ApproverComment;
      this.timesheetList[index].ProjectTimesheetStatus = this.weekProjects.TuesdayArray[index].ProjectTimesheetStatus;
      this.timesheetList[index].Billable = this.weekProjects.TuesdayArray[index].Billable;
      this.timesheetList[index].TimesheetID = this.weekProjects.TuesdayArray[index].TimesheetID;
      this.timesheetList[index].UpdationFlag = this.weekProjects.TuesdayArray[index].UpdationFlag;
      this.timesheetList[index].ID = this.weekProjects.TuesdayArray[index].ID;
      // this.timesheetList[index].TotalhrsTuesday = this.weekProjects.TuesdayArray[index].TotalhrsTuesday;
    }

    for (var index = 0; index < this.weekProjects.WednesdayArray.length; index++) {
      if (this.deletedTaskIndex == index)
        continue;
      this.timesheetList[index].ApproverUser = this.weekProjects.WednesdayArray[index].ApproverUser;
      this.timesheetList[index].Project = this.weekProjects.WednesdayArray[index].Project;
      this.timesheetList[index].Task = this.weekProjects.WednesdayArray[index].Task;
      this.timesheetList[index].Wednesdayhrs = this.weekProjects.WednesdayArray[index].Wednesdayhrs;
      this.timesheetList[index].Wednesdaydesc = this.weekProjects.WednesdayArray[index].Wednesdaydesc;
      this.timesheetList[index].Wednesdaydesc = this.weekProjects.WednesdayArray[index].Wednesdaydesc;
      this.timesheetList[index].Wednesdaynbhrs = this.weekProjects.WednesdayArray[index].Wednesdaynbhrs;
      this.timesheetList[index].Wednesdaydescnb = this.weekProjects.WednesdayArray[index].Wednesdaydescnb;
      this.timesheetList[index].ApproverComment = this.weekProjects.WednesdayArray[index].ApproverComment;
      this.timesheetList[index].ProjectTimesheetStatus = this.weekProjects.WednesdayArray[index].ProjectTimesheetStatus;
      this.timesheetList[index].Billable = this.weekProjects.WednesdayArray[index].Billable;
      this.timesheetList[index].TimesheetID = this.weekProjects.WednesdayArray[index].TimesheetID;
      this.timesheetList[index].UpdationFlag = this.weekProjects.WednesdayArray[index].UpdationFlag;
      this.timesheetList[index].ID = this.weekProjects.WednesdayArray[index].ID;
      // this.timesheetList[index].TotalhrsWednesday = this.weekProjects.WednesdayArray[index].TotalhrsWednesday;
    }

    for (var index = 0; index < this.weekProjects.ThursdayArray.length; index++) {
      if (this.deletedTaskIndex == index)
        continue;
      this.timesheetList[index].ApproverUser = this.weekProjects.ThursdayArray[index].ApproverUser;
      this.timesheetList[index].Project = this.weekProjects.ThursdayArray[index].Project;
      this.timesheetList[index].Task = this.weekProjects.ThursdayArray[index].Task;
      this.timesheetList[index].Thursdayhrs = this.weekProjects.ThursdayArray[index].Thursdayhrs;
      this.timesheetList[index].Thursdaydesc = this.weekProjects.ThursdayArray[index].Thursdaydesc;
      this.timesheetList[index].Thursdaydesc = this.weekProjects.ThursdayArray[index].Thursdaydesc;
      this.timesheetList[index].Thursdaynbhrs = this.weekProjects.ThursdayArray[index].Thursdaynbhrs;
      this.timesheetList[index].Thursdaydescnb = this.weekProjects.ThursdayArray[index].Thursdaydescnb;
      this.timesheetList[index].ApproverComment = this.weekProjects.ThursdayArray[index].ApproverComment;
      this.timesheetList[index].ProjectTimesheetStatus = this.weekProjects.ThursdayArray[index].ProjectTimesheetStatus;
      this.timesheetList[index].Billable = this.weekProjects.ThursdayArray[index].Billable;
      this.timesheetList[index].TimesheetID = this.weekProjects.ThursdayArray[index].TimesheetID;
      this.timesheetList[index].UpdationFlag = this.weekProjects.ThursdayArray[index].UpdationFlag;
      this.timesheetList[index].ID = this.weekProjects.ThursdayArray[index].ID;
      // this.timesheetList[index].TotalhrsThursday = this.weekProjects.ThursdayArray[index].TotalhrsThursday;
    }

    for (var index = 0; index < this.weekProjects.FridayArray.length; index++) {
      if (this.deletedTaskIndex == index)
        continue;
      this.timesheetList[index].ApproverUser = this.weekProjects.FridayArray[index].ApproverUser;
      this.timesheetList[index].Project = this.weekProjects.FridayArray[index].Project;
      this.timesheetList[index].Task = this.weekProjects.FridayArray[index].Task;
      this.timesheetList[index].Fridayhrs = this.weekProjects.FridayArray[index].Fridayhrs;
      this.timesheetList[index].Fridaydesc = this.weekProjects.FridayArray[index].Fridaydesc;
      this.timesheetList[index].Fridaydesc = this.weekProjects.FridayArray[index].Fridaydesc;
      this.timesheetList[index].Fridaynbhrs = this.weekProjects.FridayArray[index].Fridaynbhrs;
      this.timesheetList[index].Fridaydescnb = this.weekProjects.FridayArray[index].Fridaydescnb;
      this.timesheetList[index].ApproverComment = this.weekProjects.FridayArray[index].ApproverComment;
      this.timesheetList[index].ProjectTimesheetStatus = this.weekProjects.FridayArray[index].ProjectTimesheetStatus;
      this.timesheetList[index].Billable = this.weekProjects.FridayArray[index].Billable;
      this.timesheetList[index].TimesheetID = this.weekProjects.FridayArray[index].TimesheetID;
      this.timesheetList[index].UpdationFlag = this.weekProjects.FridayArray[index].UpdationFlag;
      this.timesheetList[index].ID = this.weekProjects.FridayArray[index].ID;
      // this.timesheetList[index].TotalhrsFriday = this.weekProjects.FridayArray[index].TotalhrsFriday;
    }

    for (var index = 0; index < this.weekProjects.SaturdayArray.length; index++) {
      if (this.deletedTaskIndex == index)
        continue;
      this.timesheetList[index].ApproverUser = this.weekProjects.SaturdayArray[index].ApproverUser;
      this.timesheetList[index].Project = this.weekProjects.SaturdayArray[index].Project;
      this.timesheetList[index].Task = this.weekProjects.SaturdayArray[index].Task;
      this.timesheetList[index].Saturdayhrs = this.weekProjects.SaturdayArray[index].Saturdayhrs;
      this.timesheetList[index].Saturdaydesc = this.weekProjects.SaturdayArray[index].Saturdaydesc;
      this.timesheetList[index].Saturdaydesc = this.weekProjects.SaturdayArray[index].Saturdaydesc;
      this.timesheetList[index].Saturdaynbhrs = this.weekProjects.SaturdayArray[index].Saturdaynbhrs;
      this.timesheetList[index].Saturdaydescnb = this.weekProjects.SaturdayArray[index].Saturdaydescnb;
      this.timesheetList[index].ApproverComment = this.weekProjects.SaturdayArray[index].ApproverComment;
      this.timesheetList[index].ProjectTimesheetStatus = this.weekProjects.SaturdayArray[index].ProjectTimesheetStatus;
      this.timesheetList[index].Billable = this.weekProjects.SaturdayArray[index].Billable;
      this.timesheetList[index].TimesheetID = this.weekProjects.SaturdayArray[index].TimesheetID;
      this.timesheetList[index].UpdationFlag = this.weekProjects.SaturdayArray[index].UpdationFlag;
      this.timesheetList[index].ID = this.weekProjects.SaturdayArray[index].ID;
      // this.timesheetList[index].TotalhrsSaturday = this.weekProjects.SaturdayArray[index].TotalhrsSaturday;
    }

    for (var index = 0; index < this.weekProjects.SundayArray.length; index++) {
      if (this.deletedTaskIndex == index)
        continue;
      this.timesheetList[index].ApproverUser = this.weekProjects.SundayArray[index].ApproverUser;
      this.timesheetList[index].Project = this.weekProjects.SundayArray[index].Project;
      this.timesheetList[index].Task = this.weekProjects.SundayArray[index].Task;
      this.timesheetList[index].Sundayhrs = this.weekProjects.SundayArray[index].Sundayhrs;
      this.timesheetList[index].Sundaydesc = this.weekProjects.SundayArray[index].Sundaydesc;
      this.timesheetList[index].Sundaydesc = this.weekProjects.SundayArray[index].Sundaydesc;
      this.timesheetList[index].Sundaynbhrs = this.weekProjects.SundayArray[index].Sundaynbhrs;
      this.timesheetList[index].Sundaydescnb = this.weekProjects.SundayArray[index].Sundaydescnb;
      this.timesheetList[index].ApproverComment = this.weekProjects.SundayArray[index].ApproverComment;
      this.timesheetList[index].ProjectTimesheetStatus = this.weekProjects.SundayArray[index].ProjectTimesheetStatus;
      this.timesheetList[index].Billable = this.weekProjects.SundayArray[index].Billable;
      this.timesheetList[index].TimesheetID = this.weekProjects.SundayArray[index].TimesheetID;
      this.timesheetList[index].UpdationFlag = this.weekProjects.SundayArray[index].UpdationFlag;
      this.timesheetList[index].ID = this.weekProjects.SundayArray[index].ID;
      // this.timesheetList[index].TotalhrsSunday = this.weekProjects.SundayArray[index].TotalhrsSunday;
    }
    // console.log(' popping this.timesheetList => ', this.timesheetList);
    console.log("timesheetlist => ", this.timesheetList[this.deletedTaskIndex]);
    this.calculateTotalHrs();


  }

  initTotalHour() {
    this.totalhours.TotalhrsMonday = 0;
    this.totalhours.TotalhrsTuesday = 0;
    this.totalhours.TotalhrsWednesday = 0;
    this.totalhours.TotalhrsThursday = 0;
    this.totalhours.TotalhrsFriday = 0;
    this.totalhours.TotalhrsSaturday = 0;
    this.totalhours.TotalhrsSunday = 0;
    this.totalhours.TotalhrsTimesheet = 0;
  }


  calculateTotalHrs() {
    this.initTotalHour();
    var totalh: number = 0;
    var totalm: number = 0;
    var tMin: number = 0;
    for (let i = 0; i < this.timesheetList.length; i++) {
      if (this.timesheetList[i].Mondaynbhrs && this.timesheetList[i].Mondaynbhrs !== null && this.timesheetList[i].Mondaynbhrs.length > 0 && this.deletedTaskIndex != i) {

        this.totalhours.TotalhrsMonday = moment(moment(this.totalhours.TotalhrsMonday, 'HH:mm').add(moment(this.timesheetList[i].Mondaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Mondaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Mondaynbhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Mondaynbhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Mondaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Mondaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.MondayArray[i].TotalhrsMonday = this.totalhours.TotalhrsMonday;
      }
      if (this.timesheetList[i].Mondayhrs && this.timesheetList[i].Mondayhrs !== null && this.timesheetList[i].Mondayhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsMonday = moment(moment(this.totalhours.TotalhrsMonday, 'HH:mm').add(moment(this.timesheetList[i].Mondayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Mondayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Mondayhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Mondayhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Mondayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Mondayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.MondayArray[i].TotalhrsMonday = this.totalhours.TotalhrsMonday;
      }
      if (this.timesheetList[i].Tuesdayhrs && this.timesheetList[i].Tuesdayhrs !== null && this.timesheetList[i].Tuesdayhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsTuesday = moment(moment(this.totalhours.TotalhrsTuesday, 'HH:mm').add(moment(this.timesheetList[i].Tuesdayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Tuesdayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Tuesdayhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Tuesdayhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Tuesdayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Tuesdayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.TuesdayArray[i].TotalhrsTuesday = this.totalhours.TotalhrsTuesday;
      }
      if (this.timesheetList[i].Tuesdaynbhrs && this.timesheetList[i].Tuesdaynbhrs !== null && this.timesheetList[i].Tuesdaynbhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsTuesday = moment(moment(this.totalhours.TotalhrsTuesday, 'HH:mm').add(moment(this.timesheetList[i].Tuesdaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Tuesdaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Tuesdaynbhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Tuesdaynbhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Tuesdaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Tuesdaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.TuesdayArray[i].TotalhrsTuesday = this.totalhours.TotalhrsTuesday;
      }
      if (this.timesheetList[i].Wednesdaynbhrs && this.timesheetList[i].Wednesdaynbhrs !== null && this.timesheetList[i].Wednesdaynbhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsWednesday = moment(moment(this.totalhours.TotalhrsWednesday, 'HH:mm').add(moment(this.timesheetList[i].Wednesdaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Wednesdaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Wednesdaynbhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Wednesdaynbhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Wednesdaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Wednesdaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.WednesdayArray[i].TotalhrsWednesday = this.totalhours.TotalhrsWednesday;
      }
      if (this.timesheetList[i].Wednesdayhrs && this.timesheetList[i].Wednesdayhrs !== null && this.timesheetList[i].Wednesdayhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsWednesday = moment(moment(this.totalhours.TotalhrsWednesday, 'HH:mm').add(moment(this.timesheetList[i].Wednesdayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Wednesdayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Wednesdayhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Wednesdayhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Wednesdayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Wednesdayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.WednesdayArray[i].TotalhrsWednesday = this.totalhours.TotalhrsWednesday;
      }
      if (this.timesheetList[i].Thursdaynbhrs && this.timesheetList[i].Thursdaynbhrs !== null && this.timesheetList[i].Thursdaynbhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsThursday = moment(moment(this.totalhours.TotalhrsThursday, 'HH:mm').add(moment(this.timesheetList[i].Thursdaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Thursdaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Thursdaynbhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Thursdaynbhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Thursdaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Thursdaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.ThursdayArray[i].TotalhrsThursday = this.totalhours.TotalhrsThursday;
      }
      if (this.timesheetList[i].Thursdayhrs && this.timesheetList[i].Thursdayhrs !== null && this.timesheetList[i].Thursdayhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsThursday = moment(moment(this.totalhours.TotalhrsThursday, 'HH:mm').add(moment(this.timesheetList[i].Thursdayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Thursdayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Thursdayhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Thursdayhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Thursdayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Thursdayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.ThursdayArray[i].TotalhrsThursday = this.totalhours.TotalhrsThursday;
      }
      if (this.timesheetList[i].Fridaynbhrs && this.timesheetList[i].Fridaynbhrs !== null && this.timesheetList[i].Fridaynbhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsFriday = moment(moment(this.totalhours.TotalhrsFriday, 'HH:mm').add(moment(this.timesheetList[i].Fridaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Fridaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Fridaynbhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Fridaynbhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Fridaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Fridaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.FridayArray[i].TotalhrsFriday = this.totalhours.TotalhrsFriday;
      }
      if (this.timesheetList[i].Fridayhrs && this.timesheetList[i].Fridayhrs !== null && this.timesheetList[i].Fridayhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsFriday = moment(moment(this.totalhours.TotalhrsFriday, 'HH:mm').add(moment(this.timesheetList[i].Fridayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Fridayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Fridayhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Fridayhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Fridayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Fridayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.FridayArray[i].TotalhrsFriday = this.totalhours.TotalhrsFriday;
      }
      if (this.timesheetList[i].Saturdaynbhrs && this.timesheetList[i].Saturdaynbhrs !== null && this.timesheetList[i].Saturdaynbhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsSaturday = moment(moment(this.totalhours.TotalhrsSaturday, 'HH:mm').add(moment(this.timesheetList[i].Saturdaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Saturdaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Saturdaynbhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Saturdaynbhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Saturdaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Saturdaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.SaturdayArray[i].TotalhrsSaturday = this.totalhours.TotalhrsSaturday;
      }
      if (this.timesheetList[i].Saturdayhrs && this.timesheetList[i].Saturdayhrs !== null && this.timesheetList[i].Saturdayhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsSaturday = moment(moment(this.totalhours.TotalhrsSaturday, 'HH:mm').add(moment(this.timesheetList[i].Saturdayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Saturdayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Saturdayhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Saturdayhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Saturdayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Saturdayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.SaturdayArray[i].TotalhrsSaturday = this.totalhours.TotalhrsSaturday;
      }
      if (this.timesheetList[i].Sundaynbhrs && this.timesheetList[i].Sundaynbhrs !== null && this.timesheetList[i].Sundaynbhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsSunday = moment(moment(this.totalhours.TotalhrsSunday, 'HH:mm').add(moment(this.timesheetList[i].Sundaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Sundaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Sundaynbhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Sundaynbhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Sundaynbhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Sundaynbhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.SundayArray[i].TotalhrsSunday = this.totalhours.TotalhrsSunday;
      }
      if (this.timesheetList[i].Sundayhrs && this.timesheetList[i].Sundayhrs !== null && this.timesheetList[i].Sundayhrs.length > 0 && this.deletedTaskIndex != i) {
        this.totalhours.TotalhrsSunday = moment(moment(this.totalhours.TotalhrsSunday, 'HH:mm').add(moment(this.timesheetList[i].Sundayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Sundayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');
        totalh = totalh + moment(this.timesheetList[i].Sundayhrs, 'HH:mm').hours();
        totalm = totalm + moment(this.timesheetList[i].Sundayhrs, 'HH:mm').minutes();
        // this.totalhours.TotalhrsTimesheet = moment(moment(this.totalhours.TotalhrsTimesheet, 'HH:mm').add(moment(this.timesheetList[i].Sundayhrs, 'HH:mm').hours() * 60 + moment(this.timesheetList[i].Sundayhrs, 'HH:mm').minutes(), 'minutes')).format('HH:mm');

        this.weekProjects.SundayArray[i].TotalhrsSunday = this.totalhours.TotalhrsSunday;
      }
    }

    totalh = totalh + parseInt((totalm / 60).toString());
    totalm = totalm % 60;
    this.totalhours.TotalhrsTimesheet = (totalh < 10 ? '0' + totalh : totalh) + ':' + (totalm < 10 ? '0' + totalm : totalm);
    // console.log('total hrs', this.totalhours.TotalhrsTimesheet);

  }

  createMondayProject(project: any) {
    var mondayProject: monday = new monday();
    mondayProject.ApproverUser = project ? project.ApproverUser : { ID: 0, Value: '' };
    mondayProject.ApproverComment = project ? project.ApproverComment : '';
    mondayProject.Billable = project ? project.Billable : '';
    mondayProject.ID = project ? project.ID : '';
    mondayProject.Mondaydesc = project ? project.Mondaydesc : '';
    mondayProject.Mondaydescnb = project ? project.Mondaydescnb : '';
    mondayProject.Mondayhrs = project ? project.Mondayhrs : '';
    mondayProject.Mondaynbhrs = project ? project.Mondaynbhrs : '';
    mondayProject.Project = project ? project.Project : { ID: 0, Value: '' };
    mondayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    mondayProject.Task = project ? project.Task : '';
    mondayProject.TimesheetID = project ? project.TimesheetID : '';
    mondayProject.TotalhrsMonday = project ? this.totalhours.TotalhrsMonday : '';
    //mondayProject.date = moment(this.weekStartDate).add(0, 'days');

    return mondayProject;
  }

  createTuesdayProject(project: any) {
    var tuesdayProject: tuesday = new tuesday();
    tuesdayProject.ApproverUser = project ? project.ApproverUser : { ID: 0, Value: '' };
    tuesdayProject.ApproverComment = project ? project.ApproverComment : '';
    tuesdayProject.Billable = project ? project.Billable : '';
    tuesdayProject.ID = project ? project.ID : '';
    tuesdayProject.Tuesdaydesc = project ? project.Tuesdaydesc : '';
    tuesdayProject.Tuesdaydescnb = project ? project.Tuesdaydescnb : '';
    tuesdayProject.Tuesdayhrs = project ? project.Tuesdayhrs : '';
    tuesdayProject.Tuesdaynbhrs = project ? project.Tuesdaynbhrs : '';
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
    wednesdayProject.ApproverComment = project ? project.ApproverComment : '';
    wednesdayProject.Billable = project ? project.Billable : '';
    wednesdayProject.ID = project ? project.ID : '';
    wednesdayProject.Wednesdaydesc = project ? project.Wednesdaydesc : '';
    wednesdayProject.Wednesdaydescnb = project ? project.Wednesdaydescnb : '';
    wednesdayProject.Wednesdayhrs = project ? project.Wednesdayhrs : '';
    wednesdayProject.Wednesdaynbhrs = project ? project.Wednesdaynbhrs : '';
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
    thursdayProject.ApproverComment = project ? project.ApproverComment : '';
    thursdayProject.Billable = project ? project.Billable : '';
    thursdayProject.ID = project ? project.ID : '';
    thursdayProject.Thursdaydesc = project ? project.Thursdaydesc : '';
    thursdayProject.Thursdaydescnb = project ? project.Thursdaydescnb : '';
    thursdayProject.Thursdayhrs = project ? project.Thursdayhrs : '';
    thursdayProject.Thursdaynbhrs = project ? project.Thursdaynbhrs : '';
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
    fridayProject.ApproverComment = project ? project.ApproverComment : '';
    fridayProject.Billable = project ? project.Billable : '';
    fridayProject.ID = project ? project.ID : '';
    fridayProject.Fridaydesc = project ? project.Fridaydesc : '';
    fridayProject.Fridaydescnb = project ? project.Fridaydescnb : '';
    fridayProject.Fridayhrs = project ? project.Fridayhrs : '';
    fridayProject.Fridaynbhrs = project ? project.Fridaynbhrs : '';
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
    saturdayProject.ApproverComment = project ? project.ApproverComment : '';
    saturdayProject.Billable = project ? project.Billable : '';
    saturdayProject.ID = project ? project.ID : '';
    saturdayProject.Saturdaydesc = project ? project.Saturdaydesc : '';
    saturdayProject.Saturdaydescnb = project ? project.Saturdaydescnb : '';
    saturdayProject.Saturdayhrs = project ? project.Saturdayhrs : '';
    saturdayProject.Saturdaynbhrs = project ? project.Saturdaynbhrs : '';
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
    sundayProject.ApproverComment = project ? project.ApproverComment : '';
    sundayProject.Billable = project ? project.Billable : '';
    sundayProject.ID = project ? project.ID : '';
    sundayProject.Sundaydesc = project ? project.Sundaydesc : '';
    sundayProject.Sundaydescnb = project ? project.Sundaydescnb : '';
    sundayProject.Sundayhrs = project ? project.Sundayhrs : '';
    sundayProject.Sundaynbhrs = project ? project.Sundaynbhrs : '';
    sundayProject.Project = project ? project.Project : { ID: 0, Value: '' };
    sundayProject.ProjectTimesheetStatus = project ? project.ProjectTimesheetStatus : '';
    sundayProject.Task = project ? project.Task : '';
    sundayProject.TimesheetID = project ? project.TimesheetID : '';
    sundayProject.TotalhrsSunday = project ? this.totalhours.TotalhrsSunday : '';
    //sundayProject.date = moment(this.weekStartDate).add(6, 'days');
    return sundayProject;
  }

  checkProjectAndTask() {
    //this.isError = false;
    let timesheet = this.timesheetList[this.timesheetList.length - 1];
    if (!timesheet.Project || timesheet.Project === null) {
      //this.isError = true;
      //this.errorMessage = 'Please select Project';
      return false;
    }
    if (!timesheet.Task || timesheet.Task === null || timesheet.Task === '') {
      //this.isError = true;
      //this.errorMessage = 'Please select Task';
      return false;
    }
    return true;
  }

  closeClick(index) {
    if (this.checkProjectAndTask() == false)
      return;

    this.deletedTaskIndex = index;
    this.weekProjects.MondayArray.splice(index, 1);
    this.weekProjects.TuesdayArray.splice(index, 1);
    this.weekProjects.WednesdayArray.splice(index, 1);
    this.weekProjects.ThursdayArray.splice(index, 1);
    this.weekProjects.FridayArray.splice(index, 1);
    this.weekProjects.SaturdayArray.splice(index, 1);
    this.weekProjects.SundayArray.splice(index, 1);
    debugger;
    this.timesheetList[index].ProjectTimesheetStatus = 'Inactive';
    debugger;

    // console.log('this.timesheetList => ', this.timesheetList);

    if (this.weekProjects.MondayArray.length === 0) {
      this.weekProjects.MondayArray.push(this.createMondayProject(null));
      this.weekProjects.TuesdayArray.push(this.createTuesdayProject(null));
      this.weekProjects.WednesdayArray.push(this.createWednesdayProject(null));
      this.weekProjects.ThursdayArray.push(this.createThursdayProject(null));
      this.weekProjects.FridayArray.push(this.createFridayProject(null));
      this.weekProjects.SaturdayArray.push(this.createSaturdayProject(null));
      this.weekProjects.SundayArray.push(this.createSundayProject(null));
      this.pushTimeSheet();
    }
    this.calcDailyHours();
    this.calculateTotalHrs();
  }

  calcDailyHours() {
    this.dailyTotalhours[0] = this.totalhours.TotalhrsMonday;
    this.dailyTotalhours[1] = this.totalhours.TotalhrsTuesday;
    this.dailyTotalhours[2] = this.totalhours.TotalhrsWednesday;
    this.dailyTotalhours[3] = this.totalhours.TotalhrsThursday;
    this.dailyTotalhours[4] = this.totalhours.TotalhrsFriday;
    this.dailyTotalhours[5] = this.totalhours.TotalhrsSaturday;
    this.dailyTotalhours[6] = this.totalhours.TotalhrsSunday;
  }

}
