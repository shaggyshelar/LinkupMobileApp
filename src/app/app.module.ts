import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/dashboard/dashboard';

// // Corporate
// import { LogATicketPage } from '../pages/Corporate/log-a-ticket/log-a-ticket';
// import { ConferenceBookingPage } from '../pages/Corporate/conference-booking/conference-booking';

// // Timesheet
// import { MyTimesheetPage } from '../pages/Timesheet/my-timesheet/my-timesheet';
// import { EnterTimesheetPage } from '../pages/Timesheet/enter-timesheet/enter-timesheet';
// import { ApproveTimesheetPage } from '../pages/Timesheet/approve-timesheet/approve-timesheet';
// import { ApprovedTimesheetPage } from '../pages/Timesheet/approved-timesheet/approved-timesheet';
// import { TimesheetReportPage } from '../pages/Timesheet/timesheet-report/timesheet-report';
// import { BiometricDiscrepancyApprovalPage } from '../pages/Timesheet/biometric-discrepancy-approval/biometric-discrepancy-approval';

import { Auth } from '../providers/auth';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    HomePage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    HomePage,
    LoginPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Auth]
})
export class AppModule { }
