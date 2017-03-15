
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, Network, InAppBrowser } from 'ionic-native';
import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { Events } from 'ionic-angular';
import { CacheService } from 'ng2-cache/ng2-cache';

// Leave Management

import { ApplyForLeavePage } from '../pages/LeaveManagement/apply-for-leave/apply-for-leave';
import { HolidaysPage } from '../pages/LeaveManagement/holidays/holidays';
import { MyCalendarPage } from '../pages/my-calendar/my-calendar';
import { ApprovalsPage } from '../pages/approvals/approvals';
import { LeaveApprovalPage } from '../pages/LeaveManagement/leave-approval/leave-approval';
import { MyLeavesPage } from '../pages/LeaveManagement/my-leaves/my-leaves';
import { LeaveService } from '../pages/LeaveManagement/services/leave.service';


// Timesheet

import { MyTimesheetPage } from '../pages/Timesheet/my-timesheet/my-timesheet';
import { EnterTimesheetPage } from '../pages/Timesheet/enter-timesheet/enter-timesheet';
import { ApproveTimesheetPage } from '../pages/Timesheet/approve-timesheet/approve-timesheet';
import { ApprovedTimesheetPage } from '../pages/Timesheet/approved-timesheet/approved-timesheet';
import { TimesheetReportPage } from '../pages/Timesheet/timesheet-report/timesheet-report';
import { BiometricDiscrepancyApprovalPage } from '../pages/Timesheet/biometric-discrepancy-approval/biometric-discrepancy-approval';
import { EmployeeTimesheetService } from '../pages/Timesheet/index';
//import { TimesheetDetailsPage } from '../pages/Timesheet/timesheet-details/timesheet-details';


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
import { AuthService, MessageService } from '../providers/index';

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
  pendingCount: number = 0;
  myTimesheetCount: number = 0;
  approvedLeaveCount: number = 0;

  constructor(public platform: Platform,
    public auth: AuthService,
    public leaveService: LeaveService,
    public timesheetService: EmployeeTimesheetService,
    public loadingCtrl: LoadingController,
    public unauthorizedEvent: Events,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public _cacheService: CacheService) {
    this.initializeApp();


    //this.activePage = this.pages[0];

    this.subscription = this.auth.onAuthStatusChanged$.subscribe(
      isAuthenticated => {
        if (isAuthenticated == "true") {
          this.isAuthenticated = true;
          this.intializeMenu();
          this.openPage(this.pages[0]);
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
    this.openPage({ component: LoginPage });
  }

  loadUserDetails(): void {
    this.userDetail = this.auth.getCurrentUser();
    if (this.userDetail) {
      this.userName = this.userDetail.FirstName + ' ' + this.userDetail.LastName;
      this.designation = this.userDetail.Designation.Value;
      this.empID = this.userDetail.EmpID;
      // if (this.userDetail.ProfilePictureName) {
      //   this.profileImageSrc = 'http://linkup.eternussolutions.com/Profile%20Picture%20Library/' + this.userDetail.ProfilePictureName + '.JPG';
      // } else {
      //   this.profileImageSrc = 'assets/img/default-user.jpg';
      // }
      this.profileImageSrc = 'assets/img/default-user.jpg';
    }
  }
  intializeMenu() {
    this.pages = [];
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'ios-home' },
      { title: 'My Calendar', component: MyCalendarPage, icon: 'md-calendar' },
    ];
    if (this.auth.checkPermission('TIMESHEET.APPROVETIMESHEETS.MANAGE') == true || this.auth.checkPermission('LEAVE.APPROVAL.MANAGE') == true) {
      this.pages.push({ title: 'Approvals', component: ApprovalsPage, icon: 'md-checkbox-outline' });
    }

    this.pages.push({ title: 'Timesheets', component: MyTimesheetPage, icon: 'md-clock' });
  }

  initializeApp() {
    this.presentLoading();
    this.isAuthenticated = this.auth.isAuthenticated();
    this.intializeMenu();

    if (this.auth.isAuthenticated()) {
      this.activePage = this.pages[0];
      this.rootPage = HomePage;
      this.loadUserDetails();
    } else {
      this.rootPage = LoginPage;
    }
    this.loader.dismiss();
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
      MessageService.onMessageAdded
        .subscribe((value: any) => {
          //TODO: Parse Error and display message
          let toast = this.toastCtrl.create({
            message: 'Something unexpected happend. Please try again',
            duration: 3000
          });
          toast.present();
        });
      MessageService.onUnauthorized
        .subscribe((value: Object) => {
          this.auth.logout();
          let toast = this.toastCtrl.create({
            message: 'Session Expired. Please Login',
            duration: 3000
          });
          toast.present();
        });

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

  /** Get Pending approval counts */
  getPendingApprovalCount() {
    // this.leaveService.getLeaveByStatus('Pending')
    //   .subscribe(
    //   (res: any) => {
    //   },
    //   error => {
    //   });

    // this.timesheetService.getApproverPendingTimesheets()
    //   .subscribe(
    //   (res: any) => {
    //   },
    //   error => {
    //   });
    // this.pendingCount = 0;
    // if (this._cacheService.exists('PendingLeavesApprovalCount')) {
    //   this.pendingCount = this.pendingCount + parseInt(this._cacheService.get('PendingLeavesApprovalCount'));
    // };
    // if (this._cacheService.exists('PendingTimesheetApprovalCount')) {
    //   this.pendingCount = this.pendingCount + parseInt(this._cacheService.get('PendingLeavesApprovalCount'));
    // }
    this.updateBadges();
  }

  updateBadges() {
    this.pendingCount = 0;
    this.pendingCount = parseInt(localStorage.getItem('PendingLeavesApprovalCount')) + parseInt(localStorage.getItem('PendingTimesheetApprovalCount'));
    this.myTimesheetCount = parseInt(localStorage.getItem('myTimesheetPending'));;
    this.approvedLeaveCount = parseInt(localStorage.getItem('approvedLeaveCount'));



  }

  /** Get base64 Image  */


}
