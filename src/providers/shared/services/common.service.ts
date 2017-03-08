import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CommonService {
    static instance: CommonService;
    static isCreating: Boolean = false;
    public loadingStatusChange = new Subject<string>();
    onloadingStatusChange$ = this.loadingStatusChange.asObservable();


    constructor() {
        if (!CommonService.isCreating) {
            throw new Error("You can't call new in Singleton instances! Call CommonService.getInstance() instead.");
        }
    }
    static getInstance() {
        if (CommonService.instance == null) {
            CommonService.isCreating = true;
            CommonService.instance = new CommonService();
            CommonService.isCreating = false;
        }
        return CommonService.instance;
    }

    blockUI(): any {
        this.loadingStatusChange.next('true');
    }

    unblockUI(): any {
        this.loadingStatusChange.next('false');
    }

}
