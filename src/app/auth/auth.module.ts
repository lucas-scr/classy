import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthModule } from 'angular-oauth2-oidc';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [],
  imports: [
    OAuthModule,
    CommonModule,
    AuthRoutingModule,
    LoginComponent
  ]
})
export class AuthModule { }
