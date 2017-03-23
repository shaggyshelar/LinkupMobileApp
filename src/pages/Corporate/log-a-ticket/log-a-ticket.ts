import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { LogNewTicketPage } from '../log-new-ticket/log-new-ticket';

/*
  Generated class for the LogATicket page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-log-a-ticket',
  templateUrl: 'log-a-ticket.html'
})
export class LogATicketPage {
  ticketData: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams
    , public actionSheetController: ActionSheetController
  ) {
    this.ticketData = [
      {
        "Id": 1,
        "ticket": "Installation NodeJS",
        "Department": "IT",
        "Concern": "Abc",
        "Description": "Abc",
        "Status": "Resolved",
        "Priority": "High",
        "UpdatedBy": "Shril",
        "ResolvedBy": "Shril",
        "CreatedDate": "20-03-2017",
        "UpdatedDate": "22-03-2017",
        "AgeDays": 1
      },
      {
        "Id": 3,
        "ticket": "Installation NodeJS",
        "Department": "IT",
        "Concern": "Abc",
        "Description": "Abc",
        "Status": "Resolved",
        "Priority": "Medium",
        "UpdatedBy": "Shril",
        "ResolvedBy": "Shril",
        "CreatedDate": "20-03-2017",
        "UpdatedDate": "22-03-2017",
        "AgeDays": 10
      },
      {
        "Id": 2,
        "ticket": "Installation NodeJS",
        "Department": "IT",
        "Concern": "Abc",
        "Description": "Abc",
        "Status": "Resolved",
        "Priority": "Low",
        "UpdatedBy": "Shril",
        "ResolvedBy": "Shril",
        "CreatedDate": "20-03-2017",
        "UpdatedDate": "22-03-2017",
        "AgeDays": 12
      },
    ]
  }

  ionViewDidLoad() {
    /** TODO : Tickets API call  */
  }

  onTicketClick(ticketEntry) {
    /** TODO : View Tickets  */
    this.navCtrl.push(LogNewTicketPage, ticketEntry);
  }

  onOptionsClick(ticketEntry) {
    let actionSheet = this.actionSheetController.create({
      title: 'Options',
      buttons: [
        {
          text: 'Close',
          icon: 'close',
          handler: () => {
            console.log('Close Ticket');
          }
        },
        {
          text: 'Reopen',
          icon: 'open',
          handler: () => {
            console.log('Reopen Ticket');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel');
          }
        },
      ]
    });
    actionSheet.present();
  }

  addFabClicked() {
    /** TODO : New Ticket  */
    this.navCtrl.push(LogNewTicketPage);
  }

}
