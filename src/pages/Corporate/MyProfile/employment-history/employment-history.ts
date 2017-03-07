import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmploymentInfo } from './employment-history-model';
/*
  Generated class for the EmploymentHistory page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-employment-history',
  templateUrl: 'employment-history.html'
})
export class EmploymentHistoryPage {
  complexForm : FormGroup;
  Employer : EmploymentInfo = new EmploymentInfo();
  showForm: boolean = false;
  isEmployementDetails : boolean = false;
  isDesignation : boolean = false;
  isStartdate : boolean = false;
  isEnddate : boolean = false;
  showLastEmployerForm : boolean = false;
  Employment : string;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public fb: FormBuilder) {
                this.complexForm = fb.group({
                  'empdetails' : [null, Validators.required],
                  'designation' : [null, Validators.required],
                  'currentemp' : [null, Validators.required],
                  'startdate' : [null, Validators.required],
                  'enddate' : [null, Validators.required]
                  })
                this.Employment = 'EmployementHistory';
               }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmploymentHistoryPage');
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  onCloseForm(segment:string) {
    if(segment === 'EmployementHistory')
      this.showForm = false;
    if(segment === 'LastEmployer')
      this.showLastEmployerForm = false;
  }
  onAddForm() {
    this.showForm = true;
    this.Employer.EmployementDetails = '';
    this.Employer.Designation = '';
    this.Employer.CurrentEmployer = true;
    this.Employer.Startdate = '';
    this.Employer.Enddate = '';
  }
  onSave() {
      console.log('data saved sucessfully');
  }
  editEmployementDetails() {
    this.Employer.EmployementDetails = 'Eternus solutions';
    this.Employer.Designation = 'System Executive';
    this.Employer.CurrentEmployer = true;
    //this.Employer.Startdate = '23/06/2010';
    //this.Employer.Enddate = '23/06/2012';
    this.showForm = true;
  }
  editLastEmployer() {
    this.showLastEmployerForm = true;
  }
  onLastEmpSegment() {
    this.showForm = true;
  }
  onEmpHistorySegment() {
    this.showForm = false;
  }
}
