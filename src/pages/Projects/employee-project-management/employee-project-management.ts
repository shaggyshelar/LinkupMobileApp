import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
/** Third Party Dependencies */
import * as _ from 'lodash';
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
                  'teammembers' : [null]
                  })
                  this.teamMember=[];
              }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EmployeeProjectManagementPage');
    this.billTypes = [{ label: 'Select ', value: null }, {
      label: 'Billable',
      value: 'Billable'
    }, {
      label: 'Non Billable',
      value: 'Non Billable'
    }];
    this.loadClients();
    this.loadProjectTypes();
    this.loadProjectCategories();
    this.loadDeliveryUnit();
    this.loadDeliveryModels();
    this.loadPriceType();
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
            this.projectCategory.push({ label: 'Select Project Category', value: null });
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
            this.deliverUnits.push({ label: 'Select Delivery Unit', value: null });
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
            this.deliverModels.push({ label: 'Select Delivery Model', value: null });
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
  }
  onDeleteMembers(index:number) {
    this.teamMember.splice(index,1);
  }
}
