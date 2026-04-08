import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeHeroSectionComponent } from './components/home-hero-section/home-hero-section.component';
import { HomeEventsPreviewSectionComponent } from './components/home-events-preview-section/home-events-preview-section.component';
import { HomeContactSectionComponent } from './components/home-contact-section/home-contact-section.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Acasa – Adunarea de Magie' }
];

@NgModule({
  declarations: [
    HomeComponent,
    HomeHeroSectionComponent,
    HomeEventsPreviewSectionComponent,
    HomeContactSectionComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule {}