import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
/** Third Party Dependencies */
import * as _ from 'lodash';
import * as moment from 'moment/moment';
/** Module Level Dependencies */
import { AddTeamMembersPage } from '../add-team-members/add-team-members';
import { ProjectService } from '../services/project.service';
import { ClientService } from '../../../providers/shared/master/client.service';
import { ProjectTypeService } from '../../../providers/shared/master/projectType.service';
import { ProjectCategoryService } from '../../../providers/shared/master/projectCategory.service';
import { DeliveryUnitService } from '../../../providers/shared/master/deliveryUnit.service';
import { DeliveryModelService } from '../../../providers/shared/master/deliveryModel.service';
import { PriceTypeService } from '../../../providers/shared/master/priceType.service';
import { EmployeeService } from '../index';
import { Project } from '../models/project';
import { TeamMemberService } from '../index';
import { SpinnerService } from '../../../providers/index';
import { ToastService } from '../../../providers/shared/services/toast.service';

import { AuthService } from '../../../providers/index';
/*
  Generated class for the AddProjects page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-projects',
  templateUrl: 'add-projects.html',
  providers: [ToastService, SpinnerService]
})
export class AddProjectsPage {
  complexForm: FormGroup;
  clients: any[];
  billTypes: any[];
  projectType: any[];
  projectCategory: any[];
  deliverUnits: any[];
  deliverModels: any[];
  priceType: any[];
  teamMember: any[];
  oldMembers: any[];
  selectedProjectDetails: any;
  isTeamValid: boolean = false;
  ProjectDetails: any;
  maxYrs: any;
  projMasterId: any;
  accManagerSuggestion: boolean;
  deliveryManagerSuggestion: boolean;
  projectManagerSuggestion: boolean;
  suggestionList: any[];
  usersList: any[];
  ID: any;
  minStrtDt: any;
  updateTeamMembers: any[];
  isAuthorized: boolean;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public projectService: ProjectService,
    public clientService: ClientService,
    public projectTypeService: ProjectTypeService,
    public projectCategoryService: ProjectCategoryService,
    public deliveryUnitService: DeliveryUnitService,
    public deliveryModelService: DeliveryModelService,
    public toastService: ToastService,
    public spinnerService: SpinnerService,
    public priceTypeService: PriceTypeService,
    public teamMemberService: TeamMemberService,
    public auth: AuthService,
    public empService: EmployeeService,
    public fb: FormBuilder) {
    this.complexForm = fb.group({
      'clientname': [null, Validators.required],
      'billable': [null, Validators.required],
      'projectname': [null, Validators.required],
      'projectmanager': [null, Validators.required],
      'projecttype': [null, Validators.required],
      'projectcategory': [null, Validators.required],
      'projectstart': [null, Validators.required],
      'projectend': [null, Validators.required],
      'deliveryunit': [null, Validators.required],
      'deliverymodel': [null, Validators.required],
      'accountmanager': [null, Validators.required],
      'deliverymanager': [null, Validators.required],
      'pricetype': [null, Validators.required],
      'teammembers': [],
      'projectsummary': [],
      'teamsize': [],
      'isglobal': [],
      'active': []
    });
    this.ID = null;
    this.maxYrs = moment(moment().add(15, 'years')).toISOString();
    this.ProjectDetails = {};
    this.accManagerSuggestion = false;
    this.deliveryManagerSuggestion = false;
    this.projectManagerSuggestion = false;
    this.suggestionList = [];
    this.usersList = [];
    this.teamMember = [];
    this.oldMembers = [];
    this.selectedProjectDetails = {};
    this.clients = [];
    this.billTypes = [];
    this.projectType = [];
    this.projectCategory = [];
    this.deliverUnits = [];
    this.deliverModels = [];
    this.priceType = [];
    this.updateTeamMembers = [];
    this.isAuthorized = this.auth.checkPermission('PROJECTS.EMPLOYEEPROJECTMANAGEMENT.ADD') && this.auth.checkPermission('PROJECTS.EMPLOYEEPROJECTMANAGEMENT.MANAGE');
    if (this.navParams.get('selectedProject')) {
      this.initData();
      this.selectedProjectDetails = this.navParams.get('selectedProject');
      this.setProjectDetails(this.navParams.get('selectedProject'));
      this.projMasterId = this.selectedProjectDetails.ProjectMasterID;
      this.ID = this.selectedProjectDetails.ID;
    } else { this.initData(); }
    this.billTypes = [{
      label: 'Billable',
      value: 'Billable'
    }, {
      label: 'Non-Billable',
      value: 'Non-Billable'
    }];
    this.loadClients();
    this.loadProjectTypes();
    this.loadProjectCategories();
    this.loadDeliveryUnit();
    this.loadDeliveryModels();
    this.loadPriceType();
    this.loadTeamMembers();
    this.loadUsers();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.updateTeamMembers = this.assembleNewTeam();
  }

  initData() {
    this.ProjectDetails.ClientName = null;
    this.ProjectDetails.ProjectManager = { Name: '', ID: 0 };
    this.ProjectDetails.AccountManager = { Name: '', ID: 0 };
    this.ProjectDetails.DeliveryManager = { Name: '', ID: 0 };
    this.ProjectDetails.Billable = null;
    this.ProjectDetails.DeletedStamp = null;
    this.ProjectDetails.DeliveryModel = null;
    this.ProjectDetails.DeliveryUnit = null;
    this.ProjectDetails.EndDate = null;
    this.ProjectDetails.StartDate = null;
    this.ProjectDetails.ExecutionStatus = null;
    this.ProjectDetails.ID = null;
    this.ProjectDetails.PriceType = { Name: '', ID: 0 };
    this.ProjectDetails.ProjectCategory = null;
    this.ProjectDetails.ProjectManager = null;
    this.ProjectDetails.ProjectMasterID = null;
    this.ProjectDetails.ProjectSummary = null;
    this.ProjectDetails.ProjectType = null;
    this.ProjectDetails.StartDate = null;
    this.ProjectDetails.Status = null;
    this.ProjectDetails.Tasks = null;
    this.ProjectDetails.TeamSize = null;
    this.ProjectDetails.Title = null;
    this.ProjectDetails.isGlobal = false;
    this.ProjectDetails.isActive = false;
  }

  setProjectDetails(selectedproject) {
    this.ProjectDetails.ClientName = selectedproject.ClientName;
    this.ProjectDetails.ProjectManager = selectedproject.ProjectManager;
    this.ProjectDetails.AccountManager = selectedproject.AccountManager;
    this.ProjectDetails.DeliveryManager = selectedproject.DeliveryManager;
    this.ProjectDetails.Billable = selectedproject.BillableNonBillable;
    this.ProjectDetails.DeletedStamp = selectedproject.DeletedStamp;
    this.ProjectDetails.DeliveryModel = selectedproject.DeliveryModel;
    this.ProjectDetails.DeliveryUnit = selectedproject.DeliveryUnit;
    this.ProjectDetails.EndDate = moment(selectedproject.EndDate).toISOString();
    this.ProjectDetails.StartDate = moment(selectedproject.StartDate).toISOString();
    this.ProjectDetails.ExecutionStatus = selectedproject.ExecutionStatus;
    this.ProjectDetails.ID = selectedproject.ID;
    this.ProjectDetails.PriceType = selectedproject.PriceType;
    this.ProjectDetails.ProjectCategory = selectedproject.ProjectCategory;
    this.ProjectDetails.ProjectManager = selectedproject.ProjectManager;
    this.ProjectDetails.ProjectMasterID = selectedproject.ProjectMasterID;
    this.ProjectDetails.ProjectSummary = selectedproject.ProjectSummary;
    this.ProjectDetails.ProjectType = selectedproject.ProjectType;
    this.ProjectDetails.Status = selectedproject.Status;
    this.ProjectDetails.Tasks = selectedproject.Tasks;
    this.ProjectDetails.TeamSize = selectedproject.TeamSize;
    this.ProjectDetails.Title = selectedproject.Title;
    var isGlobal, isActive;
    if (selectedproject.Isglobal.toLowerCase() === 'no')
      this.ProjectDetails.isGlobal = isGlobal = false;
    if (selectedproject.Isglobal.toLowerCase() === 'yes')
      this.ProjectDetails.isGlobal = isGlobal = true;
    if (selectedproject.Active.toLowerCase() === 'no')
      this.ProjectDetails.isActive = isActive = false;
    if (selectedproject.Active.toLowerCase() === 'yes')
      this.ProjectDetails.isActive = isActive = true;

    this.complexForm.setValue({
      'clientname': selectedproject.ClientName.Value,
      'billable': selectedproject.BillableNonBillable,
      'projectname': selectedproject.Title,
      'projectmanager': selectedproject.ProjectManager.Name,
      'projecttype': selectedproject.ProjectType,
      'projectcategory': selectedproject.ProjectCategory.Value,
      'projectstart': selectedproject.StartDate,
      'projectend': selectedproject.EndDate,
      'deliveryunit': selectedproject.DeliveryUnit.Value,
      'deliverymodel': selectedproject.DeliveryModel.Value,
      'accountmanager': selectedproject.AccountManager.Name,
      'deliverymanager': selectedproject.DeliveryManager.Name,
      'pricetype': selectedproject.PriceType,
      'teammembers': null,
      'projectsummary': selectedproject.ProjectSummary,
      'teamsize': selectedproject.TeamSize,
      'isglobal': isGlobal,
      'active': isActive
    });
  }
  loadUsers() {
    this.empService.getActiveEmployeeList().subscribe((res) => {
      res.forEach((element) => {
        this.suggestionList.push(element.Employee);
      });
      this.usersList = this.suggestionList;
    }, err => {
      this.toastService.createToast(err);
      console.log("err => ", err);
    });
  }
  loadClients() {
    this.clients = [];
    this.clientService.getClients().subscribe(result => {
      result.forEach(element => {
        this.clients.push({ Value: element.ClientName, ID: element.ID });
      });
    });
  }
  loadProjectTypes() {
    this.projectType = [];
    // TO DO: Need to publish/create API
    this.projectTypeService.getProjectTypes().subscribe(result => {
      _.forEach(result, (element: any) => {
        this.projectType.push({
          label: element.Name,
          value: element.Name
        });
      });
    });
  }
  loadProjectCategories() {
    this.projectCategory = [];
    this.projectCategoryService.getProjectCategory().subscribe(result => {
      result.forEach(element => {
        this.projectCategory.push({ Value: element.Category, ID: element.ID });
      });
    });
  }
  loadDeliveryUnit() {
    this.deliverUnits = [];
    this.deliveryUnitService.getDeliveryUnit().subscribe(result => {
      result.forEach(element => {
        this.deliverUnits.push({ Value: element.Title, ID: element.ID });
      });
    });
  }
  loadDeliveryModels() {
    this.deliverModels = [];
    this.deliveryModelService.getDeliveryModel().subscribe(result => {
      result.forEach(element => {
        this.deliverModels.push({ Value: element.Title, ID: element.ID });
      });
    });
  }
  loadPriceType() {
    this.priceType = [];
    this.priceType.push({ label: 'Select Price Type', value: null });
    // TO DO: Need to publish/create API
    this.priceTypeService.getPriceType().subscribe(result => {
      this.priceType = result;
    });
  }

  loadTeamMembers() {
    this.teamMemberService.getTeamByProject(this.projMasterId).subscribe(res => {
      res.forEach(element => {
        if (element.Status == 'Active') {
          this.teamMember.push(element.TeamMember);
          this.oldMembers.push(element);
        }
      });
      this.projMasterId ? this.updateTeamMembers = res : this.updateTeamMembers = [];
    });
  }
  addMembers(member: string) {
    this.teamMember.push({ Id: null, Name: member });
    this.ProjectDetails.TeamMembers = null;
    this.isTeamValid = false;
  }
  onDeleteMembers(index: number, member) {
    var idx;
    var employee = member.Name;
    if (this.projMasterId) {
      idx = this.oldMembers.findIndex((item) => {
        return employee == item.TeamMember.Name;
      });
      this.updateTeamMembers[idx].Status = 'Inactive';
    }
    this.teamMember.splice(index, 1);
  }

  textChanged(event: any) {
    if (this.ProjectDetails.TeamMembers.trim().length > 1)
      this.isTeamValid = true;
    else
      this.isTeamValid = false;
  }

  addMembersClicked() {
    this.navCtrl.push(AddTeamMembersPage, { teamMembers: this.teamMember, projMasterId: this.projMasterId });
  }

  saveClicked(value) {
    var payload = this.getData();
    if (this.projMasterId) {
      this.projectService.updateProjectWithTeam(payload).subscribe(res => {
        if (res.StatusCode == 1) {
          this.toastService.createToast(res.Message);
          this.complexForm.reset();
          this.initData();
          this.teamMember = [];
          this.navCtrl.pop();
        } else { this.toastService.createToast(res.Message); }
      }, err => {
        console.log(err);
      });
    } else {
      //Call Add API
      this.projectService.addProjectWithTeam(payload).subscribe(res => {
        if (res.StatusCode == 1) {
          this.toastService.createToast(res.Message);
          this.complexForm.reset();
          this.initData();
          this.teamMember = [];
          this.navCtrl.pop();
        } else { this.toastService.createToast(res.Message); }
      }, err => {
        console.log(err);
      });
    }
  }

  deactivateClicked(value) {
    this.navCtrl.pop();
  }

  showSuggestion(param, event) {
    switch (param) {
      case 0:
        if (event.target.value.length >= 1)
          this.projectManagerSuggestion = true;
        break;
      case 1:
        if (event.target.value.length >= 1)
          this.accManagerSuggestion = true;
        break;
      case 2:
        if (event.target.value.length >= 1)
          this.deliveryManagerSuggestion = true;
        break;
    }

    this.suggestionList = this.usersList
    var val = event.target.value;
    var filtered;
    if (val && val.trim() != '') {
      filtered = this.suggestionList.filter((item) => {
        return (item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    this.suggestionList = filtered;
  }

  blurred(param) {
    setTimeout(function () {
      this.accManagerSuggestion = false;
      this.deliveryManagerSuggestion = false;
      this.projectManagerSuggestion = false;
    }, 300);
  }

  closeRecommendation() {
    setTimeout(function () {
      this.accManagerSuggestion = false;
      this.deliveryManagerSuggestion = false;
      this.projectManagerSuggestion = false;
    }, 300);
  }

  accManagerSelected(manager, index) {
    this.complexForm.controls['accountmanager'].setValue(manager.Name);
    this.ProjectDetails.AccountManager = manager;
    this.accManagerSuggestion = false;
  }

  projectManagerSelected(manager, index) {
    this.complexForm.controls['projectmanager'].setValue(manager.Name);
    this.ProjectDetails.ProjectManager = manager;
    this.projectManagerSuggestion = false;
  }

  deliveryManagerSelected(manager, index) {
    this.complexForm.controls['deliverymanager'].setValue(manager.Name);
    this.ProjectDetails.DeliveryManager = manager;
    this.deliveryManagerSuggestion = false;
  }

  clientNameChanged(event) {
    if (event && event.trim() != '') {
      this.ProjectDetails.ClientName = this.clients.find((item) => {
        if (event === item.Value)
          return item;
      });
    }
  }
  projectTypeChanged(event) {
    if (event && event.trim() != '') {
      this.ProjectDetails.ProjectType = this.projectType.find((item) => {
        if (event === item.value)
          return item;
      });
    }
  }
  projectCategoryChanged(event) {
    if (event && event.trim() != '') {
      this.ProjectDetails.ProjectCategory = this.projectCategory.find((item) => {
        if (event === item.Value)
          return item;
      });
    }
  }
  deliveryUnitChanged(event) {
    if (event && event.trim() != '') {
      this.ProjectDetails.DeliveryUnit = this.deliverUnits.find((item) => {
        if (event === item.Value)
          return item;
      });
    }
  }
  deliveryModelChanged(event) {
    if (event && event.trim() != '') {
      this.ProjectDetails.DeliveryModel = this.deliverModels.find((item) => {
        if (event === item.Value)
          return item;
      });
    }
  }
  startDateChanged(event) {
    this.ProjectDetails.StartDate = moment(event.month.text + '/' + event.day.text + '/' + event.year.text).toISOString();
    this.minStrtDt = moment(event.month.text + '/' + event.day.text + '/' + event.year.text).add(2, 'day').toISOString();
  }
  endDateChanged(event) {
    this.ProjectDetails.EndDate = moment(event.month.text + '/' + event.day.text + '/' + event.year.text).toISOString();
  }
  isActiveChanged() {
    this.ProjectDetails.isActive = this.complexForm.controls['active'].value;
  }
  isGlobalChanged() {
    this.ProjectDetails.isGlobal = this.complexForm.controls['isglobal'].value;
  }
  teamSizeChanged() {
    this.ProjectDetails.TeamSize = this.complexForm.controls['teamsize'].value;
  }
  billingChanged(event) {
    if (event && event.trim() != '') {
      this.ProjectDetails.Billable = this.billTypes.find((item) => {
        if (event === item.value)
          return item.value;
      });
    }
  }
  projectSummaryChanged() {
    this.ProjectDetails.ProjectSummary = this.complexForm.controls['projectsummary'].value;
  }
  projectTitleChanged() {
    this.ProjectDetails.Title = this.complexForm.controls['projectname'].value;
  }
  priceTypeChanged(event) {
    this.ProjectDetails.PriceType = event;
  }



  assembleNewTeam() {
    var team = [];
    this.teamMember.forEach((element, index) => {
      var isNewlyAdded = this.oldMembers.find((item) => {
        if (item.TeamMember.Name == element.Name)
          return true;
        else return false;
      });
      team.push({
        ID: isNewlyAdded ? this.oldMembers[index].ID : 0,
        ProjectMasterID: this.projMasterId ? this.projMasterId : '',
        Status: this.ProjectDetails.isActive ? 'Active' : 'InActive',
        TeamMember: element,
        StartDate: this.ProjectDetails.StartDate,
        EndDate: this.ProjectDetails.EndDate,
      });
    });
    return team;
  }

  getData() {
    var payload = {
      // Id: this.ID ? this.ID : '',
      ProjectManager: this.ProjectDetails.ProjectManager,
      ClientName: this.ProjectDetails.ClientName,
      AccountManager: this.ProjectDetails.AccountManager,
      DeliveryManager: this.ProjectDetails.DeliveryManager,
      DeliveryUnit: this.ProjectDetails.DeliveryUnit,
      ProjectCategory: this.ProjectDetails.ProjectCategory,
      DeliveryModel: this.ProjectDetails.DeliveryModel,
      Id: this.projMasterId ? this.ProjectDetails.ID : '',          //for UpdateProjectWithTeamMembers
      Title: this.ProjectDetails.Title,
      Tasks: '',
      Active: this.ProjectDetails.isActive ? 'Yes' : 'No',
      ProjectType: this.projMasterId ? this.ProjectDetails.ProjectType : this.ProjectDetails.ProjectType.value,
      ProjectSummary: this.ProjectDetails.ProjectSummary,
      PriceType: this.ProjectDetails.PriceType,
      StartDate: this.ProjectDetails.StartDate,
      EndDate: this.ProjectDetails.EndDate,
      TeamSize: this.ProjectDetails.TeamSize,
      // ExecutionStatus: this.ProjectDetails.ExecutionStatus,
      ExecutionStatus: '',
      Isglobal: this.ProjectDetails.isGlobal ? 'Yes' : 'No',
      BillableNonBillable: this.projMasterId ? this.ProjectDetails.Billable : this.ProjectDetails.Billable.value,
      ProjectMasterID: this.projMasterId ? this.projMasterId : '',
      DeletedStamp: '',
      Status: this.ProjectDetails.isActive ? 'Active' : 'InActive',
      ProjectTeamMembers: this.projMasterId ? this.updateTeamMembers : this.assembleNewTeam()
    };
    return payload;
  }
}