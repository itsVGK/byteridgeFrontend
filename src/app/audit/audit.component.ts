import { UserService } from '@/_services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'audit.component.html' })
export class AuditComponent implements OnInit {

    public users;

    constructor(
        private userService: UserService
    ) {
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }

}