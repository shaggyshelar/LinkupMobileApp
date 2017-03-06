import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

var educationField = {
  canEdit: Boolean,
  class: String,
  degree: String,
  grade: String,
  percentage: Number,
  yearOfPassing: Number,
  certificate: String,
  status: String,
  hrComments: String
}

@Component({
  selector: 'page-education',
  templateUrl: 'education.html'
})

export class EducationPage {

  isDisabled: Boolean = false;
  showDetails: Boolean = false;
  isAddMode: Boolean = false;
  currentItem: any = educationField;
  education: any[] = [];
  addEducationField: any = educationField;
  classDDL: any[] = ['SSC', 'HSC', 'Diploma', 'Graduation', 'Post-Graduation'];
  gradeDDL: any[] = ['Distinction', 'First Class', 'Second Class', 'Pass'];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.education = [
      {
        canEdit: false,
        class: 'Degree',
        degree: 'Batchelor of Engineering',
        grade: 'First Class',
        percentage: 64,
        yearOfPassing: 2016,
        certificate: 'filename.jpg',
        status: 'Pending',
        hrComments: 'Ok'
      },
      {
        canEdit: false,
        class: 'Diploma',
        degree: 'Computer Engineering',
        grade: 'First Class',
        percentage: 68,
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

  toggleShowDetails() {
    this.showDetails = !this.showDetails;
  }

  toggleAddMode() {
    this.isAddMode = !this.isAddMode;
  }

  addEducationClicked() {
    if (this.showDetails) this.toggleShowDetails();
    this.toggleAddMode();
    this.currentItem = this.addEducationField = {
      canEdit: false,
      class: '',
      degree: '',
      grade: '',
      percentage: null,
      yearOfPassing: null,
      certificate: '',
      status: '',
      hrComments: ''
    }
    this.isDisabled = false;

    /** Add Button Clicked */
  }

  viewEditEducation(item) {
    if (item) {
      this.isDisabled = item.status !== 'Approved' ? false : true;
      this.showDetails = true;
      this.isAddMode ? this.toggleAddMode() : null;
      this.currentItem = item;
    }
  }

  closeTapped() {
    this.showDetails = false;
    this.currentItem = {};
  }

  isPendingEntry() {
    return this.currentItem.status !== 'Pending' ? true : false;
  }

  submitClicked() {
    this.currentItem.status = 'Pending';
    this.education.push(this.currentItem);
    /** 
     * API call
     */
    this.cancelClicked();
  }

  cancelClicked() {
    this.showDetails = false;
    this.isAddMode = false;
    this.currentItem = educationField;
    this.addEducationField = {
      canEdit: false,
      class: '',
      degree: '',
      grade: '',
      percentage: null,
      yearOfPassing: null,
      certificate: '',
      status: '',
      hrComments: ''
    }
  }

}
