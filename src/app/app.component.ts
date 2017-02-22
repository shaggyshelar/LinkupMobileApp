import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, Network } from 'ionic-native';
import { LoadingController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
// Leave Management
import { ApplyForLeavePage } from '../pages/LeaveManagement/apply-for-leave/apply-for-leave';
import { HolidaysPage } from '../pages/LeaveManagement/holidays/holidays';
import { LeaveApprovalPage } from '../pages/LeaveManagement/leave-approval/leave-approval';
import { MyLeavesPage } from '../pages/LeaveManagement/my-leaves/my-leaves';

import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/index';
import { Subscription } from 'rxjs/Subscription';

export interface PageInterface {
  title: string;
  component: any;
  icon?: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public showLeaveSubmenus: boolean = true;
  public showTimesheetSubmenus: boolean = false;
  rootPage: any = LoginPage;
  isAuthenticated: boolean = false;
  loader: any;
  activePage: any;
  disconnectSubscription: any;
  isDisconnected: boolean = false;
  pages: Array<{ title: string, component: any, icon: string }>;
  subscription: Subscription;
  leavePages: PageInterface[] = [];
  timesheetPages: PageInterface[] = [];

  constructor(public platform: Platform, public auth: AuthService, public loadingCtrl: LoadingController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'Holidays', component: HolidaysPage, icon: 'calendar' },
      { title: 'My Leaves', component: MyLeavesPage, icon: 'contacts' },
      { title: 'Apply Leave', component: ApplyForLeavePage, icon: 'map' },
      { title: 'Approve Leave', component: LeaveApprovalPage, icon: 'information-circle' }
    ];

    this.activePage = this.pages[0];
    this.subscription = this.auth.onAuthStatusChanged$.subscribe(
      isAuthenticated => {
        if (isAuthenticated == "true") {
          this.isAuthenticated = true;
          this.rootPage = HomePage;
        } else {
          this.isAuthenticated = false;
          this.rootPage = LoginPage;
        }
      });
  }

  onLogout(): void {
    this.auth.logout();
  }

  initializeApp() {
    this.presentLoading();
    this.isAuthenticated = this.auth.isAuthenticated();
    if (this.auth.isAuthenticated()) {
      this.rootPage = HomePage;
    } else {
      this.rootPage = LoginPage;
    }
    this.loader.dismiss();
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  ionViewDidLoad() {
    this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
      this.isDisconnected = true;
    });
  }

  ionViewWillUnload() {
    this.disconnectSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  openPage(page) {
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page) {
    return page == this.activePage;
  }

  showLeaveMenu() {
    if (this.showLeaveSubmenus) {
      this.leavePages = [
        { title: 'Holidays', component: HolidaysPage, icon: 'calendar' },
        { title: 'My Leaves', component: MyLeavesPage, icon: 'contacts' },
        { title: 'Apply Leave', component: ApplyForLeavePage, icon: 'map' },
        { title: 'Approve Leave', component: LeaveApprovalPage, icon: 'information-circle' }
      ];
      this.showLeaveSubmenus = false;
    }
    else {
      this.leavePages = [];
      this.showLeaveSubmenus = true;
    }
  }
}
