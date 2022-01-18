import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'user',
    loadChildren: (): Promise<unknown> =>
      import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'game',
    loadChildren: (): Promise<unknown> =>
      import('./game/game.module').then((m) => m.GameModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
