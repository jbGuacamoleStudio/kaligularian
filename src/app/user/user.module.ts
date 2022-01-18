import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';

@NgModule({
  declarations: [LoginComponent, LogoutComponent],
  imports: [CommonModule, UserRoutingModule],
  providers: [UserService],
})
export class UserModule {}
