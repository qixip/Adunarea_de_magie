import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavLink } from '../../models/nav-link.model';

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
    { label: 'Prezentare', path: '/', fragment: 'prezentare' },
    { label: 'Evenimente', path: '/evenimente' },
    { label: 'Galerie',    path: '/galerie' }
  ];

  rightLinks: NavLink[] = [
    { label: 'Contact', path: '/', fragment: 'contact' }
  ];

  navLinks: NavLink[] = [...this.leftLinks, ...this.rightLinks, { label: 'Login', path: '/auth' }];

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => { this.isMobileOpen = false; });
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