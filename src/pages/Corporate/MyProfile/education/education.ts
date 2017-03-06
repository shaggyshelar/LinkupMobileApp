import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PercentValidator } from './percent-validatior';
import { YearValidator } from './year-validator';

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

  educationForm : FormGroup;
  

  /** From API call for Master */
  classDDL: any[] = ['SSC', 'HSC', 'Diploma', 'Graduation', 'Post-Graduation'];
  gradeDDL: any[] = ['Distinction', 'First Class', 'Second Class', 'Pass'];

  constructor(public navCtrl: NavController
  , public navParams: NavParams
  , private formBuilder: FormBuilder
  ) {

    /** API call to show list */
    this.education = [
      {
        canEdit: false,
        class: 'Graduation',
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

    this.educationForm = this.formBuilder.group({
      class:['',Validators.compose([Validators.required])],
      degree:['',Validators.compose([Validators.minLength(3), Validators.required])],
      grade:['',Validators.compose([Validators.required])],
      percentage:[null,Validators.compose([Validators.minLength(2), Validators.maxLength(3), Validators.required, PercentValidator.isValid])],
      yearOfPassing: [null,Validators.compose([Validators.minLength(4),Validators.maxLength(4), Validators.required, YearValidator.isValid])],
      certificate: ['',Validators.compose([Validators.minLength(3), Validators.required])]
    });
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
      this.isDisabled = item.status !== 'Pending' ? false : true;
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
    return this.currentItem.status === 'Pending' ? false : true;
  }

  submitClicked(item) {
    item.status = 'Pending';
    this.education.push(item);
    console.log('controls=> ',this.educationForm.controls);
    console.log('ok=> ', item);
    /** 
     * API call
     */
    this.cancelClicked();
    this.educationForm.reset();
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
    };
    this.educationForm.reset();
  }

}
