import { Injectable } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbRoleProvider } from '@nebular/security';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleService implements NbRoleProvider {

  constructor(private authService: NbAuthService) { }
    getRole(): Observable<string | string[]> {
        throw new Error('Method not implemented.');
    }

  getEmail(): Observable<string> {
    return this.authService.getToken()
      .pipe(
        map((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            return token.getPayload().upn;
          }
        }),
      );
  }

  isGrantedEmail(email: string): Observable<boolean> {
    return this.authService.getToken()
      .pipe(
        map((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            return token.getPayload().upn === email;
          }
        }),
      );
  }

  getFirstName(): Observable<string> {
    return this.authService.onTokenChange()
      .pipe(
        map((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            return token.getPayload().given_name;
          }
        }),
      );
  }

  isTemporalToken(): Observable<boolean> {
    return this.authService.onTokenChange()
      .pipe(
        map((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            return !token.getPayload().groups.length;
          }
          return false;
        }),
      );
  }

  dueChangePassword(): Observable<boolean> {
    return this.authService.onTokenChange()
      .pipe(
        map((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            return !token.getPayload().email_verified;
          }
        }),
      );
  }

  getUserId(): Observable<string> {
    return this.authService.getToken()
      .pipe(
        map((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            return token.getPayload().kid;
          }
        }),
      );
  }

}