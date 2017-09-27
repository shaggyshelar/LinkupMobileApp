import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { SpinnerService, AuthService, EmployeeDiscrepancyService } from '../../providers/index';
import { MyTimesheetPage } from '../Timesheet/my-timesheet/my-timesheet';
import { MyLeavesPage } from '../LeaveManagement/my-leaves/my-leaves';
import { Chart } from 'chart.js';
import { ModalController } from 'ionic-angular';

import { DiscrepancyModalPage } from '../biometric-discrepancy-modal/biometric-discrepancy-modal';
import { StartupNoticeModal } from '../startup-notice-modal/startup-notice-modal';
import { ApplyForLeavePage } from '../LeaveManagement/apply-for-leave/apply-for-leave';

import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [SpinnerService]
})
export class HomePage {
  @ViewChild('pieMyTimesheetCanvas') pieMyTimesheetCanvas;
  @ViewChild('pieTeamTimesheetCanvas') pieTeamTimesheetCanvas;
  @ViewChild('Slides') slides: Slides;

  subscription: Subscription;
  public filters: any[];
  public items: any[];
  public isSearchShow: boolean;
  public myTimesheetPieChart: any;
  public teamTimesheetPieChart: any;
  public myLeaveTaken: string = '0';
  public myLeaveBalance: string = '0';
  public myTimesheetApproved: string = '0';
  public myTimesheetPending: string = '0';
  public myTimesheetSubmitted: string = '0';
  public myTimesheetPartiallyApproved: string = '0';
  public myTimesheetNotSubmitted: string = '0';
  public myTimesheetRejected: string = '0';
  public dasboardStats: any;
  public pieParams: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: AuthService,
    public discrepancyService: EmployeeDiscrepancyService,
    public spinner: SpinnerService,
    public modalCtrl: ModalController) {
    this.isSearchShow = false;
    this.subscription = this.authService.onAuthStatusChanged$.subscribe(
      isAuthenticated => {
        if (isAuthenticated == "true") {
          this.initializeItems();
        }
      });
  }

  initializeItems() {

    this.items = [
      'Leaves',
      'Timesheets',
      'Appriasal',
      'Holiday',
      'Skill',
      'Ticket'
    ];
    this.myTimesheetApproved = localStorage.getItem('myTimesheetApproved') || '0';
    this.myTimesheetPending = localStorage.getItem('myTimesheetPending') || '0';
    this.myTimesheetSubmitted = localStorage.getItem('myTimesheetSubmitted') || '0';
    this.myTimesheetPartiallyApproved = localStorage.getItem('myTimesheetPartiallyApproved') || '0';
    this.myTimesheetNotSubmitted = localStorage.getItem('myTimesheetNotSubmitted') || '0';
    this.myTimesheetRejected = localStorage.getItem('myTimesheetRejected') || '0';
    this.myLeaveBalance = localStorage.getItem('myLeaveBalance') || '0';
    this.myLeaveTaken = localStorage.getItem('myLeaveTaken') || '0';

    //Calculation for Pie Chart According to values
    this.calculatePieChartParams();

    // this.checkDiscrepancies();
  }
  showSearch() {
    this.isSearchShow = true;
  }
  createCharts() {
    this.myTimesheetPieChart = new Chart(this.pieMyTimesheetCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: [
          "Approved",
          "Submitted",
          "P-Approved",
          "N-Submitted",
          "Rejected",
          "Pending"
        ],
        datasets: [
          {
            data: this.pieParams,
            backgroundColor: [
              "#79B334",
              "#7DC6E4",
              "#9AE373",
              "#DBE21C",
              "#E49F5A",
              "#CC6628"
            ],
            hoverBackgroundColor: [
              "#79B334",
              "#7DC6E4",
              "#9AE373",
              "#DBE21C",
              "#E49F5A",
              "#CC6628"
            ]
          }]
      }
    });
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() == '') {
      this.filters = [];
    }
    if (val && val.trim() != '') {
      this.filters = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  onCancel(ev) {
    this.filters = [];
    this.isSearchShow = false;
  }
  onClear(ev) {
    this.filters = [];
  }
  ionViewDidLoad() {
    this.authService.getCurrentUserDetails();
    this.createCharts();
    this.initializeItems();
    this.checkDiscrepancies()
  }
  gotoMyLeaves() {
    this.navCtrl.push(MyLeavesPage);
  }
  gotoMyTimesheet() {
    this.navCtrl.push(MyTimesheetPage);
  }

  calculatePieChartParams() {
    this.pieParams[0] = parseInt(this.myTimesheetApproved);
    this.pieParams[1] = parseInt(this.myTimesheetSubmitted);
    this.pieParams[2] = parseInt(this.myTimesheetPartiallyApproved);
    this.pieParams[3] = parseInt(this.myTimesheetNotSubmitted);
    this.pieParams[4] = parseInt(this.myTimesheetRejected);
    this.pieParams[5] = parseInt(this.myTimesheetPending);
  }
  checkDiscrepancies() {
    this.checkBiometricDiscrepancy();
    this.checkStartupNotice();
  }

  checkBiometricDiscrepancy() {
    let response = [], blockingModal = false;
    this.spinner.createSpinner('Please wait...');
    this.discrepancyService.getEmployeeDiscrepancy().subscribe(res => {
      if (res.length > 0) {
        res.forEach(element => {
          response.push(element);
        });
        localStorage.setItem('biometricDiscrepancyPresent', 'true');
        localStorage.setItem('blockHardwareBackButton', 'true');
        blockingModal = true;

        this.spinner.stopSpinner();
        this.showBiometricDiscrepancyModal(response,blockingModal);
      } else if (res.length == 0) {
        localStorage.removeItem('biometricDiscrepancyPresent');
      }
      this.spinner.stopSpinner();
    }, err => {
      this.spinner.stopSpinner();
    });
  }
  showBiometricDiscrepancyModal(data, blockingModal) {
    let modal = this.modalCtrl.create(DiscrepancyModalPage, data, {showBackdrop: false, enableBackdropDismiss: !blockingModal});
    modal.onDidDismiss(data => {
      if (data.wasLeaveTaken && data.date != null)
        this.navCtrl.push(ApplyForLeavePage, { date: data.date });
    });
    modal.present();
  }

  checkStartupNotice() {
    let data;
    data = {
      pageDetails: {
        allowDismiss: true,
        redirectTo: {
          url: 'http://linkup.eternussolutions.com',
          text: ''
        },
        pageTitle: 'XYZ Notice',
        message: 'Please make a note of this notice'
      },
      pageFields: [
        {
          key: 'email',
          type: 'input',
          templateOptions: {
            type: 'email',
            label: 'Email address',
            placeholder: 'Enter email'
          }
        }, {
          key: 'name',
          type: 'input',
          templateOptions: {
            type: 'text',
            label: 'Name',
            placeholder: 'Enter name'
          }
        }, {
          key: 'candy',
          type: 'select',
          defaultValue: 'milky_way',
          templateOptions: {
            label: 'Favorite Candy',
            options: [
              { label: 'Snickers', value: 'snickers' },
              { label: 'Baby Ruth', value: 'baby_ruth' },
              { label: 'Milky Way', value: 'milky_way' }
            ]
          }
        }]
    };
    data = null;
    if(data != null)
    this.showNoticeModal(data);
    /**
     * input types : text, date, datetime, time, radio, checkbox, dropdown
     */
  }
  showNoticeModal(data) {
    let noticeModal = this.modalCtrl.create(StartupNoticeModal, data, {showBackdrop: false, enableBackdropDismiss: data.pageDetails.allowDismiss});
    noticeModal.onDidDismiss(data => {
      console.log(data);
    });
    noticeModal.present();
  }

}
