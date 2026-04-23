import { NgModule } from '@angular/core';
import { PricingRoutingModule } from './pricing-routing.module';
import { PricingComponent } from './pricing.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PricingComponent
  ],
  imports: [
    SharedModule,
    PricingRoutingModule
  ]
})
export class PricingModule { }