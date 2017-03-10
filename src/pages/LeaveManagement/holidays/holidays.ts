import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
/** Module Level Dependencies */
import { HolidayService } from '../services/holiday.service';
import { Holiday } from '../models/holiday';
import { MyEvent } from '../models/holiday';
import { SpinnerService } from '../../../providers/index'

import * as moment from 'moment/moment';
import { HolidaysFilterPage } from '../holidays-filter/holidays-filter';
import { HolidayDetailsPage } from '../holiday-details/holiday-details';
/*
  Generated class for the Holidays page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  selector: 'page-holidays',
  templateUrl: 'holidays.html',
  providers:[HolidayService,SpinnerService]
})
export class HolidaysPage {
  events: any[];
  calenderoption : any;
  holidaysObs: Holiday[];
  holidayList: any;
  pendingHoliday: any;
  public isDescending: boolean=true;
  // eventDay: MyEvent;
  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private holidayService: HolidayService,
  public spinnerService:SpinnerService,
  public alertCtrl: AlertController,
  public actionSheetCtrl: ActionSheetController,
  public modalCtrl: ModalController) {
    // this.events = [
    //    {
    //     "title": "17 Grapes Daily call",
    //     "start": "2017-02-27T09:30:00",
    //     "end": "2017-02-27T10:00:00",
    //     "color":"red",
    //   },
    //    {
    //     "title": "CPS Daily scrum",
    //     "start": "2017-02-27T11:00:00",
    //     "end": "2017-02-27T11:30:00",
    //     "color":"orange",
    //   },
    //    {
    //     "title": "ECS BU Meeting",
    //     "start": "2017-02-27T12:00:00",
    //     "end": "2017-02-27T12:30:00",
    //     "color":"green",
    //   },

    // ];
  
  }

  ionViewDidLoad() {
    this.getHolidays();
  }

  /*Get Holiday List */
  getHolidays()
  {
    this.holidayList = [];
    this.pendingHoliday = [];
    this.events = [];
    this.spinnerService.createSpinner('Please wait..');
     this.holidayService.getHolidays().subscribe((res:any) => {
       this.spinnerService.stopSpinner();
        this.holidaysObs = res;
        this.holidaysObs.reverse();
          for (let i = 0; i < res.length; i++) {
          res[i].start = moment(res[i].HolidayDate);
         if ((moment(res[i].start).diff(moment(), 'days')) > -1) {
          this.pendingHoliday.push(res[i]);
        }
      }
      this.holidayService.setPendingHolidaysCount(this.pendingHoliday.length.toString());
      this.getCalandarEvents();
    },
    error =>{
      this.spinnerService.stopSpinner();
    });
  }

  /*Create events to show on calendar */
  getCalandarEvents()
  {
     for (let i = 0; i < this.holidaysObs.length; i++) {
       var event:MyEvent = new MyEvent();
       var holidaytype:any = this.holidaysObs[i].HolidayType;
         event.start  = moment(this.holidaysObs[i].HolidayDate).format('YYYY-MM-DD');
         event.end = moment(this.holidaysObs[i].HolidayDate).format('YYYY-MM-DD');;
         event.title = this.holidaysObs[i].Title;
         event.HolidayType = this.holidaysObs[i].HolidayType;
         event.WeekDay = this.holidaysObs[i].WeekDay;
         event.HolidayDescription = this.holidaysObs[i].HolidayDescription;
         if(holidaytype.Value == 'Floating')
         event.color = 'orange';
         else
         event.color = 'red';
         event.allDay = true;
         this.events.push(event);
        }
  }

  handleEventClick(event:any){
     let alert = this.alertCtrl.create({
      title: 'Holiday',
      subTitle: '<b>Title: </b>' + event.calEvent.title + '<br/>'+'<b>Holiday Description: </b>'+ event.calEvent.HolidayDescription +
                '<br/>'+ '<b>Holiday Type: </b>' + event.calEvent.HolidayType.Value + '<br/>' + '<b>Week Day: </b>' + event.calEvent.WeekDay,
      buttons: ['OK']
    });
    alert.present();
  }
  onFilter() {
    let modal = this.modalCtrl.create(HolidaysFilterPage);
    modal.present();
  }
  onSort() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sort Your Holidays',
      buttons: [
        {
          text: 'Date Ascending',
          role: 'date ascending',
          handler: () => {
            if(this.isDescending === false) {
              this.pendingHoliday.reverse();
              this.isDescending = true;
            }
          }
        },{
          text: 'Date Descending',
          role: 'date descending',
          handler: () => {
            if(this.isDescending) {
              this.pendingHoliday.reverse();
              this.isDescending = false;
            }
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    actionSheet.present();
  }
  onHolidayDetails(holidayData :any) {
    this.navCtrl.push(HolidayDetailsPage,{holiday: holidayData });
  }
}
