import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthComponent } from './auth.component';
import { AuthBrandComponent } from './components/auth-brand/auth-brand.component';
import { AuthTabsComponent } from './components/auth-tabs/auth-tabs.component';
import { AuthLoginFormComponent } from './components/auth-login-form/auth-login-form.component';
import { AuthRegisterFormComponent } from './components/auth-register-form/auth-register-form.component';

const routes: Routes = [
  { path: '', component: AuthComponent, title: 'Autentificare – Adunarea de Magie' }
];

@NgModule({
  declarations: [
    AuthComponent,
    AuthBrandComponent,
    AuthTabsComponent,
    AuthLoginFormComponent,
    AuthRegisterFormComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule {}