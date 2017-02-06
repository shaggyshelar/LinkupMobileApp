import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { LoadingController } from 'ionic-angular';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { HomePage } from '../pages/home/home';
// Leave Management
import { ApplyForLeavePage } from '../pages/LeaveManagement/apply-for-leave/apply-for-leave';
import { HolidaysPage } from '../pages/LeaveManagement/holidays/holidays';
import { LeaveApprovalPage } from '../pages/LeaveManagement/leave-approval/leave-approval';
import { MyLeavesPage } from '../pages/LeaveManagement/my-leaves/my-leaves';

import { LoginPage } from '../pages/login/login';
import { Auth } from '../providers/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  loader: any;
  activePage: any;
  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public auth: Auth, public loadingCtrl: LoadingController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Holidays', component: HolidaysPage },
      { title: 'My Leaves', component: MyLeavesPage },
      { title: 'Apply Leave', component: ApplyForLeavePage },
      { title: 'Approve Leave', component: LeaveApprovalPage },
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 },
    ];

    this.activePage = this.pages[0];
  }

  initializeApp() {
    this.presentLoading();
    this.auth.login().then((isLoggedIn) => {
      if (isLoggedIn) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
    });
    this.loader.dismiss();
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page) {
    return page == this.activePage;
  }
}
