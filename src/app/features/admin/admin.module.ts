import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { SharedModule } from '../../shared/shared.module';
import { AdminComponent } from './admin.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';
import { AddEventComponent } from './components/add-event/add-event.component';

const routes: Routes = [
  { path: '', component: AdminComponent }
];

@NgModule({
  declarations: [AdminComponent, QrScannerComponent, AddEventComponent],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ZXingScannerModule,
  ],
})
export class AdminModule {}
