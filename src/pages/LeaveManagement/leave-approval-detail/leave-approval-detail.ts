import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Leave } from '../models/leave';
import { LeaveDetail } from '../models/leaveDetail';
import { SpinnerService } from '../../../providers/index';
import { LeaveService } from '../index';
/** Third Party Dependencies */
import { Observable } from 'rxjs/Rx';
import { Toast } from 'ionic-native';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment/moment';

/*
  Generated class for the LeaveApprovalDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-leave-approval-detail',
    templateUrl: 'leave-approval-detail.html',
    providers: [LeaveService, SpinnerService]
})
export class LeaveApprovalDetailPage {

    public leave: any;
    public leaveID: number;
    public userDetail: any;
    public comment: string;
    public approverList: any;
    public leaveList: any;
    public isPending: boolean;
    commentForm: FormGroup;
    submitted: boolean;
    public startDate: string;
    public endDate: string;
    public ishowLeaveDetails: boolean;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public leaveService: LeaveService,
        public spinnerService: SpinnerService,
        public formBuilder: FormBuilder,
        public leaveStatusChangedEvent: Events) {
        this.leave = navParams.get('leave');
        this.leaveID = this.leave.LeaveRequestMasterId;
        this.comment = '';
        this.isPending = false;
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
                this.approverList = res;
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
                LeaveRequestRefId: this.leaveID
            };
            this.spinnerService.createSpinner('Please wait..');
            this.leaveService.singleLeaveApprove(params)
                .subscribe(res => {
                    if (res) {
                        this.spinnerService.stopSpinner();
                        this.showToast('Leave is approved successfully!');
                        //this.leaveStatusChangedEvent.publish('Changed Leave Status', 'status');
                        this.navCtrl.pop();
                    } else {
                        this.showToast('Failed to approve Leave.');
                        this.spinnerService.stopSpinner();
                    }
                },
                error => {
                    this.showToast('Failed to approve Leave.');
                    this.spinnerService.stopSpinner();
                });
        }
    }


    rejectClicked() {

        if (this.comment.trim().length > 2) {
            //    BACKEND CALL HERE
            var params = {
                Comments: this.comment.trim(),
                Status: 'Rejected',
                LeaveRequestRefId: this.leaveID
            };

            this.leaveService.singleLeaveReject(params)
                .subscribe(res => {
                    if (res) {
                        this.spinnerService.stopSpinner();
                        this.showToast('Leave is rejcted successfully!');
                        //this.leaveStatusChangedEvent.publish('Changed Leave Status', 'status');
                        this.navCtrl.pop();
                    } else {
                        this.showToast('Failed to reject Leave!');
                        this.spinnerService.stopSpinner();
                    }
                },
                error => {
                    this.showToast('Failed to reject Leave!');
                    this.spinnerService.stopSpinner();
                });
        }
    }

    showToast(message: string) {
        //     Toast.show(message, '5000', 'center').subscribe(
        //   toast => {
        //     console.log(toast);
        //   }
        // );
    }


}
