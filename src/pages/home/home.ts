import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/index';
/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public authService: AuthService,
              public modalCtrl: ModalController) { 
    console.log('Is Authenticated =',this.authService.isAuthenticated());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
}
