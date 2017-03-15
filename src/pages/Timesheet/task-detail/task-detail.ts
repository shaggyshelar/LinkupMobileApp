import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the TaskDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html'
})
export class TaskDetailPage {
  taskDetail: any;
  project: any;
  task : any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    this.taskDetail = this.navParams.data;
    this.project = this.navParams.data.Project;
    this.task = this.navParams.data.task;
    console.log(this.taskDetail);
  }

}
