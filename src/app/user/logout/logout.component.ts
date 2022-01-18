import { BehaviorSubject, of } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { ROUTES } from 'src/app/shared/routes';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  private _loadingSource = new BehaviorSubject<boolean>(false);
  loading$ = this._loadingSource.asObservable();

  constructor(private _userService: UserService, private _router: Router) {}

  logout(): void {
    of(null)
      .pipe(
        take(1),
        tap(() => this._loadingSource.next(true)),
        delay(1000),
        tap(() => this._userService.logout()),
        tap(() => this._router.navigate([ROUTES.home]))
      )
      .subscribe();
  }
}
