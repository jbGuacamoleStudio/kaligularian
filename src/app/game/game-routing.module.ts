import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewComponent } from './new/new.component';

const routes: Routes = [
  { path: 'new', component: NewComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
