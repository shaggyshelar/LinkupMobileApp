import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
/** Third Party Dependencies */
import * as _ from 'lodash';
import * as moment from 'moment/moment';
/** Module Level Dependencies */
import { ProjectService } from '../services/project.service';
import { ClientService } from '../../../providers/shared/master/client.service';
import { ProjectTypeService } from '../../../providers/shared/master/projectType.service';
import { ProjectCategoryService } from '../../../providers/shared/master/projectCategory.service';
import { DeliveryUnitService } from '../../../providers/shared/master/deliveryUnit.service';
import { DeliveryModelService } from '../../../providers/shared/master/deliveryModel.service';
import { PriceTypeService } from '../../../providers/shared/master/priceType.service';
import { Project } from '../models/project';

import { AuthService } from '../../../providers/index';
/*
  Generated class for the EmployeeProjectManagement page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-employee-project-management',
  templateUrl: 'employee-project-management.html'
})
export class EmployeeProjectManagementPage {
  complexForm: FormGroup;
  clients: any[];
  billTypes: any[];
  projectType: any[];
  projectCategory: any[];
  deliverUnits: any[];
  deliverModels: any[];
  priceType: any[];
  teamMember: any;
  selectedProjectDetails: any;
  isTeamValid: boolean = false;
  ProjectDetails: Project = new Project();
  isAuthorized: boolean;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public projectService: ProjectService,
    public clientService: ClientService,
    public projectTypeService: ProjectTypeService,
    public projectCategoryService: ProjectCategoryService,
    public deliveryUnitService: DeliveryUnitService,
    public deliveryModelService: DeliveryModelService,
    public priceTypeService: PriceTypeService,
    public auth: AuthService,
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
      'teammembers': [null],
      'projectsummary': [null],
      'teamsize': [null],
      'isglobal': [null],
      'active': [null]
    })
    this.teamMember = [];
    this.selectedProjectDetails = [];
    this.isAuthorized = this.auth.checkPermission('PROJECTS.EMPLOYEEPROJECTMANAGEMENT.ADD');
  }

  ionViewDidLoad() {
    console.log('isAuth => ', this.auth.checkPermission('PROJECTS.EMPLOYEEPROJECTMANAGEMENT.ADD'));
    if (this.navParams.get('selectedProject')) {
      this.selectedProjectDetails = this.navParams.get('selectedProject');
      this.showProjectDetails(this.selectedProjectDetails);
    }

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

  }
  showProjectDetails(selectedproject) {
    // console.log('complexForm.controls.billable.touched => ', this.complexForm.controls.bill);
    var isGlobal, isActive;
    if (selectedproject.Isglobal.toLowerCase() === 'no') {
      isGlobal = false;
    }
    if (selectedproject.Isglobal.toLowerCase() === 'yes') {
      isGlobal = true;
    }
    if (selectedproject.Active.toLowerCase() === 'no') {
      isActive = false;
    }
    if (selectedproject.Active.toLowerCase() === 'yes') {
      isActive = true;
    }

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
  loadClients() {
    this.clients = [];
    this.clients.push({ label: 'Select Client', value: null });
    // TO DO: Need to publish/create API
    this.clientService.getClients().subscribe(result => {
      _.forEach(result, (element: any) => {
        this.clients.push({
          label: element.ClientName,
          value: element.ClientName
        });
      });
    });
  }
  loadProjectTypes() {
    this.projectType = [];
    this.projectType.push({ label: 'Select Project Type', value: null });
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
      _.forEach(result, (element: any) => {
        this.projectCategory.push({
          label: element.Category,
          value: element.Category
        });
      });
    });
  }
  loadDeliveryUnit() {
    this.deliverUnits = [];
    this.deliveryUnitService.getDeliveryUnit().subscribe(result => {
      _.forEach(result, (element: any) => {
        this.deliverUnits.push({
          label: element.Title,
          value: element.Title
        });
      });
    });
  }
  loadDeliveryModels() {
    this.deliverModels = [];
    this.deliveryModelService.getDeliveryModel().subscribe(result => {
      _.forEach(result, (element: any) => {
        this.deliverModels.push({
          Value: element.Title,
          ID: element.ID
        });
      });
    });
  }
  loadPriceType() {
    this.priceType = [];
    this.priceType.push({ label: 'Select Price Type', value: null });
    // TO DO: Need to publish/create API
    this.priceTypeService.getPriceType().subscribe(result => {
            _.forEach(result, (element:any) => {
                this.priceType.push({
                    label: element.Name,
                    value: element.Name
                });
            });
    });
  }
  addMembers(member: string) {
    this.teamMember.push({Id:null, Name: member});
    this.ProjectDetails.TeamMembers = null;
    this.isTeamValid = false;
  }
  onDeleteMembers(index: number, member) {
    this.teamMember.splice(index, 1);
  }
  textChanged(event: any) {
    if (this.ProjectDetails.TeamMembers.length > 2)
      this.isTeamValid = true;
    else
      this.isTeamValid = false;

  }

  saveClicked(formValue) {
    console.log('formValue=>', formValue);
    var payload  = this.assemblePayload(formValue, 'save');
  }

  deactivateClicked(formValue) {
    console.log('formValue=>', formValue);
    var payload  = this.assemblePayload(formValue, 'deactivate');
  }

  assemblePayload(value, action) {
    var payload = new Project();
    payload.Id = this.selectedProjectDetails.Id;
    payload.ProjectName = value.projectname;
    payload.ProjectType = value.projecttype;
    payload.DeliveryUnit = value.deliveryunit;
    payload.ProjectCategory = value.projectcategory;
    payload.ClientName = value.clientname;
    payload.ProjectStartDate = value.projectstart;
    payload.ProjectEndDate = value.projectend;
    payload.ProjectManager = value.projectmanager;
    payload.AccountManager = value.accountmanager;
    payload.DeliveryManager = value.deliverymanager;
    payload.BillType = value.billable;
    payload.ProjectSummary = value.projectsummary;
    payload.DeliveryModel = value.deliverymodel;
    payload.PriceType = value.pricetype;
    payload.TeamSize = value.teamsize;
    payload.IsActive = value.active ? true : false;
    payload.IsGlobal = value.isglobal ? true : false;
    payload.TeamMembers = this.teamMember;

    console.log('payload => ', payload);
    return payload;
  }
}
