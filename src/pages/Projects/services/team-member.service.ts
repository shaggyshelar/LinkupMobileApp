/** Angular Dependencies */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/** Third Party Dependencies */
//import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { MessageService } from '../../../providers/shared';


/** Module Level Dependencies */
import { BaseService } from '../../../providers/shared';
//import { Project } from '../models/project';

/** Context for service calls */
const CONTEXT = 'TeamMembers';

/** Service Definition */
@Injectable()
export class TeamMemberService extends BaseService {
    constructor(public http: Http) {
        super(http, CONTEXT);
    }
    getTeamByProject(id: string) {
        return this
            .getChildList$(id, 0, 0, true)
            .map(res => res.json());
    }
}
