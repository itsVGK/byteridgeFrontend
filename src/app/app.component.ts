import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, AuthenticationService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout()
            .pipe()
            .subscribe(
                data => {
                },
                error => {
                    this.alertService.error(error);
                });
        this.router.navigate(['/login']);
    }
}