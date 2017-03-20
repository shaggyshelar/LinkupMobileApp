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
  complexForm : FormGroup;
  clients: any[];
  billTypes: any[];
  projectType: any[];
  projectCategory: any[];
  deliverUnits: any[];
  deliverModels: any[];
  priceType: any[];
  teamMember:any;
  selectedProjectDetails:any;
  isTeamValid:boolean = false;
  ProjectDetails : Project = new Project();
  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              public projectService: ProjectService,
              public clientService:ClientService,
              public projectTypeService:ProjectTypeService,
              public projectCategoryService:ProjectCategoryService,
              public deliveryUnitService:DeliveryUnitService,
              public deliveryModelService:DeliveryModelService,
              public priceTypeService:PriceTypeService,
              public fb: FormBuilder) { 
                this.complexForm = fb.group({
                  'clientname' : [null, Validators.required],
                  'billable' : [null, Validators.required],
                  'projectname' : [null, Validators.required],
                  'projectmanager' : [null, Validators.required],
                  'projecttype' : [null, Validators.required],
                  'projectcategory' : [null, Validators.required],
                  'projectstart' : [null, Validators.required],
                  'projectend' : [null, Validators.required],
                  'deliveryunit' : [null, Validators.required],
                  'deliverymodel' : [null, Validators.required],
                  'accountmanager' : [null, Validators.required],
                  'deliverymanager' : [null, Validators.required],
                  'pricetype' : [null, Validators.required],
                  'teammembers' : [null],
                  'projectsummary' : [null],
                  'teamsize' : [null],
                  'isglobal' : [null],
                  'active' : [null]
                  })
                  this.teamMember=[];
                  this.selectedProjectDetails=[];
              }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EmployeeProjectManagementPage');
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
    this.selectedProjectDetails = this.navParams.get('selectedProject');
    this.showProjectDetails(this.selectedProjectDetails);
  }
  showProjectDetails(selectedproject) {
    this.ProjectDetails.ClientName = selectedproject.ClientName.Value;
    this.ProjectDetails.Billable = selectedproject.BillableNonBillable;
    this.ProjectDetails.ProjectName = selectedproject.Title;
    this.ProjectDetails.ProjectSummary = selectedproject.ProjectSummary;
    this.ProjectDetails.ProjectManager = selectedproject.ProjectManager.Name;
    this.ProjectDetails.ProjectType = selectedproject.ProjectType;
    this.ProjectDetails.ProjectCategory = selectedproject.ProjectCategory.Value;
    this.ProjectDetails.ProjectStartDate = selectedproject.StartDate;
    this.ProjectDetails.ProjectEndDate = selectedproject.EndDate;
    this.ProjectDetails.DeliveryUnit = selectedproject.DeliveryUnit.Value;
    this.ProjectDetails.DeliveryModel = selectedproject.DeliveryModel.Value;
    this.ProjectDetails.AccountManager = selectedproject.AccountManager.Name;
    this.ProjectDetails.DeliveryManager = selectedproject.DeliveryManager.Name;
    this.ProjectDetails.PriceType = selectedproject.PriceType;
    this.ProjectDetails.TeamSize = selectedproject.TeamSize;
    if(selectedproject.Isglobal.toLowerCase() === 'no'){
      this.ProjectDetails.IsGlobal = false;
    }
    if(selectedproject.Isglobal.toLowerCase() === 'yes'){
      this.ProjectDetails.IsGlobal = true;
    }
    if(selectedproject.Active.toLowerCase() === 'no'){
      this.ProjectDetails.Active = false;
    }
    if(selectedproject.Active.toLowerCase() === 'yes'){
      this.ProjectDetails.Active = true;
    }
  }
  loadClients() {
    this.clients = [];
    this.clients.push({ label: 'Select Client', value: null });
    // TO DO: Need to publish/create API
    // this.clientService.getClients().subscribe(result => {
    //         _.forEach(result, (element:any) => {
    //             this.clients.push({
    //                 label: element.Name,
    //                 value: element.Name
    //             });
    //         });
    //     });
  }
  loadProjectTypes() {
    this.projectType = [];
    this.projectType.push({ label: 'Select Project Type', value: null });
    // TO DO: Need to publish/create API
    // this.projectTypeService.getProjectTypes().subscribe(result => {
    //         _.forEach(result, (element:any) => {
    //             this.projectType.push({
    //                 label: element.Name,
    //                 value: element.Name
    //             });
    //         });
    //     });
  }
  loadProjectCategories() {
    this.projectCategory = [];
    this.projectCategoryService.getProjectCategory().subscribe(result => {
            _.forEach(result, (element:any) => {
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
            _.forEach(result, (element:any) => {
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
            _.forEach(result, (element:any) => {
                this.deliverModels.push({
                    label: element.Title,
                    value: element.Title
                });
            });
        });
  }
  loadPriceType() {
    this.priceType = [];
    this.priceType.push({ label: 'Select Price Type', value: null });
    // TO DO: Need to publish/create API
    // this.priceTypeService.getPriceType().subscribe(result => {
    //         _.forEach(result, (element:any) => {
    //             this.priceType.push({
    //                 label: element.Name,
    //                 value: element.Name
    //             });
    //         });
    //     });
  }
  addMembers(member:string) {
    this.teamMember.push(member);
    this.ProjectDetails.TeamMembers='';
    this.isTeamValid = false;
  }
  onDeleteMembers(index:number) {
    this.teamMember.splice(index,1);
  }
  textChanged(event: any) {
        if (this.ProjectDetails.TeamMembers.length > 2)
            this.isTeamValid = true;
        else
            this.isTeamValid = false;

    }
}
