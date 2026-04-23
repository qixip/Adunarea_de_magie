import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { PlayerCardModalComponent } from './components/player-card-modal/player-card-modal.component';
import { XpBarComponent } from './components/xp-bar/xp-bar.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    PlayerCardModalComponent,
    XpBarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    QRCodeComponent,
  ],
  exports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    PlayerCardModalComponent,
    XpBarComponent,
  ],
})
export class SharedModule {}
