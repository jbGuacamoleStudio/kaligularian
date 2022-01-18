import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ROUTES } from './shared/routes';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'kaligularian';
  routes = ROUTES;

  get isAuthenticated$(): Observable<boolean> {
    return this._userService.isAuthenticated$;
  }

  constructor(private _userService: UserService) {}
}
