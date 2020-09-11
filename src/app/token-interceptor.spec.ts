import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController,} from "@angular/common/http/testing";
import {TokenInterceptor} from "./token-interceptor";

import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {OidcSecurityService} from "angular-auth-oidc-client";

describe(`AuthHttpInterceptor`, () => {
  const service = jasmine.createSpyObj("OidcSecurityService", ["getToken", "forceRefreshSession"]);
  let httpMock: HttpTestingController;
  let httpClientMock: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: OidcSecurityService,
          useValue: service
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]

    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClientMock = TestBed.inject(HttpClient);

  });

  it("should add an Authorization header", (done) => {
    service.getToken.and.returnValue("FOOOO");

    httpClientMock.get("/data").subscribe(
      response => {
        expect(response).toBeTruthy();
        done();
      }
    );

    const req = httpMock.expectOne(r => r.headers.has("Authorization"));
    expect(req.request.method).toEqual("GET");

    req.flush({hello: "world"});
  });
});
