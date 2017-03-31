import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';

import { LogNewTicketPage } from '../log-new-ticket/log-new-ticket';
import { LogATicketService } from '../index';

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
  isItemClick: boolean
  constructor(public navCtrl: NavController, public navParams: NavParams
    , public actionSheetController: ActionSheetController
    , public logTicketService: LogATicketService
    , public loadingCtrl: LoadingController
  ) {
    this.isItemClick = false;
    this.ticketData = [];
  }

  ionViewDidLoad() {
    var loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loader.present().then(() => {
      this.logTicketService.getMyTickets().subscribe(res => {
        this.ticketData = res;
        loader.dismiss();
      }, err => {
        console.log(err);
        loader.dismiss();
      });
    });
  }

  onTicketClick(ticketEntry) {
    /** TODO : View Tickets  */
    if (this.isItemClick === true)
      return;
    var readOnly = ticketEntry.Status == 'Resolved' ? true : false;
    this.navCtrl.push(LogNewTicketPage, { readOnly: readOnly, Id: ticketEntry.Id });
  }

  onOptionsClick(ticketEntry) {
    this.isItemClick = true;
    let actionSheet = this.actionSheetController.create({
      title: 'Options',
      buttons: [
        {
          text: 'Close',
          icon: 'close',
          handler: () => {
            console.log('Close Ticket');
            this.isItemClick = false;
            /** API call */
          }
        },
        {
          text: 'Reopen',
          icon: 'open',
          handler: () => {
            console.log('Reopen Ticket');
            this.isItemClick = false;
            /** API call */
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel');
            this.isItemClick = false;
          }
        },
      ]
    });
    actionSheet.present();
  }

  addFabClicked() {
    /** TODO : New Ticket  */
    this.navCtrl.push(LogNewTicketPage, { readOnly: false });
  }

}
