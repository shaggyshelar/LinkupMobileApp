import { Injectable } from '@angular/core';
import {ToastController } from 'ionic-angular';
 @Injectable()
export class ToastService {
    public toast :any;
    constructor( public toastCtrl: ToastController ) {
        
    }
    createToast(msg:string){
        this.toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        this.toast.present();
    }
}