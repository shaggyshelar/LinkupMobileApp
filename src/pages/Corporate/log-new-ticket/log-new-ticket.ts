import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectValidator } from './select-Validator'
/*
  Generated class for the LogNewTicket page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-log-new-ticket',
  templateUrl: 'log-new-ticket.html'
})
export class LogNewTicketPage {
  department: any[];
  priority: any[];
  concern: any[];
  validationMessage: string;
  ticketEntry: any;

  validateTicket: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public formBuilder: FormBuilder
  ) {
    this.ticketEntry = {};
    this.validateTicket = formBuilder.group({
      department: [{ value:'', disabled: this.navParams.data ? false : false }, Validators.compose([Validators.required])],
      priority: [{ value:'', disabled: this.navParams.data ? false : false }, Validators.compose([Validators.required])],
      concern: [{ value:'', disabled: this.navParams.data ? false : false }, Validators.compose([Validators.required])],
      description: [{ value:'', disabled: this.navParams.data ? false : false }, Validators.compose([Validators.minLength(3),Validators.required,Validators.pattern('[a-zA-Z0-9 ]*')])]
    });

    /** Temporary data */
    this.department = [
      {
        Name: 'Select',
        Value: null
      },
      {
        Name: 'Admin',
        Value: { Name: 'Admin', ID: 1 }
      },
      {
        Name: 'IT',
        Value: { Name: 'IT', ID: 2 }
      },
      {
        Name: 'Finance',
        Value: { Name: 'Finance', ID: 3 }
      },
      {
        Name: 'HR',
        Value: { Name: 'HR', ID: 4 }
      },
      {
        Name: 'Linkup Support',
        Value: { Name: 'Linkup Support', ID: 5 }
      },
    ];
    this.priority = [
      {
        Name: 'Select',
        Value: null
      },
      {
        Name: 'Low',
        Value: { Name: 'Low', ID: 1 }
      },
      {
        Name: 'Normal',
        Value: { Name: 'Normal', ID: 2 }
      },
      {
        Name: 'High',
        Value: { Name: 'High', ID: 3 }
      }
    ];
    this.concern = [
      {
        Name: 'Select',
        Value: null
      },
      {
        Name: 'Cleaning',
        Value: { Name: 'Cleaning', ID: 1 }
      },
      {
        Name: 'Desk Change',
        Value: { Name: 'Desk Change', ID: 2 }
      },
      {
        Name: 'AC',
        Value: { Name: 'AC', ID: 3 }
      }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogNewTicketPage');
    /** TODO:
     *  New Ticket : Get Department, Priority from master
     *  Edit Ticket : Get data from navParams, assign to this.ticketEntry
     */
  }

  departmentChanged(value) {
    console.log(value);
    /** TODO: API to get Concern from Master */
  }

  priorityChanged(value) {
    console.log(value);
  }

  concernChanged(value) {
    console.log(value);
  }

  submit(value, isValid) {
    console.log(value, isValid);
    /** Assemble object for API call */
  }

  /** TODO:
   *  API calls
   *  Validation with API values
   *  Disabled condition in Validation
   */

}
