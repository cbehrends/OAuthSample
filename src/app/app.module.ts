import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AuthModule, EventTypes, LogLevel, OidcConfigService, PublicEventsService } from 'angular-auth-oidc-client';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import {TokenInterceptor} from './token-interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

export function configureAuth(oidcConfigService: OidcConfigService) {
    return () =>
      oidcConfigService.withConfig({
        stsServer: 'http://rydev-ldock01.cpsinet.com:8088/auth/realms/Development',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'tasking-pkce',
        scope: 'openid profile email',
        responseType: 'code',
        useRefreshToken: false,
        silentRenew: true,
        disableIatOffsetValidation: true,
        silentRenewUrl: `${window.location.origin}/silent-renew.html`,
        renewTimeBeforeTokenExpiresInSeconds: 10,
        logLevel: environment.production ? LogLevel.None : LogLevel.None,
      });
        // oidcConfigService.withConfig({
        //     stsServer: 'https://offeringsolutions-sts.azurewebsites.net',
        //     redirectUrl: window.location.origin,
        //     postLogoutRedirectUri: window.location.origin,
        //     clientId: 'angularClient',
        //     scope: 'openid profile email',
        //     responseType: 'code',
        //     silentRenew: true,
        //     silentRenewUrl: `${window.location.origin}/silent-renew.html`,
        //     renewTimeBeforeTokenExpiresInSeconds: 10,
        //     logLevel: environment.production ? LogLevel.None : LogLevel.Debug,
        // });
}

@NgModule({
    declarations: [AppComponent, HomeComponent, UnauthorizedComponent],
    imports: [
      AuthModule.forRoot(),
      BrowserModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'forbidden', component: UnauthorizedComponent },
            { path: 'unauthorized', component: UnauthorizedComponent },
        ]),
    ],
    providers: [
        OidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: configureAuth,
            deps: [OidcConfigService],
            multi: true,
        },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private readonly eventService: PublicEventsService) {
        this.eventService
            .registerForEvents()
            .pipe(filter((notification) => notification.type === EventTypes.ConfigLoaded))
            .subscribe((config) => console.log('ConfigLoaded', config));
    }
}
