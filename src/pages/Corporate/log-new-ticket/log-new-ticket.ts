import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';

import { LogATicketMasterService } from '../../../providers/shared/master/logATicketMaster.service';
// import { PriorityService } from '../../../providers/shared/master/priority.service';
import { LogATicketService } from '../index';
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

  comments: any[];
  validationMessage: string;
  model: any;
  hideDate: boolean = true;

  validateTicket: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public formBuilder: FormBuilder
    , public logTicketService: LogATicketService
    , public loadingCtrl: LoadingController
    , public masterService: LogATicketMasterService
    // , public priorityMaster: PriorityService
  ) {
    this.department = [];
    this.priority = [];
    this.concern = [];
    this.comments = this.initStubComments().reverse();
    this.model = {};
    this.validateTicket = formBuilder.group({
      department: [{ value: null, disabled: this.navParams.data.readOnly }, Validators.compose([Validators.required])],
      priority: [{ value: null, disabled: this.navParams.data.readOnly }, Validators.compose([Validators.required])],
      concern: [{ value: null, disabled: this.navParams.data.readOnly }, Validators.compose([Validators.required])],
      description: [{ value: null, disabled: this.navParams.data.readOnly }, Validators.compose([Validators.minLength(3), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.navParams.data.readOnly ? this.getDataForView(this.navParams.data.Id) : null;
    !this.navParams.data.readOnly ? this.getMasterData() : null;
  }

  getDataForView(id) {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.logTicketService.getMyTicket(id).subscribe(res => {
        this.model = res;
        loader.dismiss();
      }, err => {
        loader.dismiss();
      });
    });
  }

  getMasterData() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present().then(() => {
      this.masterService.getDepartmentTypes().subscribe(res => {
        this.department = res;
      }, err => {
        console.log(err);
        loader.dismiss();
      });

      this.masterService.getPriorityTypes().subscribe(res => {
        this.priority = res;
        // loader.dismiss();
      }, err => {
        console.log(err);
        loader.dismiss();
      });
    });
    loader.dismiss();
  }

  departmentChanged(event) {
    this.model['department'] = this.department.find(element => {
      return element.Value.toLowerCase().indexOf(event.toLowerCase() > -1);
    });
    console.log('dept =>', event, this.model);

    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present().then(() => {
      this.masterService.getConcernTypes().subscribe(res => {
        this.concern = res;
        loader.dismiss();
      }, err => {
        console.log(err);
        loader.dismiss();
      });
    });
  }
  priorityChanged(event) {
    this.model['priority'] = this.priority.find(element => {
      return element.Name.toLowerCase().indexOf(event.toLowerCase() > -1);
    });
  }
  concernChanged(event) {
    this.model['concern'] = this.concern.find(element => {
      return element.Value.toLowerCase().indexOf(event.toLowerCase() > -1);
    });
  }
  descriptionChanged() {
    this.model['description'] = this.validateTicket.value.description;
  }

  submit(value, isValid) {
    /** TODO : Update API call via service */
    console.log('form value => ', value, 'isValid => ', isValid);
  }

  /**
   * TODO : 
   * 1. Based on navParams decide if component is View/Edit mode
   * 2. Based on mode show/hide submit button, comments and enable/disable i/p fields
   * 3. Based on mode decide API call to make via service
   * 4. Write proper methods in service for getMyTicket, getTicketById, getComments, New Tickets (post), Edit Tickets (put)
   */

  initStubComments() {
    return [
      {
        ID: 1,
        Title: 'Some title',
        Comments: 'Some comment like, "A quick brown fox jumps over the lazy dog."',
        Status: 'Status',
        Department: {
          Value: 'IT',
          ID: 2
        },
        Date: moment().subtract(2, 'days').toISOString(),
        ServiceDeskId: 'SD21223425',
        User: {
          Id: 100,
          Name: 'Bob Marley'
        }
      },
      {
        ID: 2,
        Title: 'Some title',
        Comments: 'Some comment.',
        Status: 'Status',
        Department: {
          Value: 'IT',
          ID: 2
        },
        Date: moment().subtract(1, 'days').toISOString(),
        ServiceDeskId: 'SD21223425',
        User: {
          Id: 233,
          Name: 'Elvis Presley'
        }
      },
      {
        ID: 3,
        Title: 'Some title',
        Comments: 'Some comment like, "A quick brown fox needs a muffin that was stole by the lazy dog."',
        Status: 'Status',
        Department: {
          Value: 'IT',
          ID: 2
        },
        Date: moment().toISOString(),
        ServiceDeskId: 'SD21223425',
        User: {
          Id: 100,
          Name: 'Bob Marley'
        }
      }
    ];
  }
}