import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TermeniComponent } from './termeni/termeni.component';
import { ConfidentialitateComponent } from './confidentialitate/confidentialitate.component';

const routes: Routes = [
  { path: 'termeni',           component: TermeniComponent,           title: 'Termeni și condiții – Adunarea de Magie' },
  { path: 'confidentialitate', component: ConfidentialitateComponent, title: 'Politică de confidențialitate – Adunarea de Magie' },
];

@NgModule({
  declarations: [TermeniComponent, ConfidentialitateComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class LegalModule {}
