import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProjectService } from '../index';
import { AddProjectsPage } from '../add-projects/add-projects';
import { Project } from '../models/project';
import { SpinnerService } from '../../../providers/index';
import { AuthService } from '../../../providers/index';
/** Component Declaration */
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the ManageMyProjects page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-manage-my-projects',
  templateUrl: 'manage-my-projects.html',
  providers: [ProjectService, SpinnerService]
})
export class ManageMyProjectsPage {
  isAuthorized: boolean;
  canManageProject: boolean;
  canReadProject: boolean;
  canUpdateProject: boolean;
  canAddProject: boolean;
  isAllDataLoaded: boolean;

  projectList: Observable<Project[]>;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private projectService: ProjectService,
    private spinnerService: SpinnerService,
    public auth: AuthService,
  ) {
    this.isAuthorized = this.auth.checkPermission('PROJECTS.EMPLOYEEPROJECTMANAGEMENT.ADD')
    this.canAddProject = this.auth.checkPermission('PROJECTS.MANAGEMYPROJECTS.ADD');
    this.canUpdateProject = this.auth.checkPermission('PROJECTS.MANAGEMYPROJECTS.UPDATE');
    this.canReadProject = this.auth.checkPermission('PROJECTS.MANAGEMYPROJECTS.READ');
    this.canManageProject = this.auth.checkPermission('PROJECTS.MANAGEMYPROJECTS.MANAGE');

  }//PROJECTS.MANAGEMYPROJECTS.MANAGE

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ManageMyProjectsPage');
    this.getActiveProjects();
  }
  getActiveProjects() {
    this.isAllDataLoaded = false;
    //this.projectList = this.projectService.getProjectList();
    this.spinnerService.createSpinner('Please wait');
    this.projectService.getManageMyProjectsList().subscribe(
      (res: any) => {
        this.spinnerService.stopSpinner();
        this.projectList = res;
        this.isAllDataLoaded = true;
      }, error => {
        this.spinnerService.stopSpinner();
      });

  }
  goToProjectDetail(project: any) {
    this.navCtrl.push(AddProjectsPage, { selectedProject: project });
  }

  addFabClicked() {
    this.navCtrl.push(AddProjectsPage);
  }

}
