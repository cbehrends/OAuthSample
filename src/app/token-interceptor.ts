import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, filter, switchMap, take} from "rxjs/operators";
import {OidcSecurityService} from "angular-auth-oidc-client";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  public RefreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: OidcSecurityService) {  }

  private static addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (!token) {
      return next.handle(request);
    }
    request = TokenInterceptor.addToken(request, token);
    return next.handle(request)
      .pipe(
        catchError(error => {
          return throwError(error);
        }));
  }
}
