import { Component, EventEmitter, Input, Output } from '@angular/core';

export type AuthTab = 'login' | 'register';

@Component({
  selector: 'app-auth-tabs',
  standalone: false,
  templateUrl: './auth-tabs.component.html',
  styleUrls: ['./auth-tabs.component.scss']
})
export class AuthTabsComponent {
  @Input() activeTab: AuthTab = 'login';
  @Output() tabChange = new EventEmitter<AuthTab>();

  selectTab(tab: AuthTab): void {
    this.tabChange.emit(tab);
  }
}
