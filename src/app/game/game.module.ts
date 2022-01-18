import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CaseComponent } from './case/case.component';
import { GameRoutingModule } from './game-routing.module';
import { NewComponent } from './new/new.component';

@NgModule({
  declarations: [NewComponent, CaseComponent],
  imports: [CommonModule, GameRoutingModule],
})
export class GameModule {}
