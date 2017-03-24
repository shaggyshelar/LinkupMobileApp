import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the RecurranceModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-recurrence-modal',
  templateUrl: 'recurrence-modal.html'
})
export class RecurrenceModalPage {
  /** Get with Master API call */
  daysRepeat: any;
  pattern: any[];
  days: any[];
  daysP2: any[];
  weekCount: any[];

  repeatDay: any;
  allWeekdays: boolean;
  isRepeatWithDay: boolean = true;
  dayP2: any;
  isEventEnding: boolean = true;
  isRepeating: boolean = false;
  isEndAfterOccurences: boolean = true;
  occurences: any;
  eventStrtDt: any;
  eventEndDt: any;
  eventOccurences: number;
  months:any[];
  repeatingDays: any[];
  dayOfMonth: any;
  recurAfterMonth: any;
  weekNum: any;
  yearlyMonthRecur: any;
  yearlyDayDateRecur: any;
  yearlyWeekRecue: any;
  yearlyDayRecur: any;
  constructor(public navCtrl: NavController, public navParams: NavParams
  , public viewCtrl: ViewController
  ) {
    this.pattern = [
      'Daily',
      'Weekly',
      'Monthly',
      'Yearly'
    ];
    this.days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    this.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.weekCount= [
      'First',
      'Second',
      'Third',
      'Fourth',
      'Last',
    ];
    this.allWeekdays = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecurranceModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss({data : null});
  }

  radioChnage(repeat) {
    console.log(repeat);
  }

  eventRepeatingChanged() { }

  dailyRepeatingChanged() { }

  monthlyRepeatingChanged() { }

  yearlyRepeatingChanged() { }

  endChanged() { }

  endValuesChanged() { }
}
