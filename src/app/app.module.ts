import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import * as jQuery from "jquery";
import { ScheduleModule } from 'primeng/primeng';
(window as any).$ = (window as any).jQuery = jQuery;
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

// Corporate
import { LogATicketPage } from '../pages/Corporate/log-a-ticket/log-a-ticket';
import { ConferenceBookingPage } from '../pages/Corporate/conference-booking/conference-booking';

// Timesheet
import { MyTimesheetPage } from '../pages/Timesheet/my-timesheet/my-timesheet';
import { EnterTimesheetPage } from '../pages/Timesheet/enter-timesheet/enter-timesheet';
import { ApproveTimesheetPage } from '../pages/Timesheet/approve-timesheet/approve-timesheet';
import { ApprovedTimesheetPage } from '../pages/Timesheet/approved-timesheet/approved-timesheet';
import { TimesheetReportPage } from '../pages/Timesheet/timesheet-report/timesheet-report';
import { BiometricDiscrepancyApprovalPage } from '../pages/Timesheet/biometric-discrepancy-approval/biometric-discrepancy-approval';
import { ApproveTimesheetDetailsPage } from '../pages/Timesheet/approve-timesheet-details/approve-timesheet-details';
import { TimesheetDetailsPage } from '../pages/Timesheet/timesheet-details/timesheet-details';
import { DailyTimesheetDetailPage } from '../pages/Timesheet/daily-timesheet-detail/daily-timesheet-detail';
import { ApproveTimesheetFilterPage } from '../pages/Timesheet/approve-timesheet-filter/approve-timesheet-filter';
import { TaskDetailPage } from '../pages/Timesheet/task-detail/task-detail';

// Leave Management
import { ApplyForLeavePage } from '../pages/LeaveManagement/apply-for-leave/apply-for-leave';
import { HolidaysPage } from '../pages/LeaveManagement/holidays/holidays';
import { MyCalendarPage } from '../pages/my-calendar/my-calendar';
import { ApprovalsPage } from '../pages/approvals/approvals';
import { LeaveApprovalPage } from '../pages/LeaveManagement/leave-approval/leave-approval';
import { MyLeavesPage } from '../pages/LeaveManagement/my-leaves/my-leaves';
import { MyLeaveDetailPage } from '../pages/LeaveManagement/my-leave-detail/my-leave-detail';
import { LeaveApprovalDetailPage } from '../pages/LeaveManagement/leave-approval-detail/leave-approval-detail';
import { LeaveApprovalFilterPage } from '../pages/LeaveManagement/leave-approval-filter/leave-approval-filter';
import { MyLeavesFilterPage } from '../pages/LeaveManagement/my-leaves-filter/my-leaves-filter';
import { HolidaysFilterPage } from '../pages/LeaveManagement/holidays-filter/holidays-filter';
import { HolidayDetailsPage } from '../pages/LeaveManagement/holiday-details/holiday-details';
import { LeaveDetailsPage } from '../pages/LeaveManagement/leave-details/leave-details';

// Certification
import { MyCertificationPage } from '../pages/Certification/my-certification/my-certification';

import { ManageMyProjectsPage } from '../pages/Projects/manage-my-projects/manage-my-projects';
import { EmployeeProjectManagementPage } from '../pages/Projects/employee-project-management/employee-project-management';

// Profile
import { AchievementPage } from '../pages/Corporate/MyProfile/achievement/achievement';
import { CertificationPage } from '../pages/Corporate/MyProfile/certification/certification';
import { EducationPage } from '../pages/Corporate/MyProfile/education/education';
import { EmploymentHistoryPage } from '../pages/Corporate/MyProfile/employment-history/employment-history';
import { ExperiencePage } from '../pages/Corporate/MyProfile/experience/experience';
import { MyProfilePage } from '../pages/Corporate/MyProfile/my-profile/my-profile';
import { PersonalInfoPage } from '../pages/Corporate/MyProfile/personal-info/personal-info';
import { ProfileDetailsPage } from '../pages/Corporate/MyProfile/profile-details/profile-details';
import { SkillSetPage } from '../pages/Corporate/MyProfile/skill-set/skill-set';

//HR
import { ResignedEmployeeLeavesPage } from '../pages/HR/resigned-employee-leaves/resigned-employee-leaves';
import { EmployeeLeaveBalancePage } from '../pages/HR/employee-leave-balance/employee-leave-balance';

