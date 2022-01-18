import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ROUTES } from './shared/routes';
import { User } from './user/models/user';
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

  get user$(): Observable<User | undefined> {
    return this._userService.user$;
  }

  constructor(private _userService: UserService) {}
}
