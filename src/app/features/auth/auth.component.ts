import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthTab } from './components/auth-tabs/auth-tabs.component';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  activeTab: AuthTab = 'login';
  isLoading = false;
  loginError: string | null = null;
  registerError: string | null = null;
  registerSuccess = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name:            ['', [Validators.required, Validators.minLength(2)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator('password', 'confirmPassword') });
  }

  switchTab(tab: AuthTab): void {
    this.activeTab = tab;
    this.loginError = null;
    this.registerError = null;
    this.registerSuccess = false;
  }

  onLogin(): void {
    if (this.loginForm.invalid || this.isLoading) return;
    this.isLoading = true;
    this.loginError = null;
    const { email, password } = this.loginForm.value;

    this.auth.login(email, password)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: HttpErrorResponse) => {
          this.loginError = this.resolveLoginError(err);
        }
      });
  }

  onRegister(): void {
    if (this.registerForm.invalid || this.isLoading) return;
    this.isLoading = true;
    this.registerError = null;
    const { name, email, password } = this.registerForm.value;

    this.auth.register(name, email, password)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.registerSuccess = true;
          this.registerForm.reset();
          setTimeout(() => this.switchTab('login'), 2000);
        },
        error: (err: HttpErrorResponse) => {
          this.registerError = this.resolveRegisterError(err);
        }
      });
  }

  private resolveLoginError(err: HttpErrorResponse): string {
    switch (err.status) {
      case 401:
      case 404: return 'Email sau parola incorectă. Încearcă din nou.';
      case 429: return 'Prea multe încercări. Încearcă mai târziu.';
      case 0:   return 'Nu se poate conecta la server. Verifică conexiunea.';
      default:  return 'A apărut o eroare neașteptată. Încearcă din nou.';
    }
  }

  private resolveRegisterError(err: HttpErrorResponse): string {
    switch (err.status) {
      case 409: return 'Există deja un cont cu acest email.';
      case 422: return 'Date invalide. Verifică câmpurile și încearcă din nou.';
      case 0:   return 'Nu se poate conecta la server. Verifică conexiunea.';
      default:  return 'Nu s-a putut crea contul. Încearcă din nou.';
    }
  }
}
