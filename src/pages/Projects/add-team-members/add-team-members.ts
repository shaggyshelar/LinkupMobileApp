import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

import { EmployeeService } from '../index';
import { SpinnerService } from '../../../providers/index';
import { ToastService } from '../../../providers/shared/services/toast.service';

/*
  Generated class for the AddTeamMembers page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-team-members',
  templateUrl: 'add-team-members.html',
  providers: [EmployeeService, SpinnerService, ToastService]
})
export class AddTeamMembersPage {

  empList: any[];
  suggestionList: any[];
  selectedTeam: any[];
  showList: boolean;
  searchTerm: string;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public empService: EmployeeService
    , public spinnerService: SpinnerService
    , public toastService: ToastService
  ) {
    this.suggestionList = [];
    this.selectedTeam = [];
    this.showList = false;
    this.searchTerm = '';
  }

  ionViewDidLoad() {
    this.spinnerService.createSpinner('Please Wait...');
    this.empService.getActiveEmployeeList().subscribe((res) => {
      res.forEach((element) => {
        // if (element.Status.Value == 'Active')
        this.suggestionList.push(element.Employee);
      });
      this.empList = this.suggestionList;
      this.spinnerService.stopSpinner();
    }, err => {
      this.spinnerService.stopSpinner();
      this.toastService.createToast(err);
      console.log("err => ", err);
    });

    this.selectedTeam = this.navParams.get('teamMembers');
  }

  itemClick(record, index) {
    this.selectedTeam.push(record);
    this.suggestionList.splice(index, 1);
    this.showList = false;
    this.searchTerm = '';
  }

  showSuggestionList() {
    this.showList = true;
  }

  okClicked() {
    this.navCtrl.pop();
  }

  onInput(event) {
    this.showList = true;
    this.suggestionList = this.empList;
    var val = event.target.value;
    var filtered;
    if (val && val.trim() != '') {
      filtered = this.suggestionList.filter((item) => {
        return (item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    this.suggestionList = filtered;
  }

  onCancel(event) {

  }
  

  removeMember(member, index) {
    this.suggestionList.push(member);
    this.selectedTeam.splice(index, 1);
  }

}
