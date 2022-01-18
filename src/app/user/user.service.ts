import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { CREDENTIALS_MOCK } from './mock/credential.mock';
import { Credentials } from './models/credentials';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _isAuthenticatedSource = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticatedSource.asObservable();

  constructor() {}

  login(credentials: Credentials): Observable<boolean> {
    if (JSON.stringify(credentials) === JSON.stringify(CREDENTIALS_MOCK)) {
      this._isAuthenticatedSource.next(true);
    }
    return this.isAuthenticated$;
  }

  logout(): void {
    this._isAuthenticatedSource.next(false);
  }
}
