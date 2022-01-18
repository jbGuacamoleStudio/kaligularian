import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ROUTES } from './shared/routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'kaligularian';
  routes = ROUTES;
}
