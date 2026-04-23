import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockAuthInterceptor } from './interceptors/mock-auth.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

@NgModule({
  imports: [CommonModule],
  providers: [
    // MockAuthInterceptor must be first - it short-circuits auth calls in dev mode
    // so they never reach JwtInterceptor or the real HTTP layer.
    { provide: HTTP_INTERCEPTORS, useClass: MockAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor,     multi: true }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('CoreModule must only be imported in AppModule');
    }
  }
}
