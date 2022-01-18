import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [LoginComponent, LogoutComponent],
  imports: [CommonModule, UserRoutingModule, ReactiveFormsModule, SharedModule],
})
export class UserModule {}
