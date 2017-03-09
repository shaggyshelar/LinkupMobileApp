
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, Network, InAppBrowser } from 'ionic-native';
import { LoadingController } from 'ionic-angular';
import { HomePage } from '../pages/home/home';


// Leave Management

import { ApplyForLeavePage } from '../pages/LeaveManagement/apply-for-leave/apply-for-leave';
import { HolidaysPage } from '../pages/LeaveManagement/holidays/holidays';
import { MyCalendarPage } from '../pages/my-calendar/my-calendar';
import { ApprovalsPage } from '../pages/approvals/approvals';
import { LeaveApprovalPage } from '../pages/LeaveManagement/leave-approval/leave-approval';
import { MyLeavesPage } from '../pages/LeaveManagement/my-leaves/my-leaves';


// Timesheet

import { MyTimesheetPage } from '../pages/Timesheet/my-timesheet/my-timesheet';
import { EnterTimesheetPage } from '../pages/Timesheet/enter-timesheet/enter-timesheet';
import { ApproveTimesheetPage } from '../pages/Timesheet/approve-timesheet/approve-timesheet';
import { ApprovedTimesheetPage } from '../pages/Timesheet/approved-timesheet/approved-timesheet';
import { TimesheetReportPage } from '../pages/Timesheet/timesheet-report/timesheet-report';
import { BiometricDiscrepancyApprovalPage } from '../pages/Timesheet/biometric-discrepancy-approval/biometric-discrepancy-approval';
import { TimesheetDetailsPage } from '../pages/Timesheet/timesheet-details/timesheet-details';


// Certification
import { MyCertificationPage } from '../pages/Certification/my-certification/my-certification';

// Corporate

import { LogATicketPage } from '../pages/Corporate/log-a-ticket/log-a-ticket';
import { ConferenceBookingPage } from '../pages/Corporate/conference-booking/conference-booking';
import { MyProfilePage } from '../pages/Corporate/MyProfile/my-profile/my-profile';


// Projects

