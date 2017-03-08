import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { AuthService } from '../../providers/index';

/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

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
          "Rejcted",
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

    this.teamTimesheetPieChart = new Chart(this.pieTeamTimesheetCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: [
          "Approved",
          "Submitted",
          "P-Approved",
          "N-Submitted",
          "Rejcted",
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
    console.log('ionViewDidLoad HomePage');
    this.createCharts();
  }

}
