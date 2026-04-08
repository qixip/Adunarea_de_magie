import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'evenimente',
    loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'galerie',
    loadChildren: () => import('./features/gallery/gallery.module').then(m => m.GalleryModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 80]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}