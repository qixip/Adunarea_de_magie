import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavLink } from '../../models/nav-link.model';
import { AuthService } from '../../../core/services/auth.service';
import { PlayerCardModalService } from '../../../core/services/player-card-modal.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  isMobileOpen = false;

  leftLinks: NavLink[] = [
    { label: 'Prezentare', path: '/', fragment: 'despre' },
    { label: 'Evenimente', path: '/evenimente' },
    { label: 'Preturi',    path: '/preturi' },
    { label: 'Galerie',    path: '/galerie' }
  ];

  rightLinks: NavLink[] = [
    { label: 'Contact', path: '/', fragment: 'contact' }
  ];

  navLinks: NavLink[] = [...this.leftLinks, ...this.rightLinks, { label: 'Login', path: '/auth' }];

  /** Nav links shown in the mobile dropdown (login handled separately by the 4-slot bar). */
  mobileNavLinks: NavLink[] = [...this.leftLinks, ...this.rightLinks];

  constructor(
    public router: Router,
    public auth: AuthService,
    private playerCardModal: PlayerCardModalService,
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => { this.isMobileOpen = false; });
  }

  get firstName(): string {
    const name = this.auth.currentUser?.name ?? '';
    return name.split(' ')[0];
  }

  openPlayerCard(): void {
    this.isMobileOpen = false;
    this.playerCardModal.open();
  }

  logout(): void {
    this.auth.logout();
    this.isMobileOpen = false;
    this.playerCardModal.close();
    this.router.navigate(['/']);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }

  toggleMobile(): void {
    this.isMobileOpen = !this.isMobileOpen;
  }

  navigate(link: NavLink): void {
    this.isMobileOpen = false;
    if (link.fragment) {
      this.router.navigate([link.path], { fragment: link.fragment }).then(() => {
        setTimeout(() => {
          const el = document.getElementById(link.fragment!);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      });
    } else {
      this.router.navigate([link.path]);
    }
  }
}