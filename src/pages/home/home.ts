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
  public myLeaveTaken: number = 0;
  public myLeaveBalance: number = 0;
  public myTimesheetApproved: number = 0;
  public myTimesheetPending: number = 0;
  public myTimesheetSubmitted: number = 0;
  public myTimesheetPartiallyApproved: number = 0;
  public myTimesheetNotSubmitted: number = 0;
  public myTimesheetRejected: number = 0;
  public dasboardStats: any;

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
    this.dasboardStats = JSON.parse(localStorage.getItem('loggedInUserDetails')).DashboardStats;
    if (this.dasboardStats) {
      if (this.dasboardStats.MyTimesheetStats) {
        this.myTimesheetApproved = this.dasboardStats.MyTimesheetStats.Approved;
        this.myTimesheetPending = this.dasboardStats.MyTimesheetStats.Pending;
        this.myTimesheetSubmitted = this.dasboardStats.MyTimesheetStats.Submitted;
        this.myTimesheetPartiallyApproved = this.dasboardStats.MyTimesheetStats.PartiallyApproved;
        this.myTimesheetNotSubmitted = this.dasboardStats.MyTimesheetStats.NotSubmitted;
        this.myTimesheetRejected = this.dasboardStats.MyTimesheetStats.Rejected;
      }
      if (this.dasboardStats.MyLeavesStats) {
        this.myLeaveBalance = this.dasboardStats.MyLeavesStats.Balance;
        this.myLeaveTaken = this.dasboardStats.MyLeavesStats.Taken;
      }
      if (this.dasboardStats.TeamsTimesheetStats) {

      }
      if (this.dasboardStats.TeamsLeaveStats) {

      }
      //TODO: Calculation for Pie Chart According to values
    }
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
            data: [48, 1, 2, 0, 0, 4],
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
}
