import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Holidays page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-holidays',
  templateUrl: 'holidays.html'
})
export class HolidaysPage {
  events: any[];
  calenderoption : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.events = [
       {
        "title": "17 Grapes Daily call",
        "start": "2017-02-27T09:30:00",
        "end": "2017-02-27T10:00:00",
        "color":"red",
      },
       {
        "title": "CPS Daily scrum",
        "start": "2017-02-27T11:00:00",
        "end": "2017-02-27T11:30:00",
        "color":"orange",
      },
       {
        "title": "ECS BU Meeting",
        "start": "2017-02-27T12:00:00",
        "end": "2017-02-27T12:30:00",
        "color":"green",
      },

    ];
    this.calenderoption = {
    fixedWeekCount : false,
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    allDaySlot: false,
    minTime: '07:00:00',
    maxTime: '23:00:00',
    header: {
      left: '',
      center: 'prev, title, next',
      right: 'month,agendaDay,agendaWeek'
    },
    events: [
      {
        "title": "17 Grapes Daily call",
        "start": "2017-27-02T09:30:00",
        "end": "2017-27-02T10:00:00",
      },
       {
        "title": "CPS Daily scrum",
        "start": "2017-27-02T11:00:00",
        "end": "2010-27-02T11:30:00",
      },
    ]
  }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HolidaysPage');
  }

   handleDayClick(event:any){
   console.log('Day clicked' + event);
   
   }
    handleEventClick(event:any){
   console.log('Event clicked' + event);
    }

}