// Providers
import { Auth } from '../providers/auth';
import { AuthService } from '../providers/index';
import { LeaveService } from '../pages/LeaveManagement/index';
import { HolidayService } from '../pages/LeaveManagement/index';
import { UserService } from '../pages/LeaveManagement/index';
import { MessageService } from '../providers/index';
import { CommonService } from '../providers/index';
import { EmployeeTimesheetService, TimesheetService } from '../pages/Timesheet/index';
import { PhasesService, ProjectService } from '../pages/Projects/index';
import { ClientService } from '../providers/shared/master/client.service';
import { ProjectTypeService } from '../providers/shared/master/projectType.service';
import { ProjectCategoryService } from '../providers/shared/master/projectCategory.service';
import { DeliveryUnitService } from '../providers/shared/master/deliveryUnit.service';
import { DeliveryModelService } from '../providers/shared/master/deliveryModel.service';
import { PriceTypeService } from '../providers/shared/master/priceType.service';

// Direrctives
import { LimitToDirective } from '../providers/shared/directives/limit-to';

// Pipes
import { KebabCasePipe } from '../providers/pipes/kebab-case.pipe';

//Custom Components
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { ExpandableHeaderComponent } from '../components/expandable-header/expandable-header';
import { ExpandableFooterComponent } from '../components/expandable-footer/expandable-footer';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';



@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    HomePage,
    LoginPage,
    LogATicketPage,
    ConferenceBookingPage,
    MyTimesheetPage,
    EnterTimesheetPage,
    ApproveTimesheetPage,
    ApprovedTimesheetPage,
    TimesheetReportPage,
    BiometricDiscrepancyApprovalPage,
    ApproveTimesheetDetailsPage,
    TimesheetDetailsPage,
    DailyTimesheetDetailPage,
    ApproveTimesheetFilterPage,
    TaskDetailPage,
    ApplyForLeavePage,
    HolidaysPage,
    MyCalendarPage,
    ApprovalsPage,
    LeaveApprovalPage,
    LeaveApprovalDetailPage,
    LeaveApprovalFilterPage,
    MyLeavesFilterPage,
    HolidaysFilterPage,
    HolidayDetailsPage,
    MyLeavesPage,
    LeaveDetailsPage,
    MyLeaveDetailPage,
    ManageMyProjectsPage,
    EmployeeProjectManagementPage,
    MyCertificationPage,
    AchievementPage,
    CertificationPage,
    EducationPage,
    EmploymentHistoryPage,
    ExperiencePage,
    MyProfilePage,
    PersonalInfoPage,
    ProfileDetailsPage,
    SkillSetPage,
    ResignedEmployeeLeavesPage,
    EmployeeLeaveBalancePage,
    LimitToDirective,
    KebabCasePipe,
    ProgressBarComponent,
    ExpandableHeaderComponent,
    ExpandableFooterComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ScheduleModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    HomePage,
    LoginPage,
    LogATicketPage,
    ConferenceBookingPage,
    MyTimesheetPage,
    EnterTimesheetPage,
    ApproveTimesheetPage,
    ApprovedTimesheetPage,
    TimesheetReportPage,
    BiometricDiscrepancyApprovalPage,
    ApproveTimesheetDetailsPage,
    TimesheetDetailsPage,
    DailyTimesheetDetailPage,
    ApproveTimesheetFilterPage,
    TaskDetailPage,
    ApplyForLeavePage,
    HolidaysPage,
    MyCalendarPage,
    ApprovalsPage,
    LeaveApprovalPage,
    LeaveApprovalDetailPage,
    LeaveApprovalFilterPage,
    MyLeavesFilterPage,
    HolidaysFilterPage,
    HolidayDetailsPage,
    MyLeavesPage,
    LeaveDetailsPage,
    MyLeaveDetailPage,
    MyCertificationPage,
    ManageMyProjectsPage,
    EmployeeProjectManagementPage,
    AchievementPage,
    CertificationPage,
    EducationPage,
    EmploymentHistoryPage,
    ExperiencePage,
    MyProfilePage,
    PersonalInfoPage,
    ProfileDetailsPage,
    SkillSetPage,
    ResignedEmployeeLeavesPage,
    EmployeeLeaveBalancePage
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    Auth, AuthService, LeaveService, HolidayService, UserService, MessageService, CommonService, LimitToDirective, KebabCasePipe,
    CacheService, EmployeeTimesheetService, ClientService, ProjectTypeService, PriceTypeService, ProjectCategoryService, DeliveryUnitService, DeliveryModelService, PhasesService, ProjectService, TimesheetService,
    { provide: CacheStorageAbstract, useClass: CacheLocalStorage }]
})
export class AppModule { }
