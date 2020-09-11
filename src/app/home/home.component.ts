import { Component, OnInit } from '@angular/core';
import { OidcClientNotification, OidcSecurityService, PublicConfiguration } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
    configuration: PublicConfiguration;
    userDataChanged$: Observable<OidcClientNotification<any>>;
    userData$: Observable<any>;
    isAuthenticated$: Observable<boolean>;

    constructor(public oidcSecurityService: OidcSecurityService) {}

    ngOnInit() {
        this.configuration = this.oidcSecurityService.configuration;
        this.userData$ = this.oidcSecurityService.userData$;
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
    }

    login() {
        this.oidcSecurityService.authorize();
    }

    forceRefreshSession() {
        this.oidcSecurityService.forceRefreshSession().subscribe((result) => console.warn(result));
    }
    logout() {
        this.oidcSecurityService.logoff();
    }
}
