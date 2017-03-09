import { Injectable } from '@angular/core';
import {LoadingController} from 'ionic-angular';
import { Events } from 'ionic-angular';
 @Injectable()
export class SpinnerService {
    public loader :any;
    constructor( public loading: LoadingController,public unauthorizedEvent:Events) {
        
    }
    createSpinner(msg:string)
    {
      this.loader = this.loading.create({
            content: msg
            });
            this.loader.present();
    }
    stopSpinner()
    {
        this.loader.dismiss();
    }
}