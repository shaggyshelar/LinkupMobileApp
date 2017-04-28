import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController, Events, AlertController, ToastController } from 'ionic-angular';
import { LeaveDetailsPage } from '../leave-details/leave-details';
import { LeaveService } from '../index';
import { Leave } from '../models/leave';
import { SpinnerService } from '../../../providers/index';
import { LeaveDetail } from '../models/leaveDetail';
import { MessageService } from '../../../providers/index';
import { AuthService } from '../../../providers/index';
import { ApplyLeaveValidation } from '../models/applyLeaveValidation';
import { HolidayService } from '../services/holiday.service';
import { LeaveTypeMasterService } from '../../../providers/shared/master/leaveTypeMaster.service';

/** Third Party Dependencies */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment/moment';
import { Toast } from 'ionic-native';

/*
  Generated class for the ApplyForLeave page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-apply-for-leave',
    templateUrl: 'apply-for-leave.html',
    providers: [LeaveService, SpinnerService, HolidayService, AuthService, LeaveTypeMasterService]
})
export class ApplyForLeavePage {


    public leaveObs: Observable<Leave>;
    public leaveDetObs: Observable<LeaveDetail>;
    public leaveDetail: any;
    public sdate: string;
    public edate: string;
    public minSdate: string;
    public minEdate: string;
    public maxSdate: string;
    public maxEdate: string;
    public startSDate: Date;
    public endEDate: Date;
    numberdays: boolean;
    applyLeaveForm: FormGroup;
    //commentForm: FormGroup;
    addLeaveArr: any[];
    leaveTypeValid: boolean = true;
    leaveID: number;
    StartDate: any = {};
    EndDate: any = {};
    LeaveType: any = {};
    leaveTypes: any[] = [];
    minDate: Date;
    charsLeft: number = 600;
    isLeaveAdded: boolean = false;
    isEndDtEnable: boolean = true;
    isCommentValid: boolean = false;

    leaves: any[];
    model: ApplyLeaveValidation;
    comment: string = '';
    finalLeaveData: any;
    userDetail: any;
    activeProjects: any;
    holidayList: any;
    pendingLeaveCount: any;
    currentUserLeaveDetail: any;
    isValidationMessage: boolean = false;
    validationMessage: string = '';
    itsWeekend: boolean = false;
    submitted: boolean = false;
    hideLeaveList: boolean = false;
    formDisabled: boolean = true;
    isShowLeaveSelection: boolean = false;
    isAllDataDownloaded: boolean = false;
    isAddedLeave: boolean = false;
    selectedLeaveType: string = 'Leave';

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private leaveService: LeaveService,
        private holidayService: HolidayService,
        public spinnerService: SpinnerService,
        public formBuilder: FormBuilder,
        public authService: AuthService,
        public leaveTypeMasterService: LeaveTypeMasterService,
        public actionsheetCtr: ActionSheetController,
        public leaveStatusChanged: Events,
        public modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
    ) {



        this.leaves = [];
        this.addLeaveArr = [];
        this.numberdays = true;
        this.comment = '';

        this.leaves = [];
        this.startSDate = this.navParams.get('date');
        this.endEDate = this.navParams.get('date');
        this.sdate = this.startSDate.toString();
        this.edate = this.endEDate.toString();

        this.leaves = [];
        this.addLeaveArr = [];
        this.numberdays = true;

        var now = moment(this.startSDate);
        this.sdate = moment(now.format(), moment.ISO_8601).format();
        this.edate = moment(now.format(), moment.ISO_8601).format();

        this.model = {
            User: {
                ID: 12345,
                Name: 'Lname Fname'
            },
            numDays: 1,
            leaveType: { id: 0, name: 'Leave', ID: 1, Name: 'Leave', Type: 'Leave', Value: 'Leave' },
            end: this.sdate,
            start: this.edate,
            reason: ''
        };

        //    this.applyLeaveForm = this.formBuilder.group({
        //     leaveType: ['', Validators.compose([Validators.required])],
        //     start: ['', Validators.compose([Validators.required])],
        //     end: ['', Validators.compose([Validators.required])],
        //     reason: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(600), Validators.required])]
        // });

        this.applyLeaveForm = formBuilder.group({
            reason: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(600), Validators.required])]
        });

        //  this.commentForm = formBuilder.group({
        //     comment: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(600), Validators.required])]
        // });


    }

    removeFocus() {
        this.model.reason = this.comment;
    }

    textChanged(event: any) {
        if (this.comment.length > 2)
            this.isCommentValid = true;
        else
            this.isCommentValid = false;

        this.model.reason = this.comment;

    }

    ionViewDidLoad() {
        this.getLeaveAssets();
    }


    /* Get Leave Assets */

    getLeaveAssets() {
        this.spinnerService.createSpinner('Please wait..');
        this.leaveTypeMasterService.getLeaveTypes().subscribe((res: any) => {
            //this.leaves.push({ label: 'Select', value: null });
            for (var index in res) {
                if (res[index].Applicable === 'Yes') {
                    this.leaves.push({ label: res[index].Type, value: res[index] });
                }
            }

            this.leaveService.getActiveProjects().subscribe(res => {
                this.activeProjects = res;
                this.userDetail = this.authService.getCurrentUser();
                let financialYear = moment().year();
                if (moment().month() <= 2) {
                    financialYear = financialYear - 1;
                }
                this.holidayService.getHolidayByFinancialYear(financialYear.toString()).subscribe(res => {
                    this.holidayList = res;
                    this.leaveService.getCurrentUserPendingLeaveCount().subscribe(res => {
                        this.pendingLeaveCount = res;
                        this.leaveService.getLeaveDetails().subscribe((res: any) => {
                            if (res === null) {
                                this.validationMessage = MessageService.APPLY_LEAVE_1;
                                this.isValidationMessage = true;
                                this.formDisabled = true;
                                this.currentUserLeaveDetail = this.setLeaveDetailsEmpty();
                            } else {
                                this.currentUserLeaveDetail = res;
                                this.isAllDataDownloaded = true;
                                this.selectLeaveType(this.leaves[0]);
                                this.spinnerService.stopSpinner();

                            }
                        });
                    });
                });
            });

        });

        this.spinnerService.stopSpinner();





    }

    /** Show Leave Deatils Page */

    showLeaveDeatils() {
        let modal = this.modalCtrl.create(LeaveDetailsPage, { leaveDetails: this.currentUserLeaveDetail });
        modal.showBackButton(true);
        modal.present();
    }

    /** Select Leave type */

    getLeaveType(event: any) {
        this.isShowLeaveSelection = true;
    }

    selectLeaveType(leavetyepe: any) {

        this.isShowLeaveSelection = false;
        this.model.leaveType = leavetyepe.value;
        this.validateLeaveType();
    }




    submitForm() {
        if (this.addLeaveArr.length === 0) {
            this.validateLeaveType();
            if (!this.leaveTypeValid)
                return;
            this.onAddLeave();
            this.hideLeaveList = true;

        }
        this.spinnerService.createSpinner('Please wait..');
        setTimeout(() => {


            this.leaveService.submitLeaveRecord(this.addLeaveArr).subscribe(res => {
                if (res) {
                    this.spinnerService.stopSpinner();
                    //this.leaveStatusChanged.publish('Applied Leave', 'status');
                    //MessageService.addMessage({ severity: 'success', summary: 'Success', detail: MessageService.APPLY_LEAVE_2 });
                    // this.showToast(MessageService.APPLY_LEAVE_2);
                    this.toastPresent('Leave Applied successfully');
                    console.log('payload =>', this.addLeaveArr, 'res =>', res);
                    this.navCtrl.pop();
                } else {
                    this.spinnerService.stopSpinner();
                    this.toastPresent('Leave Applied successfully');
                    MessageService.addMessage({ severity: 'error', summary: 'Failed', detail: MessageService.REQUEST_FAILED });
                }
            });
        }, 250);
    }

    cancelLeave(leaveData: any) {
        var selectedIndex = this.addLeaveArr.indexOf(leaveData);
        this.addLeaveArr.splice(selectedIndex, 1);
    }

    onAddLeave() {
        var showAlert
        this.checkIfAlreadyAdded();
        if (!this.isValidationMessage) {
            let totalNoOfdays = moment(this.model.end).diff(this.model.start, 'days') + 1;
            for (let i = 0; i < totalNoOfdays; i++) {
                if (this.model.leaveType.Type === 'Half Day Leave' || this.model.leaveType.Type === 'Leave') {
                    if (moment(this.model.start).add(i, 'days').day() === 6 ||
                        moment(this.model.start).add(i, 'days').day() === 0 ||
                        this.checkHoliday(moment(this.model.start).add(i, 'days'))
                    ) {
                        continue;
                    }
                }
                let leave = {
                    NumberOfLeaves: this.model.leaveType.Value === '0.5' ? 0.5 : 1,
                    NumberOfDays: 1,
                    StartDate: moment(this.model.start).add(i, 'days'),
                    EndDate: moment(this.model.start).add(i, 'days'),
                    Reason: this.model.reason,
                    EmpID: this.userDetail.EmpID,
                    LeaveType: { ID: this.model.leaveType.ID, Value: this.model.leaveType.Name }
                };
                this.addLeaveArr.push(leave);
                this.isAddedLeave = true;
                //this.presentAlert('Leave Added');
                //
            }

        }
        console.log('leaves array => ', this.addLeaveArr);
        // this.presentAlert('Leave Added');
        //this.toastPresent('Leave Added');
        /** Reset view */
        this.removeFocus();

        // this.startSDate = this.navParams.get('date');
        // this.endEDate = this.navParams.get('date');
        // this.sdate = this.startSDate.toString();
        // this.edate = this.endEDate.toString();
        // this.model.start = this.navParams.get('date');
        // this.startChanged();
        // this.endChanged();

        // this.model.leaveType.Type = this.leaves[0].label;
        // this.validateLeaveTypeEvent(this.leaves[0].label);
    }

    deleteLeave(index: number) {
        this.addLeaveArr.splice(index, 1);
    }
    startChanged() {
        this.model.end = this.model.start;
        this.minDate = this.model.start;
        this.dayDiffCalc();
    }

    endChanged() {
        //this.strtDt = this.model.start;
        //this.endDt = this.model.end;
        this.dayDiffCalc();
    }

    validateLeaveTypeEvent(event) {
        console.log('ionChnage event=>', event);
        this.leaves.forEach((element, index) => {
            if (event == element.value.Type) {
                this.model.leaveType = element.value;
            }
        });
        this.validateLeaveType();
    }

    validateLeaveType() {
        this.model.leaveType = this.getLeaveTypeModel();
        console.log('leave type=>', this.model.leaveType);
        if (this.model.leaveType !== null) {
            this.leaveTypeValid = true;
            this.dayDiffCalc();
            return;
        }
    }
    getLeaveTypeModel() {
        var leavetypeid: number = this.model.leaveType.ID;
        var leavetype: any;
        this.leaves.forEach(element => {
            if (leavetypeid == element.value.ID) {
                leavetype = element.value;
            }
        });
        return leavetype;
    }

    reasonTextChanged() {
        this.charsLeft = 600 - this.model.reason.length;
    }
    focusremoved() {

    }

    dayDiffCalc() {
        this.itsWeekend = false;
        this.isValidationMessage = false;
        this.validationMessage = '';
        let leavevalue = 1;
        this.checkIfAlreadyAdded();
        let dayCount = (moment(this.model.end).diff(this.model.start, 'days') + 1);
        if (this.model.leaveType !== null) {
            let weekendCount = 0;
            // let holidayCount = 0;
            if (this.model.leaveType.Type === 'Half Day Absent (LWP)' || this.model.leaveType.Type === 'Half Day Leave') {
                leavevalue = 0.5;
            }
            if (this.model.leaveType.Type === 'Leave' || this.model.leaveType.Type === 'Half Day Leave') {
                weekendCount = this.getWeekEndCount(dayCount);
                this.checkPending((dayCount - weekendCount) * leavevalue);
            } else if (this.model.leaveType.Type === 'Marriage Leave') {
                weekendCount = this.getWeekEndCount(dayCount);
                this.checkMarriagePending((dayCount - weekendCount) * leavevalue);
            } else if (this.model.leaveType.Type === 'Paternity Leave') {
                weekendCount = this.getWeekEndCount(dayCount);
                this.checkPaternityPending((dayCount - weekendCount) * leavevalue);
            } else if (this.model.leaveType.Type === 'Maternity Leave') {
                this.checkMaternityPending((dayCount - weekendCount) * leavevalue);
            }
            this.model.numDays = (dayCount - weekendCount) * leavevalue;
            if (this.model.leaveType.Type === 'Half Day Absent (LWP)') {
                let weekendCountLWP = this.getWeekEndCount(dayCount);
                this.model.numDays = this.model.numDays + weekendCountLWP / 2;
            }
            this.checkForTraineeAndResigned();
        } else {
            this.model.numDays = dayCount;
        }
        this.checkIfAlreadyApplied();


    }
    checkIfAlreadyAdded() {
        let totalNoOfdays = moment(this.model.end).diff(this.model.start, 'days') + 1;
        for (let i = 0; i < this.addLeaveArr.length; i++) {
            for (let j = 0; j < totalNoOfdays; j++) {
                if (moment((this.model.start)).add(j, 'days').diff(this.addLeaveArr[i].StartDate) === 0) {
                    this.isValidationMessage = true;
                    this.validationMessage = MessageService.APPLY_LEAVE_13;
                    break;
                }
            }
        }
    }
    getWeekEndCount(dayCount: number) {
        let weekendCount = 0;
        for (let i = 0; i < dayCount; i++) {
            if (moment(this.model.start).add(i, 'days').day() === 6 ||
                moment(this.model.start).add(i, 'days').day() === 0 ||
                this.checkHoliday(moment(this.model.start).add(i, 'days'))) {
                weekendCount = weekendCount + 1;
            }
        }
        if (weekendCount === dayCount && this.model.leaveType.Type !== 'Half Day Absent (LWP)') {
            this.itsWeekend = true;
        }
        return weekendCount;
    }
    checkHoliday(date: any) {
        for (let i = 0; i < this.holidayList.length; i++) {
            if (moment(this.holidayList[i].HolidayDate).diff(date, 'days') === 0) {
                return true;
            }
        }
        return false;
    }
    checkPending(totalLeaveApplied: number) {
        if (this.currentUserLeaveDetail.ActualBalance - this.pendingLeaveCount.LeaveTotal < totalLeaveApplied) {
            if (this.pendingLeaveCount.LeaveTotal == 0) {
                this.validationMessage = MessageService.APPLY_LEAVE_3;
            } else {
                this.validationMessage = MessageService.APPLY_LEAVE_4;
            }
            this.isValidationMessage = true;
        }
    }
    checkMarriagePending(totalLeaveApplied: number) {
        let totalMarriageLeave = parseInt(this.model.leaveType.Value);
        let takenMarriageLeave = this.currentUserLeaveDetail.MarriageLeaveTaken;
        let pendingMarriageLeave = this.pendingLeaveCount.MarriageLeaveTotal;
        if (totalMarriageLeave - takenMarriageLeave - pendingMarriageLeave < totalLeaveApplied) {
            if (pendingMarriageLeave == 0) {
                this.validationMessage = MessageService.APPLY_LEAVE_5;
            } else {
                this.validationMessage = MessageService.APPLY_LEAVE_6;
            }
            this.isValidationMessage = true;
        }
    }
    checkPaternityPending(totalLeaveApplied: number) {
        let totalPaternityLeave = parseInt(this.model.leaveType.Value);
        let takenPaternityLeave = this.currentUserLeaveDetail.PaternityLeaveTaken;
        let pendingPaternityLeave = this.pendingLeaveCount.PaternityLeaveTotal;
        if (totalPaternityLeave - takenPaternityLeave - pendingPaternityLeave < totalLeaveApplied) {
            if (pendingPaternityLeave == 0) {
                this.validationMessage = MessageService.APPLY_LEAVE_7;
            } else {
                this.validationMessage = MessageService.APPLY_LEAVE_8;
            }
            this.isValidationMessage = true;
        }
    }
    checkMaternityPending(totalLeaveApplied: number) {
        let totalMaternityLeave = parseInt(this.model.leaveType.Value);
        let takenMaternityLeave = this.currentUserLeaveDetail.MaternityLeaveTaken;
        let pendingMaternityLeave = this.pendingLeaveCount.MaternityLeaveTotal;
        if (totalMaternityLeave - takenMaternityLeave - pendingMaternityLeave < totalLeaveApplied) {
            if (pendingMaternityLeave == 0) {
                this.validationMessage = MessageService.APPLY_LEAVE_9;
            } else {
                this.validationMessage = MessageService.APPLY_LEAVE_10;
            }
            this.isValidationMessage = true;
        }
    }
    checkIfAlreadyApplied() {
        if (this.model.leaveType !== null && !this.isValidationMessage) {
            let param = {
                LeaveType: { ID: this.model.leaveType.ID, Value: this.model.leaveType.Name },
                StartDate: this.model.start,
                EndDate: this.model.end
            };
            this.leaveService.checkIfAlreadyApplied(param).subscribe(res => {
                if (res.StartDate !== null && !this.isValidationMessage) {
                    this.validationMessage = 'You have already applied a leave from '
                        + moment(res.StartDate).format('DD/MM/YYYY') + ' to ' + moment(res.EndDate).format('DD/MM/YYYY');
                    this.isValidationMessage = true;
                }
            });
        }
    }
    checkForTraineeAndResigned() {
        if (this.model.leaveType.Type === 'Leave' || this.model.leaveType.Type === 'Half Day Leave') {
            if ((this.userDetail.Designation.Value === 'Trainee' ||
                this.userDetail.Status.Value === 'Resigned') && !this.isValidationMessage) {
                let param = {
                    LeaveType: { ID: this.model.leaveType.ID, Value: this.model.leaveType.Name },
                    StartDate: this.model.start,
                    EndDate: this.model.end,
                    NumberOfDays: this.model.numDays
                };
                this.leaveService.checkIfAlreadyAppliedForTrainee(param).subscribe(res => {
                    if (res !== null) {
                        if (parseInt(res.LeaveTotal) >= 1 || this.model.numDays > 1) {
                            this.validationMessage = MessageService.APPLY_LEAVE_11;
                            this.isValidationMessage = true;
                        } else if (parseInt(res.HalfdayLeaveTotal) >= 1 || this.model.numDays > 1) {
                            this.validationMessage = MessageService.APPLY_LEAVE_12;
                            this.isValidationMessage = true;
                        }
                    }
                });
            }
        }
    }


    showToast(message: string) {
        Toast.show(message, '5000', 'center').subscribe(
            toast => {
                //console.log(toast);
            }
        );
    }
    toastPresent(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 5000
        });
        toast.present();
    }

    presentAlert(msg: string) {
        let alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: msg,
            buttons: ['Dismiss']
        });
        alert.present();
    }

    setLeaveDetailsEmpty() {
        return {
            Employee: {
                Name: "",
                ID: 0
            },
            Status: {
                Value: "",
                ID: 0
            },
            Year: "0",
            EmpID: 0,
            PLB: '0',
            LeaveBalance: 0,
            LeaveTaken: 0,
            FloatingHolidayBalance: 0,
            FloatingHolidayTaken: 0,
            HalfdayLeaveTaken: 0,
            AbsentTaken: 0,
            HalfdayAbsentTaken: 0,
            YearStartDate: "",
            YearEndDate: "",
            AccruedLeave: 0,
            AdjustmentEntry: 0,
            ActualBalance: 0,
            AccruedFloatingHoliday: 0,
            ActualFHBalance: 0,
            FHAdjustmentEntry: 0,
            BRLB: 0,
            IsResigned: "",
            PaternityLeaveTaken: 0,
            PTLAvailedTime: 0,
            PaternityAdjustmentEntry: 0,
            MaternityLeaveTaken: 0,
            MTLAvailedTime: 0,
            MaternityAdjustmentEntry: 0,
            MarriageLeaveTaken: 0,
            MRLAvailedTime: 0,
            MarriageAdjustmentEntry: 0,
            ID: 0
        }


    }
}
