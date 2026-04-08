import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { GalleryComponent } from './gallery.component';

const routes: Routes = [
  { path: '', component: GalleryComponent, title: 'Galerie – Adunarea de Magie' }
];

@NgModule({
  declarations: [GalleryComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class GalleryModule {}