import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LogATicketMasterService } from '../../../providers/shared/master/logATicketMaster.service';
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
  validationMessage: string;
  ticketEntry: any;

  validateTicket: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public formBuilder: FormBuilder
    , public logTicketService: LogATicketService
    , public loadingCtrl: LoadingController
    , public masterService: LogATicketMasterService
  ) {
    this.ticketEntry = {};
    this.validateTicket = formBuilder.group({
      department: [{ value: '', disabled: this.navParams.data.readOnly }, Validators.compose([Validators.required])],
      priority: [{ value: '', disabled: this.navParams.data.readOnly }, Validators.compose([Validators.required])],
      concern: [{ value: '', disabled: this.navParams.data.readOnly }, Validators.compose([Validators.required])],
      description: [{ value: '', disabled: this.navParams.data.readOnly }, Validators.compose([Validators.minLength(3), Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')])]
    });
    this.getMasterData();
  }

  ionViewDidLoad() {
    this.navParams.data.readOnly ? this.getDataForView(this.navParams.data.Id) : null;
  }

  getDataForView(id) {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.logTicketService.getMyTicket(id).subscribe(res => {
        this.ticketEntry = res;
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
        loader.dismiss();
      }, err => {
        console.log(err);
        loader.dismiss();
      });
    });
  }

  departmentChanged(value) {
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

  priorityChanged(value) {
  }

  concernChanged(value) {
  }

  submit(value, isValid) {
    if (isValid && this.navParams.data.Id) {
      var payload = {};
      // Assemble payload object
      // UPDATE API
      this.logTicketService.updateMyTicket(this.navParams.data.Id, payload).subscribe(res => {
        this.navCtrl.pop();
      });
    } else if (isValid) {
      // ADD API
      this.logTicketService.addTicket(payload).subscribe(res => {
        this.navCtrl.pop();
      });
    }
    /** Assemble object, API call */
  }

  /** TODO:
   *  API calls
   *  Validation with API values
   *  Disabled condition in Validation
   */

}