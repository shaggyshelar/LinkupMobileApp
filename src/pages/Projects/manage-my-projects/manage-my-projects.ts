import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProjectService } from '../index';
import { Project } from '../models/project';
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
  providers:[ProjectService]
})
export class ManageMyProjectsPage {

projectList: Observable<Project[]>;
  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
   private projectService: ProjectService) { 
   
   }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ManageMyProjectsPage');
    this.getActiveProjects();
  }
  getActiveProjects()
  {
     this.projectList = this.projectService.getProjectList();
  }

}
