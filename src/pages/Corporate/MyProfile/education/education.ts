import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Education page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-education',
  templateUrl: 'education.html'
})
export class EducationPage {

  isDisabled: Boolean = false;
  showDetails: Boolean = false;
  selectedItem: any = {};
  education: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.education = [
      {
        canEdit: false,
        class: 'Degree',
        degree: 'Batchelor of Engineering',
        grade: 'First Class',
        yearOfPassing: 2016,
        certificate: 'filename.jpg',
        status: 'Approved',
        hrComments: 'Ok'
      },
      {
        canEdit: false,
        class: 'Diploma',
        degree: 'Batchelor of Engineering',
        grade: 'First Class',
        yearOfPassing: 2013,
        certificate: 'filename.jpg',
        status: 'Approved',
        hrComments: 'Ok'
      }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EducationPage');
  }

  addEducation() {
    /** Add Button Clicked */
  }

  viewEditEducation(item) {
    if (item) {
      item.status != 'Approved' ? this.isDisabled = true : this.isDisabled = false;
      this.showDetails = true;
      this.selectedItem = item;
    }
  }

}
