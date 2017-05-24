import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController } from 'ionic-angular';
//import { Leave } from '../models/leave';
//import { LeaveDetail } from '../models/leaveDetail';
import { SpinnerService } from '../../../providers/index';
import { LeaveService } from '../index';
import { AuthService } from '../../../providers/index';
/** Third Party Dependencies */
//import { Observable } from 'rxjs/Rx';
import { Toast } from 'ionic-native';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment/moment';
import * as _ from 'lodash';

/*
  Generated class for the LeaveApprovalDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-leave-approval-detail',
    templateUrl: 'leave-approval-detail.html',
    providers: [LeaveService, SpinnerService, AuthService]
})
export class LeaveApprovalDetailPage {

    public leave: any;
    public leaveID: number;
    public userDetail: any;
    public comment: string;
    public approverList: any;
    public leaveList: any;
    public isPending: boolean;
    public isUserHR: boolean;
    commentForm: FormGroup;
    submitted: boolean;
    public startDate: string;
    public endDate: string;
    public ishowLeaveDetails: boolean;
    public status: string;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public leaveService: LeaveService,
        public spinnerService: SpinnerService,
        public auth: AuthService,
        public formBuilder: FormBuilder,
        public leaveStatusChangedEvent: Events,
        public toastCtrl: ToastController) {
        this.leave = navParams.get('leave');
        this.leaveID = this.leave.LeaveRequestMasterId;
        this.comment = '';
        this.isPending = false;
        this.isUserHR = this.auth.checkPermission('LEAVE.HRAPPROVAL.UPDATE');
        this.ishowLeaveDetails = false;
        this.commentForm = formBuilder.group({
            comment: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(600), Validators.required])]
        });
    }

    ionViewDidLoad() {
        this.getLeaveDetails();
    }

    getLeaveDetails() {
        this.spinnerService.createSpinner('Please wait..');
        this.leaveService.getLeaveDetailByRefID(this.leaveID).subscribe(
            res => {
                this.leaveList = res;
                this.getEmployeeDetails(this.leaveList[0].EmpID);
                this.status = this.leaveList[0].Status;
                if (this.leaveList[0].Status == 'Pending') {
                    this.isPending = true;
                }
                this.startDate = moment(this.leaveList[0].StartDate).format('YYYY-MM-DD');
                this.endDate = moment(this.leaveList[0].EndDate).format('YYYY-MM-DD');
            },
            error => {
                this.spinnerService.stopSpinner();
            });
        this.leaveService.getApproverListByRefID(this.leaveID).subscribe(
            res => {
                this.approverList = this.makeArrayDistinct(res);
            },
            error => {
                this.spinnerService.stopSpinner();
            });

    }

    getEmployeeDetails(id: any) {
        this.leaveService.getEmployeeDetail(id).subscribe(
            res => {
                this.ishowLeaveDetails = true;
                this.userDetail = res;
                this.spinnerService.stopSpinner();
            },
            error => {
                this.spinnerService.stopSpinner();
            });
    }



    /** Approve Reject API */

    approveClicked() {

        if (this.comment.trim().length > 2) {
            var params = {
                Comments: this.comment.trim(),
                Status: 'Approved',
                LeaveRequestRefId: this.leaveID,
                Employee: this.userDetail.Employee
            };
            this.spinnerService.createSpinner('Please wait..');
            this.leaveService.singleLeaveApprove(params)
                .subscribe(res => {
                    if (res.StatusCode == 1) {
                        this.spinnerService.stopSpinner();
                        this.toastPresent('Leave has been approved');
                        //this.leaveStatusChangedEvent.publish('Changed Leave Status', 'status');
                        this.navCtrl.pop();
                    } else {
                        this.toastPresent(res.ErrorMsg);
                        this.spinnerService.stopSpinner();
                    }
                },
                error => {
                    this.toastPresent('Failed to approve Leave.');
                    this.spinnerService.stopSpinner();
                });
            this.spinnerService.stopSpinner();
        }
    }


    rejectClicked() {

        if (this.comment.trim().length > 2) {
            //    BACKEND CALL HERE
            var params = {
                Comments: this.comment.trim(),
                Status: 'Rejected',
                LeaveRequestRefId: this.leaveID,
                startdate: this.leave.StartDate,
                enddate: this.leave.EndDate
            };
            this.spinnerService.createSpinner('Please wait..');
            this.leaveService.singleLeaveReject(params)
                .subscribe(res => {
                    if (res.StatusCode == 1) {
                        this.spinnerService.stopSpinner();
                        this.toastPresent('Leave is rejected successfully!');
                        //this.leaveStatusChangedEvent.publish('Changed Leave Status', 'status');
                        this.navCtrl.pop();
                    } else {
                        this.toastPresent(res.ErrorMsg);
                        this.spinnerService.stopSpinner();
                    }
                },
                error => {
                    this.toastPresent('Failed to reject Leave!');
                    this.spinnerService.stopSpinner();
                });
            this.spinnerService.stopSpinner();
        }
    }

    toastPresent(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 5000
        });
        toast.present();
    }

    showToast(message: string) {
        Toast.show(message, '5000', 'center').subscribe(
            toast => {
            }
        );
    }

    makeArrayDistinct(param: any) {
        let distinct = [];
        distinct = _.uniqBy(param, (e) => {
            return e.Approver.ID;
        });
        return distinct;
    }


}
