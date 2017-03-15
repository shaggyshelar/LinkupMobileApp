import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { AuthService } from '../../providers/index';
import { MyTimesheetPage } from '../Timesheet/my-timesheet/my-timesheet';
import { MyLeavesPage } from '../LeaveManagement/my-leaves/my-leaves';
import { Chart } from 'chart.js';
import { ModalController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('pieMyTimesheetCanvas') pieMyTimesheetCanvas;
  @ViewChild('pieTeamTimesheetCanvas') pieTeamTimesheetCanvas;
  @ViewChild('Slides') slides: Slides;

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
    public modalCtrl: ModalController) {
    this.isSearchShow = false;
    this.initializeItems();
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
    this.createCharts();
  }
  gotoMyLeaves() {
    this.navCtrl.push(MyLeavesPage);
  }
  gotoMyTimesheet() {
    this.navCtrl.push(MyTimesheetPage);
  }

  calculatePieChartParams() {
    var total = parseInt(this.myTimesheetApproved + this.myTimesheetPending + this.myTimesheetSubmitted + this.myTimesheetPartiallyApproved + this.myTimesheetNotSubmitted + this.myTimesheetRejected);
    this.pieParams[0] = (parseInt(this.myTimesheetApproved)/total)*100;
    this.pieParams[1] = (parseInt(this.myTimesheetSubmitted)/total)*100;
    this.pieParams[2] = (parseInt(this.myTimesheetPartiallyApproved)/total)*100;
    this.pieParams[3] = (parseInt(this.myTimesheetNotSubmitted)/total)*100;
    this.pieParams[4] = (parseInt(this.myTimesheetRejected)/total)*100;
    this.pieParams[5] = (parseInt(this.myTimesheetPending)/total)*100;
  }
}
