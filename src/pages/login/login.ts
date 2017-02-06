import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/index';
import { User } from './user.model';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  @ViewChild(Nav) nav: Nav;

  login: { username?: string, password?: string } = {};
  public errorMessage: string;
  showError: boolean = false;
  public model: User;
  submitted = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
    this.model = new User('', '');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      //this.userData.login(this.login.username);
      //this.navCtrl.push(HomePage);

      this.authService.authenticate(this.model)
        .subscribe(
        results => {
          this.getLoggedInUserPermission();
        },
        error => {
          this.showError = true;
          this.errorMessage = error.message;
        });
    }
  }

  getLoggedInUserPermission(): void {
    this.authService.getLoggedInUserPermission()
      .subscribe(
      results => {
        //this._router.navigate(['/']);
        this.navCtrl.push(HomePage);
      },
      error => {
        this.showError = true;
        this.errorMessage = error.message;
      });
  }
  initializeApp() {
    if (localStorage.getItem('accessToken')) {
      this.navCtrl.push(HomePage);
    }
  }

}
