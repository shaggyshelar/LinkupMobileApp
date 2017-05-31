import { Component } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { NavController, NavParams, ViewController, ToastController, Platform } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

/** Third Party Dependencies */
import { FormlyFieldConfig } from 'ng-formly';


@Component({
    selector: 'startup-notice-modal',
    templateUrl: 'startup-notice-modal.html'
})
export class StartupNoticeModal {
    pageFields: any[];
    pageDetails: any;
    form: FormGroup = new FormGroup({});
    userFields: FormlyFieldConfig;

    constructor(public navCtrl: NavController, public navParams: NavParams
        , public viewCtrl: ViewController
        , public platform: Platform
    ) {
        this.pageFields = this.navParams.data.pageFields;
        this.pageDetails = this.navParams.data.pageDetails;
        this.userFields = [{
            className: 'ready-made-form',
            fieldGroup: this.pageFields
        }];
        console.log('data => ', this.navParams);
        this.determineUI();
    }

    closeModal() {
        this.viewCtrl.dismiss({
        });
    }

    openUrl() {
        this.platform.ready().then(() => {
            let browser = new InAppBrowser(this.pageDetails.redirectTo.url, '_system');
        });
    }

    determineUI() {

    }

    submitClick() {
        console.log(this.form);
    }

}
