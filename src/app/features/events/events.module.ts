import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { EventsComponent } from './events.component';
import { EventsHeroComponent } from './components/events-hero/events-hero.component';
import { EventsFilterToolbarComponent } from './components/events-filter-toolbar/events-filter-toolbar.component';
import { EventCardComponent } from './components/event-card/event-card.component';

const routes: Routes = [
  { path: '', component: EventsComponent, title: 'Evenimente – Adunarea de Magie' }
];

@NgModule({
  declarations: [
    EventsComponent,
    EventsHeroComponent,
    EventsFilterToolbarComponent,
    EventCardComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class EventsModule {}