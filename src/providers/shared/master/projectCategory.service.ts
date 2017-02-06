/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Module Level Dependencies */
import { BaseService } from '../../index';

/** Context for service calls */
const CONTEXT = 'projectCategoryMaster';

/** Service Definition */
@Injectable()
export class ProjectCategoryService extends BaseService {
    constructor(public http: Http) {
        super(http, CONTEXT);
    }
    getProjectCategory() {
        return this.getList$(0, 0, true).map(res => res.json());
    }
}
