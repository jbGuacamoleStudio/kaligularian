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
  constructor(private _userService: UserService, private _router: Router) {}

  logout(): void {
    this._userService.logout();
    this._router.navigate([ROUTES.home]);
  }
}