import { ManageMyProjectsPage } from '../pages/Projects/manage-my-projects/manage-my-projects';
import { EmployeeProjectManagementPage } from '../pages/Projects/employee-project-management/employee-project-management';

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
  public showCorporateSubmenus: boolean = false;
  public showCertificationSubmenus: boolean = false;
  public showProjectsSubmenus: boolean = false;
  rootPage: any = LoginPage;
  cordova: any;
  isAuthenticated: boolean = false;
  loader: any;
  IntenetLoader: any;
  alert: any;
  activePage: any;
  disconnectSubscription: any;
  connectSubscription: any;
  isDisconnected: boolean = false;
  subscription: Subscription;
  leavePages: PageInterface[] = [];
  timesheetPages: PageInterface[] = [];
  corporatePages: PageInterface[] = [];
  certificationPages: PageInterface[] = [];
  projectsPages: PageInterface[] = [];
  pages: PageInterface[] = [];
  userDetail: any;
  profileImageSrc: any;
  userName: string;
  designation: string;
  empID: string;

  constructor(public platform: Platform, public auth: AuthService, public loadingCtrl: LoadingController) {
    this.initializeApp();


    //this.activePage = this.pages[0];

    this.subscription = this.auth.onAuthStatusChanged$.subscribe(
      isAuthenticated => {
        if (isAuthenticated == "true") {
          this.isAuthenticated = true;
          this.rootPage = HomePage;
          this.toggleLeaveMenu();
          this.toggleTimesheetMenu()
          this.toggleCertificationMenu();
          this.toggleCorporateMenu();
          this.toggleProjectsMenu();
          this.loadUserDetails();
        } else {
          this.isAuthenticated = false;
          this.rootPage = LoginPage;
        }
      });
  }

  onLogout(): void {
    this.auth.logout();
  }

  loadUserDetails(): void {
    this.userDetail = this.auth.getCurrentUser();
    if (this.userDetail) {
      this.userName = this.userDetail.FirstName + ' ' + this.userDetail.LastName;
      this.designation = this.userDetail.Designation.Value;
      this.empID = this.userDetail.EmpID;
      if (this.userDetail.ProfilePictureName) {
        this.profileImageSrc = 'http://192.168.100.153:202/Profile%20Picture%20Library/' + this.userDetail.ProfilePictureName + '.JPG';
      } else {
        this.profileImageSrc = 'assets/img/default-user.jpg';
      }
    }
  }

  initializeApp() {
    this.presentLoading();
    this.isAuthenticated = this.auth.isAuthenticated();
    if (this.auth.isAuthenticated()) {
      this.rootPage = HomePage;
      this.loadUserDetails();
    } else {
      this.rootPage = LoginPage;
    }
    this.pages = [
      { title: 'My Calendar', component: MyCalendarPage, icon: 'md-calendar' },
      { title: 'Approvals', component: ApprovalsPage, icon: 'md-checkbox-outline' },
      { title: 'Timesheets', component: MyTimesheetPage, icon: 'md-clock' },
    ];
    this.loader.dismiss();
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();

      //       Intenet check
      //       this.internetChecking();
      //       this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
      //         this.isDisconnected = true;
      //         this.internetChecking();
      //       });
      //       this.disconnectSubscription.unsubscribe();

      //       this.connectSubscription = Network.onConnect().subscribe(() => {
      //         this.IntenetLoader.dismiss();
      //       });
      //       this.connectSubscription.unsubscribe();
    });
  }

  ionViewDidLoad() {
    // this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
    //   this.isDisconnected = true;
    // });
  }

  ionViewWillUnload() {
    //this.disconnectSubscription.unsubscribe();
    //this.connectSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({

      content: "Please wait..."

    });
    this.loader.present();
  }
  internetChecking() {
    this.IntenetLoader = this.loadingCtrl.create({
      content: "Connecting to internet..."
    });
    this.IntenetLoader.present();
  }
  openPage(page) {
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  openLinkupWebsite() {
    this.platform.ready().then(() => {
      let browser = new InAppBrowser('http://linkup.eternussolutions.com/', '_system');
    });
  }

  checkActive(page) {
    return page == this.activePage;
  }

  viewProfile(): void {
    this.openPage({ component: MyProfilePage });
  }

  toggleLeaveMenu() {
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

  toggleTimesheetMenu() {
    if (this.showTimesheetSubmenus) {
      this.timesheetPages = [

        { title: 'My Timesheets', component: MyTimesheetPage, icon: 'calendar' },
        { title: 'Enter Timesheets', component: EnterTimesheetPage, icon: 'contacts' },
        { title: 'Approve Timesheets', component: ApproveTimesheetPage, icon: 'map' },
        { title: 'Approved Timesheets', component: ApprovedTimesheetPage, icon: 'information-circle' },
        { title: 'Timesheets Report', component: TimesheetReportPage, icon: 'information-circle' },
        { title: 'Biometric Discrepancy Approval', component: BiometricDiscrepancyApprovalPage, icon: 'information-circle' }

      ];
      this.showTimesheetSubmenus = false;
    }
    else {
      this.timesheetPages = [];
      this.showTimesheetSubmenus = true;
    }
  }

  toggleCorporateMenu() {
    if (this.showCorporateSubmenus) {
      this.corporatePages = [

        { title: 'Log A Ticket', component: LogATicketPage, icon: 'calendar' },
        { title: 'Conference Booking', component: ConferenceBookingPage, icon: 'contacts' },
        { title: 'My Profile', component: MyProfilePage, icon: 'person' }

      ];
      this.showCorporateSubmenus = false;
    }
    else {
      this.corporatePages = [];
      this.showCorporateSubmenus = true;
    }
  }

  toggleCertificationMenu() {
    if (this.showCertificationSubmenus) {
      this.certificationPages = [

        { title: 'My Certifications', component: MyCertificationPage, icon: 'calendar' },

      ];
      this.showCertificationSubmenus = false;
    }
    else {
      this.certificationPages = [];
      this.showCertificationSubmenus = true;
    }
  }

  toggleProjectsMenu() {
    if (this.showProjectsSubmenus) {
      this.projectsPages = [

        { title: 'Manage My Projects', component: ManageMyProjectsPage, icon: 'calendar' },
        { title: 'Employee Project Management', component: EmployeeProjectManagementPage, icon: 'contacts' }

      ];
      this.showProjectsSubmenus = false;
    }
    else {
      this.projectsPages = [];
      this.showProjectsSubmenus = true;
    }
  }

}
