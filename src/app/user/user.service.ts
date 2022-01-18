import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { CREDENTIALS_MOCK } from './mock/credential.mock';
import { Credentials } from './models/credentials';
import { User } from './models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _userSource = new BehaviorSubject<User | undefined>(undefined);
  user$ = this._userSource.asObservable();

  constructor() {}

  login(credentials: Credentials): Observable<User | undefined> {
    if (JSON.stringify(credentials) === JSON.stringify(CREDENTIALS_MOCK)) {
      this._userSource.next({ id: '1', username: 'JohnDoe' });
    }
    return this.user$;
  }

  logout(): void {
    this._userSource.next(undefined);
  }
}
